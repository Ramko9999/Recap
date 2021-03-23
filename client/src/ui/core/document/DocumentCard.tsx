import React from "react";
import { Card } from "antd";
import { Document } from "../../../service/Document";

type Props = {
    document: Document
}

const DOCUMENT_STATE = {
    FINISHED: "FINISHED",
    QUEUED: "QUEUED",
    SCANNING: "SCANNING"
};

const { Meta } = Card;

const DocumentCard = ({ document }: Props) => {

    const { preview, uploadedAt, name} = document;

    const getDocumentPreview = () => {
        return (<img alt="" src={preview} height="150px" />);
    }

    const getDocumentMeta = () => {
        return (<div style={{ height: "40px" }}>
            <Meta title={name} description={uploadedAt.toLocaleDateString()} />
        </div>);
    };

    return (<Card hoverable cover={getDocumentPreview()} style={{ width: "160px" }}>
        {getDocumentMeta()}
    </Card>);
};

export default DocumentCard;