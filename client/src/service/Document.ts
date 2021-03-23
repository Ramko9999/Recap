import fetch from "node-fetch";

export type Document = {
    id: string,
    preview: string,
    name: string,
    extension: string,
    uploadedAt: Date,
    state:string
}

class DocumentService{

    // mock fetching documents
    static async getDocuments(id:string) {

        const MAX_DOCUMENTS = 10;
        return Array(MAX_DOCUMENTS).fill({}).map((_, index) => {
            return {
                id: index.toString(),
                preview: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
                name: `reading${index}.pdf`,
                extension: "pdf",
                uploadedAt: new Date(),
                state: "FINISHED"
            }
        }) as Document[];
    }   
}

export default DocumentService;