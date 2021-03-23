import React, {useState} from "react";
import {Upload, message} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import UploadService, {DocumentUpload} from "../../../service/Upload";

const {Dragger} = Upload;

type LocalUpload = DocumentUpload & {previewUrl : string};

type DocumentUploaderProps = {
    onUploadFinished: (d: LocalUpload) => void
}

const DocumentUploader = ({onUploadFinished} : DocumentUploaderProps) => {

    const noop = ({onSuccess} : any) => {
        onSuccess("ok");
    }

    const onUploadChangeEvent = async (info : any, onUploadFinished: (d: LocalUpload) => void) => {
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
            fileName: name,
            fileSize: size,
            extension: type,
            preview,
            previewUrl
        });
    }

    return (<Dragger name="file" multiple={false} onChange={(info) => onUploadChangeEvent(info, onUploadFinished)}
                     customRequest={(o) => {noop(o)}}>
            <div>
                <InboxOutlined/>
            </div>
            <p>Click or drag a document to scan</p>
        </Dragger>);
}


type DocumentConfirmationProps = {
    localUpload: LocalUpload;
}

const DocumentConfirmation = ({localUpload} : DocumentConfirmationProps) => {
    
    const {fileName, fileSize, extension, preview, previewUrl}  = localUpload;
    return (<div>
        <span>{"Preview of " + fileName}</span>
        <img src={previewUrl} alt=""/>
        </div>)
}

const DocumentScan = () => {

    const [index, setIndex] = useState(0);
    const [localUpload, setLocalUpload] = useState<LocalUpload | null>(null);
    
    const getScanCreation = () => {
        switch (index){
            case 0:
                return (<DocumentUploader onUploadFinished={(localUpload) => {
                    setLocalUpload(localUpload);
                    setIndex(1);
                }}/>);
            default:
                if(localUpload){
                    return (<DocumentConfirmation localUpload={localUpload}/>);
                }
                else{
                    throw Error("localUpload is null")
                }
        }
    }

    return (<div> 
        {getScanCreation()}
    </div>);
}


export default DocumentScan;