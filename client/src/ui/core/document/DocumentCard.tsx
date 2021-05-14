import React from "react";
import { Card } from "antd";
import { Document } from "../../../service/Document";

type Props = {
    document: Document
}

const { Meta } = Card;

const DocumentCard = ({ document }: Props) => {

    const {previewUrl, createdAt, name} = document;

    const getDocumentPreview = () => {
        return (<img alt="" src={previewUrl} height="160px" />);
    }

    const getDocumentMeta = () => {
        return (<div style={{ height: "50px", borderTopWidth: "5px", borderTopColor: "black"}}>
            <Meta title={name} description={createdAt.toLocaleDateString()} />
        </div>);
    };

    return (<Card hoverable cover={getDocumentPreview()} style={{ width: "170px" }}>
        {getDocumentMeta()}
    </Card>);
};

export default DocumentCard;