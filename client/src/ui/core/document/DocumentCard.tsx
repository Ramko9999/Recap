import React, { useContext } from "react";
import { Card, Menu, Dropdown, message } from "antd";
import DocumentService, { Document, DOCUMENT_STATES, PREVIEW_WIDTH} from "../../../service/Document";
import DocumentContext from "../../context/DocumentContext";

type Props = {
    document: Document
}

const DocumentCard = ({ document }: Props) => {

    const { deleteDocument } = useContext(DocumentContext)
    const { previewUrl, createdAt, name, id, state } = document;

    const onDeleteDocument = async () => {
        try {
            await DocumentService.deleteDocument(document);
            deleteDocument(id);
            message.success(`deleted ${name}`);
        }
        catch (error) {
            message.error(error.message);
        }
    }

    const menu = (<Menu>
        <Menu.Item key="delete" danger onClick={onDeleteDocument}>
            Delete
        </Menu.Item>
    </Menu>);

    const getDocumentStatusOverlay = () => {
        if (state === DOCUMENT_STATES.FINISHED) {
            return null;
        }

        return <div style={{
            position: "absolute",
            zIndex: 999,
            margin: 0,
            left: 0,
            right: 0,
            textAlign: "center",
            top: "40%",
            color: "white",
            fontWeight: "bold"
        }}>
            {state}
        </div>
    }
    const getDocumentPreview = () => {
        const documentCardStyle: any = {
            alignContent: "center"
        };
        if (state !== DOCUMENT_STATES.FINISHED) {
            documentCardStyle["filter"] = "brightness(30%)";
        }

        return (
        <div>
            <div style={documentCardStyle}>
                <img alt="" src={previewUrl} height="250px" width={`${PREVIEW_WIDTH}px`}/>
            </div>
            {getDocumentStatusOverlay()}
        </div>);
    }

    const getDocumentMeta = () => {
        return (<div style={{ height: "30px", textAlign:"center"}}>
            <div style={{
                marginTop: "-10px",
                fontWeight: "bolder"
            }}>
                {name}
            </div>
            <div>
                <div style={{
                    marginTop: "5px",
                    fontWeight: "lighter",
                    display: "inline-block"
                }}>
                    {createdAt.toLocaleDateString()}
                </div>
            </div>
        </div>);
    };

    return (<Dropdown overlay={menu} trigger={["contextMenu"]}>
                <Card hoverable cover={getDocumentPreview()} style={{ width: "200px" }} bordered={true}>
                    {getDocumentMeta()}
                </Card>
    </Dropdown>);
};

export default DocumentCard;