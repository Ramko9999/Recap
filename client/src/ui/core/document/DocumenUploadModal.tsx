import React, {useState, useContext} from "react";
import {Upload, message, Modal} from "antd";
import {InboxOutlined } from "@ant-design/icons";
import DocumentService, {DocumentUpload} from "../../../service/Document";
import ModalContext from "../../context/ModalContext";
import DocumentContext from "../../context/DocumentContext";

const {Dragger} = Upload;

type DocumentUploaderProps = {
    onUploadFinished: (d: DocumentUpload) => void
}

const DocumentUploader = ({onUploadFinished} : DocumentUploaderProps) => {

    const noop = ({onSuccess} : any) => {
        onSuccess("ok");
    }

    const onUploadChangeEvent = async (info : any, onUploadFinished: (d: DocumentUpload) => void) => {
        const {status} = info.file;
        if(status === "uploading"){
            return;
        }
    
        const {name, size} = info.file;

        if(status === "error"){
            message.error(`An error occured while uploading file ${name}.`);
            return;
        }
    
        const fileObject = info.file.originFileObj;
        const documentName = name.split(".")[0];

        const preview = await DocumentService.generatePreviewBlob(fileObject);
        const previewUrl = URL.createObjectURL(preview);
        

        onUploadFinished({
            file: fileObject,
            name: documentName,
            size,
            preview,
            previewUrl
        });
    }

    return (<Dragger name="file" accept=".pdf" multiple={false} onChange={(info) => onUploadChangeEvent(info, onUploadFinished)}
                     customRequest={(o) => {noop(o)}}>
            <div>
                <InboxOutlined/>
            </div>
            <p>Click or drag a document to scan</p>
        </Dragger>);
}


type DocumentConfirmationProps = {
    documentUpload: DocumentUpload;
}

const DocumentConfirmation = ({documentUpload} : DocumentConfirmationProps) => {
    
    const {name, previewUrl}  = documentUpload;
    
    return (<div>
        <img src={previewUrl} alt=""/>
        <span>{"Preview of " + name}</span>
        </div>)
}


type DocumentUploadModalProps = {
    isUploadModalOpen: boolean
};

const DocumentUploadModal = ({isUploadModalOpen}: DocumentUploadModalProps) => {

    const [index, setIndex] = useState(0);
    const [documentUpload, setLocalUpload] = useState<DocumentUpload | null>(null);

    const {setIsUploadModalOpen} = useContext(ModalContext);
    const {addDocument} = useContext(DocumentContext);

    const onOk = async () => {
        if(documentUpload){
            const createdDocument = await DocumentService.createDocument(documentUpload);
            setIsUploadModalOpen(false);
            addDocument(createdDocument);
            message.success(`The document ${documentUpload.name} was uploaded successfully!`);
        }
    };
    
    const getUploadPhase = () => {
        switch (index){
            case 0:
                return (<DocumentUploader onUploadFinished={(documentUpload) => {
                    setLocalUpload(documentUpload);
                    setIndex(1);
                }}/>);
            default:
                if(documentUpload){
                    return (<DocumentConfirmation documentUpload={documentUpload}/>);
                }
                else{
                    throw Error("documentUpload is null")
                }
        }
    }

    const okButtonProps = {
        disabled: index !== 1
    };

    return (<div> 
        <Modal title="Scan a Document"  visible={isUploadModalOpen} okButtonProps={okButtonProps} onCancel={() => setIsUploadModalOpen(false)} onOk={onOk}>
        {getUploadPhase()}
        </Modal>
    </div>);
}


export default DocumentUploadModal;