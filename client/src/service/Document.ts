import { StatusCodes } from "http-status-codes";
import fetch from "node-fetch";
import {GlobalWorkerOptions, PDFWorker, getDocument} from "pdfjs-dist";
import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import AuthService from "./Auth";
import {storage} from "./Firebase";
import { SERVICE_URL } from "./ServiceConfig";
import {nanoid} from "nanoid";

export type Document = {
    id: string,
    name: string
    createdAt: Date,
    previewUrl: string,
    documentUrl: string,
    previewBlobId: string,
    documentBlobId: string,
    size: number,
    state: string,
    jobError: string,
    userId: string
}

export type DocumentUpload = {
    file: File,
    name: string,
    size: string,
    preview: Blob,
    previewUrl: string,
};

export const DOCUMENT_STATES = {
    QUEUED: "QUEUED",
    GENERATING: "GENERATING",
	FINISHED: "FINISHED",
	FAILED: "FAILED"
};

export const PREVIEW_WIDTH = 200;

export const MAX_UPLOAD_SIZE = 5000000; // 5mb

GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.js";

class DocumentService {

    private static async toBuffer(file: File){
        const reader = new FileReader();
        reader.readAsArrayBuffer(file)
        return new Promise<ArrayBuffer>((resolve, reject) => {
            reader.onload = () => {
                resolve(reader.result as ArrayBuffer);
            };

            reader.onerror = () => {
                reject("failed to load the document");
            }
        });
    }

    private static async getSnapshot(page: PDFPageProxy){
        const captureBlob = (ctx : CanvasRenderingContext2D) => {
            return new Promise<Blob>((resolve, reject) => {
                ctx.canvas.toBlob((blob) => {
                    if(blob){
                        resolve(blob)
                    }
                    else{
                        reject("unable to create a blob of the first page")
                    }
                }, "image/png");
            });
        }

        let initalWidth = page.getViewport({scale: 1}).width;
        const SCALE = PREVIEW_WIDTH / initalWidth;

        const viewport = page.getViewport({scale: SCALE});
        const {height, width} = viewport;

        const canvas = document.createElement("canvas");
        canvas.height = height;
        canvas.width = width; 

        const ctx : any = canvas.getContext("2d");

        const renderTask = page.render({
            canvasContext: ctx,
            viewport: viewport
        });

        await renderTask.promise;

        const snapshot = await captureBlob(ctx);
        
        canvas.remove();
        return snapshot;
    }

    static async generatePreviewBlob(file: File){
        let buffer;
        try{
            buffer = await DocumentService.toBuffer(file); 
        }
        catch(error){
            throw Error(`failed to load the document ${file.name}`);
        }
        const byteArray = new Uint8Array(buffer);
        const worker = new PDFWorker({name: `PDFWorker ${new Date().toLocaleDateString()}`});
        const loadTask = getDocument({
            worker: worker,
            data: byteArray
        });
        
        const pdf = await loadTask.promise;
        const page = await pdf.getPage(1);
        const preview = await DocumentService.getSnapshot(page);
        
        loadTask.destroy();
        worker.destroy();
        return preview as Blob;
    }

    private static async uploadBlobs(creatorId:string, previewBlob: Blob, documentBlob: Blob){

        const previewBlobId = nanoid();
        const documentBlobId = nanoid();

        const storageRef = storage.ref();
        const previewRef = storageRef.child(`${creatorId}/${previewBlobId}.png`);
        const documentRef = storageRef.child(`${creatorId}/${documentBlobId}.pdf`);

        const uploads = [previewRef.put(previewBlob), documentRef.put(documentBlob)];
        try{
            const snapshots = await Promise.all(uploads);
            const [previewUrl, documentUrl] = await Promise.all(snapshots.map((snapshot) => snapshot.ref.getDownloadURL())) as string[];
            return {
                previewUrl,
                documentUrl,
                previewBlobId,
                documentBlobId,
            };
        }
        catch(error){
            throw Error(error.message);
        }
    }

    static async createDocument(document:DocumentUpload){
        const userId = AuthService.getUser().uid;
        
        let requestBody : any = {
            name: document.name,
            userId: userId,
            size: document.size
        };

        try {
            const {previewUrl, documentUrl, previewBlobId, documentBlobId} = await DocumentService.uploadBlobs(userId, document.preview, document.file);
            requestBody = {previewUrl, documentUrl, previewBlobId, documentBlobId, ...requestBody};
        }
        catch (error) {
            throw Error(`unable to upload pdf & preview image ${error.message}`);
        }

        const url = new URL("/document/create", SERVICE_URL);
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${await AuthService.getAccessToken()}`
        };

        const response = await fetch(url, {
            headers: headers,
            body: JSON.stringify(requestBody),
            method: "POST"
        });

        if(response.status === StatusCodes.BAD_REQUEST){
            throw Error("invalid request body");
        }

        const responseBody = await response.json();
        if(response.status === StatusCodes.INTERNAL_SERVER_ERROR){
            throw Error(responseBody.error);
        }

        URL.revokeObjectURL(document.previewUrl);
        responseBody.createdAt = new Date(responseBody.createdAt);
        return responseBody as Document;
    }

    static async getDocuments(userId:string) {
        const url = new URL(`/document/all/${userId}`, SERVICE_URL);
        const headers = {
            "Authorization": `Bearer ${await AuthService.getAccessToken()}`
        };

        const response = await fetch(url, {
            headers: headers
        });

        const body = await response.json()
        if(response.status !== StatusCodes.OK){
            throw Error(body.error);
        }

        body.forEach((doc: any) => {
            doc.createdAt = new Date(doc.createdAt);
        });

        return body as Document[];
    } 
    
    static async deleteDocument(document: Document) {
        const {id, previewBlobId, documentBlobId, userId} = document;

        const url = new URL(`/document/${id}`, SERVICE_URL);
        const headers = {
            "Authorization": `Bearer ${await AuthService.getAccessToken()}`
        };

        const response = await fetch(url, {
            headers: headers,
            method: "DELETE"
        });

        if(response.status === StatusCodes.INTERNAL_SERVER_ERROR){
            const body = await response.json();
            throw Error(body.error);
        }

        const storageRef = storage.ref();
        const previewRef = storageRef.child(`${userId}/${previewBlobId}.png`);
        const documentRef = storageRef.child(`${userId}/${documentBlobId}.pdf`);

        try{
            await Promise.all([previewRef.delete(), documentRef.delete()])
        }
        catch(error){
            throw Error(error.message);
        }
    }
}
export default DocumentService;