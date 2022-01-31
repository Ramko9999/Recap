import React, { useState, useContext } from "react";
import { Layout, Menu } from "antd";
import { PlusOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import ModalContext from "../context/ModalContext";
import DocumentUploadModal from "./document/DocumenUploadModal";
import UserContext from "../context/UserContext";
import { User } from "../../service/User";
import AuthService from "../../service/Auth";
import history from "../../util/History";
import { DocumentState } from "../context/DocumentContext";
import DocumentGallery from "./document/DocumentGallery";

const { Content, Sider } = Layout;
const { Item } = Menu;

const CoreSider = () => {

    const { setIsUploadModalOpen } = useContext(ModalContext);
    const { username } = useContext(UserContext) as NonNullable<User>;
    const [isSliderCollapsed, setIsSliderCollapsed] = useState(true);

    const handleLogOut = async () => {
        await AuthService.logOut();
        history.replace("/login", {});
    }

    return (<Sider collapsible collapsed={isSliderCollapsed} onCollapse={setIsSliderCollapsed} style={{ height: "800px" }}>
        <Menu theme="dark" mode="inline">
            <Item key="Upload" onClick={() => {setIsUploadModalOpen(true)}} icon={<PlusOutlined />}>
                Upload
            </Item>
            <Item key={username} icon={<UserOutlined />}>
                {username}
            </Item>
            <Item key="Log Out" onClick={handleLogOut} icon={<LogoutOutlined />}>
                Log Out
            </Item>
        </Menu>
    </Sider>);
};


const Core = () => {

    const { isUploadModalOpen } = useContext(ModalContext);

    return (<Layout>
        <CoreSider />
        <DocumentState>
            <Content>
                <div style={{
                    marginTop: "2%",
                    marginLeft: "2%",
                }}>
                    <DocumentGallery/>
                </div>
            </Content>
            {isUploadModalOpen && <DocumentUploadModal isUploadModalOpen={isUploadModalOpen} />}
        </DocumentState>
    </Layout>)
}

export default Core;