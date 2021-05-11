import React, { useState, useEffect, useContext} from "react";
import { Layout, Row, Col, Menu} from "antd";
import DocumentService, { Document } from "../../service/Document";
import { PlusOutlined, UserOutlined, SettingOutlined, StarOutlined, QuestionCircleOutlined, LogoutOutlined} from "@ant-design/icons";
import DocumentCard from "./document/DocumentCard";
import ModalContext from "../context/ModalContext";
import DocumentScanModal from "./document/DocumenScanModal";
import UserContext from "../context/UserContext";
import { User } from "../../service/User";
import AuthService from "../../service/Auth";
import history from "../../util/History";

const { Content, Sider } = Layout;
const { Item, SubMenu } = Menu;

const CoreSider = () => {

    const {setIsScanModalOpen} = useContext(ModalContext);
    const {username} = useContext(UserContext) as NonNullable<User>;
    const [isSliderOpen, setIsSliderOpen] = useState(false);


    const handleLogOut = async () => {
        await AuthService.logOut();
        history.replace("/login");
    }

    return (<Sider collapsible collapsed={isSliderOpen} onCollapse={setIsSliderOpen} style={{ height: "800px" }}>
        <Menu theme="dark" mode="inline">
            <Item key="Scan" onClick={() => setIsScanModalOpen(true)} icon={<PlusOutlined />}>
                Scan
            </Item>
            <SubMenu key={username} title={username} icon={<UserOutlined />}>
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
            <Item key="Log Out" onClick={handleLogOut} icon={<LogoutOutlined/>}>
                Log Out
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

    const {isScanModalOpen} = useContext(ModalContext);

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
        {isScanModalOpen && <DocumentScanModal isScanModalOpen={isScanModalOpen}/>}
    </Layout>)
}

export default Core;