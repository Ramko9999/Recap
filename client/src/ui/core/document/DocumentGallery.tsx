import React, {useContext} from "react";
import {Document} from "../../../service/Document";
import DocumentContext from "../../context/DocumentContext";
import {Row, Col} from "antd";
import DocumentCard from "./DocumentCard";
import Request from "../../../util/LoadingEnum";

const DocumentGallery = () => {
    const {documents, documentRequestStatus} = useContext(DocumentContext);

    const getDocumentGrid = (documents: Document[]) => {
        return (<Row gutter={[16, 16]}>
            {documents.map((document) => {
                return (<Col key={document.id}>
                    <DocumentCard document={document} />
                </Col>);
            })}
        </Row>);
    };

    if(documentRequestStatus === Request.WAITING){
        return (<div>
            Loading Documents...
        </div>);
    }

    if(documentRequestStatus === Request.FAILED){
        return (<div>
            Unable to load documents...
        </div>);
    }

    if(documents.length === 0){
        return (<div>
            You don't have any documents... Upload some in
        </div>);
    }

    return getDocumentGrid(documents);
}

export default DocumentGallery;