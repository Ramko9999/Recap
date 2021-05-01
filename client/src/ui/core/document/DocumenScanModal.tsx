import React, {useState, useContext} from "react";
import {Upload, message, Modal} from "antd";
import {InboxOutlined } from "@ant-design/icons";
import UploadService, {DocumentUpload} from "../../../service/Upload";
import ModalContext from "../../context/ModalContext";

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
    
        const {name, type, size} = info.file;

        if(status === "error"){
            message.error(`An error occured while uploading file ${name}.`);
            return;
        }
    
        const preview = await UploadService.generatePreviewBlob(info.file.originFileObj);
        const previewUrl = URL.createObjectURL(preview);
    
        onUploadFinished({
            file: info.file,
            fileName: name,
            fileSize: size,
            extension: type,
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
    
    const {fileName, fileSize, extension, preview, previewUrl}  = documentUpload;
    
    return (<div>
        <img src={previewUrl} alt=""/>
        <span>{"Preview of " + fileName}</span>
        </div>)
}


type DocumentScanModalProps = {
    isScanModalOpen: boolean
};

const DocumentScanModal = ({isScanModalOpen}: DocumentScanModalProps) => {

    const [index, setIndex] = useState(0);
    const [documentUpload, setLocalUpload] = useState<DocumentUpload | null>(null);

    const {setIsScanModalOpen} = useContext(ModalContext);

    const onOk = async () => {
        if(documentUpload){
            await UploadService.uploadDocument(documentUpload);
            message.success(`The document ${documentUpload.fileName} was uploaded successfully!`);
            setIsScanModalOpen(false);
        }
    };
    
    const getScanPhase = () => {
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
        <Modal title="Scan a Document"  visible={isScanModalOpen} okButtonProps={okButtonProps} onCancel={() => setIsScanModalOpen(false)} onOk={onOk}>
        {getScanPhase()}
        </Modal>
    </div>);
}


export default DocumentScanModal;