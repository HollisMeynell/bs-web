import {Outlet, useOutlet, useNavigate, useParams, useLocation} from "react-router";
import ErrorPage from "../Err/error.jsx";
import {Avatar, Breadcrumb, Button, Card, Divider, FloatButton, Layout, Menu, Popover, Spin, theme} from "antd";
import {Router as childRouter} from './child.jsx'
import {Router as Favorites} from './home/favorites.jsx'
import {Link} from "react-router-dom";
import {Setter} from "./components.jsx";
import Loading from "../components/loading/loading.jsx";
import {useEffect, useState} from "react";
import {
    AppstoreOutlined,
    ExportOutlined,
    FolderOpenOutlined,
    MenuFoldOutlined, ReloadOutlined,
    UngroupOutlined,
    UserOutlined
} from "@ant-design/icons";
import Edit from "./home/poolEdit.jsx";

export default function Home() {
    const {route, mid} = useParams();
    const {token} = theme.useToken();
    const navigate = useNavigate();
    const outlet = useOutlet();
    const [menuItems, setMenuItems] = useState([]);
    const uid = 17064371;
    const uname = '-Spring Night-';
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const extraBreadcrumbItems = pathSnippets.map((path, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return {
            key: url,
            title: <Link to={url}>{path}</Link>,
        };
    });

    useEffect(() => {
        const mapgroup = [
            /*
            getItem(<Link to={'mappool/f23'} children={"NM1"}/>, '/home/mappool/f23', null),
            getItem(<Link to={'mappool/f24'} children={"NM2"}/>, '/home/mappool/f24', null),

             */
        ]
        if (mapgroup.length === 0) {
            mapgroup.push({
                label: "请在管理页面添加",
                disabled: true,
            })
        }
        const routeList = [
            getItem(<Link to={''} children={"管理"}/>, "/home", <UngroupOutlined />),
            getItem(<Link to={'favorites'} children={"收藏"}/>, "/home/favorites", <AppstoreOutlined/>),
            getItem("图池", "/home/mappool", <FolderOpenOutlined />, mapgroup),
        ]
        setMenuItems(routeList);
    }, []);

    function handleReload() {

    }
    function handleExit() {
        navigate('/');
    }

    return <Layout style={{color: token.colorText, minHeight: '100%'}}>
        {/*侧边栏*/}
        <Layout.Sider theme={'light'} trigger={null}>
            <Menu
                mode="inline"
                items={menuItems}
                selectedKeys={location.pathname}
            />
        </Layout.Sider>
        {/*主体:顶框加容器*/}
        <Layout>
            <Layout.Header style={{
                backgroundColor: token.colorPrimaryBg,
                color: token.colorText,
                display: 'flex',
                justifyContent: 'right',
                alignItems: 'center'
            }}>
                {/*顶框*/}
                <Breadcrumb separator=">" items={extraBreadcrumbItems} style={{marginRight:'auto'}}/>
                <Popover
                    arrow={false}
                    placement="bottomRight"
                    content={<Card
                        style={{width:350}}
                        cover={<img alt={'cover'} src={"https://assets.ppy.sh/user-profile-covers/10246790/7a022e0b18091c0e9c1b6bb7948f7c49e64b432b41aec5652d260188dbd17e68.jpeg"}/>}
                        children={<Card.Meta
                            avatar={<Avatar src={`https://a.ppy.sh/${uid}`}/>}
                            title={uname}
                            description={"不知道写啥,先空着"}
                        />}
                        actions={[
                            <ReloadOutlined key={'reload'} onClick={handleReload}/>,
                            <ExportOutlined key={'exit'} onClick={handleExit}/>
                        ]}
                    />}
                >
                    <samp style={{cursor: 'pointer', userSelect: 'none'}}>{uname}</samp>
                </Popover>
                <Divider type="vertical"/>
                <Avatar src={`https://a.ppy.sh/${uid}`} size={"large"} icon={<UserOutlined/>}/>
            </Layout.Header>
            <Layout.Content style={{height: '100%'}}>
                {/*主体容器*/}
                {outlet || <Edit/>}
                <Setter/>
            </Layout.Content>
        </Layout>
    </Layout>
}

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    }
}

export const Router = {
    path: '/home',
    element: <Home/>,
    errorElement: <ErrorPage/>,
    children: [childRouter, Favorites, {path: 'mappool/:mid', element: <div children={"3"}/>}]
}