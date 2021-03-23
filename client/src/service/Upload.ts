import fetch from "node-fetch";
import * as Pdf from "pdfjs-dist";
import { PDFPageProxy } from "pdfjs-dist/types/display/api";
import { PageViewport } from "pdfjs-dist/types/display/display_utils";

export type DocumentUpload = {
    fileName: string,
    fileSize: string,
    extension: string
    preview: Blob
};

Pdf.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.js";

const PREVIEW_WIDTH = 160;

class UploadService{

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
            buffer = await UploadService.toBuffer(file); 
        }
        catch(error){
            throw Error("failed to load the document");
        }
        const byteArray = new Uint8Array(buffer);
        const worker = new Pdf.PDFWorker({name: `PDFWorker ${new Date().toLocaleDateString()}`});
        const loadTask = Pdf.getDocument({
            worker: worker,
            data: byteArray
        });
        
        const pdf = await loadTask.promise;
        const page = await pdf.getPage(1);
        const preview = await this.getSnapshot(page);
        
        loadTask.destroy();
        worker.destroy();
        return preview as Blob;
    }
}

export default UploadService;