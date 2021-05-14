import React, {useState, useEffect} from "react";
import AuthService from "../../service/Auth";
import DocumentService, {Document} from "../../service/Document";
import Request from "../../util/LoadingEnum";
import {message} from "antd";


type DocumentContextType = {
    documents: Document[],
    addDocument: (doc: Document) => void,
    deleteDocument: (docId: string) => void,
    viewDocument: (docId: string) => void,
    documentInView: Document | null
    documentRequestStatus: Request

}
const DocumentContext = React.createContext({
    documents: [],
    addDocument: (doc: Document) => {},
    deleteDocument: (docId: string) => {},
    viewDocument: (docId: string) => {},
    documentInView: null,
    documentRequestStatus: Request.WAITING
} as DocumentContextType);


type DocumentStateProps = {
    children: any
}

export const DocumentState = ({children}: DocumentStateProps) => {

    const [documentRequestStatus, setDocumentRequestStatus] = useState(Request.WAITING);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [documentInView, setDocumentInView] = useState<Document | null>(null);

    const addDocument = (document: Document) => {
        const clonedDocuments = ([] as Document[]).concat(documents);
        clonedDocuments.unshift(document);
        setDocuments(clonedDocuments);
    }

    const deleteDocument = (documentId: string) => {
        setDocuments(documents.filter((document) => document.id !== documentId));
    }

    const viewDocument = (documentId: string) => {
        const queriedDocuments = documents.filter((document) => document.id === documentId);
        if(queriedDocuments.length === 0){
            throw Error(`View intended document ${documentId} does not exist in the store`)
        }
        const viewIntendedDocument = queriedDocuments[0];
        setDocumentInView(viewIntendedDocument)
    }

    useEffect(() => {
        DocumentService.getDocuments(AuthService.getUser().uid).then((docs) => {
            setDocuments(docs);
            setDocumentRequestStatus(Request.SUCCESSFUL);
        }).catch((error) => {
            message.error(error.message);
            setDocumentRequestStatus(Request.FAILED);
        })
    }, [])

    
    return (<DocumentContext.Provider value={{
        documents: documents,
        addDocument: addDocument,
        deleteDocument: deleteDocument,
        viewDocument: viewDocument,
        documentInView: documentInView,
        documentRequestStatus: documentRequestStatus
    }}>
        {children}
    </DocumentContext.Provider>)
}

export default DocumentContext;