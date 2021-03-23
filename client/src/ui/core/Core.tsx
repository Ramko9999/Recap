import React, { useState, useEffect, useContext} from "react";
import { Layout, Row, Col, Menu, Modal} from "antd";
import DocumentService, { Document } from "../../service/Document";
import { PlusOutlined, UserOutlined, SettingOutlined, StarOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import DocumentCard from "./document/DocumentCard";
import ModalContext from "../context/ModalContext";
import DocumentScan from "./document/DocumenScan";

const { Content, Sider } = Layout;
const { Item, SubMenu } = Menu;

const CoreSider = () => {

    const {setIsScanModalOpen} = useContext(ModalContext);
    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const USERNAME = "Ramki";

    return (<Sider collapsible collapsed={isSliderOpen} onCollapse={setIsSliderOpen} style={{ height: "800px" }}>
        <Menu theme="dark" mode="inline">
            <Item key="Scan" onClick={() => setIsScanModalOpen(true)} icon={<PlusOutlined />}>
                Scan
            </Item>
            <SubMenu key={USERNAME} title={USERNAME} icon={<UserOutlined />}>
                <Item key="Settings" icon={<SettingOutlined />}>
                    Settings
                </Item>
            </SubMenu>
            <Item key="Feedback" icon={<StarOutlined />}>
                Feedback
            </Item>
            <Item key="Help" icon={<QuestionCircleOutlined/>}>
                Help
            </Item>
        </Menu>
    </Sider>);
};

const CoreDocuments = () => {

    const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
    const [documents, setDocuments] = useState<Document[]>([]);

    useEffect(() => {
        DocumentService.getDocuments("").then((docs) => {
            setTimeout(() => {
                setIsLoadingDocuments(false);
                setDocuments(docs);
            }, 300);
        });
    }, []);


    const getDocumentGrid = (documents: Document[]) => {
        return (<Row gutter={[16, 16]}>
            {documents.map((document) => {
                return (<Col key={document.id}>
                    <DocumentCard document={document} />
                </Col>);
            })}
        </Row>);
    };

    const getDocumentSkeleton = () => {
        return <div style={{ textAlign: "center"}}> Loading your documents... </div>
    }

    return (isLoadingDocuments ? getDocumentSkeleton() : getDocumentGrid(documents));
}

const Core = () => {

    const {isScanModalOpen, setIsScanModalOpen} = useContext(ModalContext);

    return (<Layout>
        <CoreSider />
        <Content>
            <div style={{
                marginTop: "2%",
                marginLeft: "2%",
            }}>
                <CoreDocuments />
            </div>
        </Content>
        <Modal title="Scan a Document" visible={isScanModalOpen} onCancel={() => setIsScanModalOpen(false)}>
            <DocumentScan/>
        </Modal>
    </Layout>)
}

export default Core;