import { StatusCodes } from "http-status-codes";
import fetch from "node-fetch";
import * as Pdf from "pdfjs-dist";
import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import AuthService from "./Auth";
import { SERVICE_URL } from "./ServiceConfig";


export type Document = {
    id: string,
    name: string
    createdAt: Date,
    previewUrl: string,
    blobUrl: string,
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
    previewUrl: string
};

Pdf.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.js";

const PREVIEW_WIDTH = 170;

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
                        reject("Unable to create a blob of the first page")
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
            throw Error(`Failed to load the document ${file.name}`);
        }
        const byteArray = new Uint8Array(buffer);
        const worker = new Pdf.PDFWorker({name: `PDFWorker ${new Date().toLocaleDateString()}`});
        const loadTask = Pdf.getDocument({
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

    private static async uploadBlobs(previewBlob: Blob, pdfBlob: Blob){
        return {
            previewUrl: URL.createObjectURL(previewBlob),
            blobUrl: URL.createObjectURL(pdfBlob)
        };
    }

    static async createDocument(document:DocumentUpload){
        let requestBody : any = {
            name: document.name,
            userId: AuthService.getUser().uid,
            size: document.size
        };
        try {
            const {previewUrl, blobUrl} = await DocumentService.uploadBlobs(document.preview, document.file);
            requestBody.previewUrl = previewUrl;
            requestBody.blobUrl = blobUrl;
        }
        catch (error) {
            throw Error(`Unable to upload pdf & preview image ${error.message}`);
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
            throw Error("Invalid request body");
        }

        const responseBody = await response.json();
        if(response.status === StatusCodes.INTERNAL_SERVER_ERROR){
            throw Error(responseBody.error);
        }

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
}

export default DocumentService;