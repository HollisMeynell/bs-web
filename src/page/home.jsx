import {Outlet, useOutlet, useNavigate, useParams, useLocation} from "react-router";
import ErrorPage from "../Err/error.jsx";
import {Avatar, Breadcrumb, Button, Card, Divider, Image, Layout, Menu, Popover, Spin, theme} from "antd";
import {Router as childRouter} from './child.jsx'
import {Router as Favorites} from './home/favorites.jsx'
import {Link} from "react-router-dom";
import {Setter} from "./components.jsx";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {
    AppstoreOutlined,
    ExportOutlined,
    FolderOpenOutlined,
    MenuFoldOutlined, ReloadOutlined,
    UngroupOutlined,
    UserOutlined
} from "@ant-design/icons";
import Edit from "./home/poolEdit.jsx";
import {getFlagUrlFromCountryCode, getUser} from "../api/util.js";
import {getUserCard} from "../api/userinfo.js";
import {getMarkPool} from "../api/mapinfo.js";

export const Router = {
    path: '/home',
    element: <Home/>,
    errorElement: <ErrorPage/>,
    children: [childRouter, Favorites, {path: 'mappool/:mid', element: <div children={"3"}/>}]
}

export default function Home() {
    const {route, mid} = useParams();
    const {token} = theme.useToken();
    const navigate = useNavigate();
    const outlet = useOutlet();
    const [markPool, setMarkPool] = useState([]);
    const [userData, setUserData] = useState(getUser());
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    const extraBreadcrumbItems = pathSnippets.map((path, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        return {
            key: url,
            title: <Link to={url}>{path}</Link>,
        };
    });
    const data = useRef({code:13});

    const routeList = [
        generateMenuItem(<Link to={''} children={"管理"}/>, "/home", <UngroupOutlined/>),
        generateMenuItem(<Link to={'favorites'} children={"收藏"}/>, "/home/favorites", <AppstoreOutlined/>),
        generateMenuItem("图池", "/home/mappool", <FolderOpenOutlined/>, markPool),
    ];

    function updateMenu() {
        getMarkPool().then(rep => {
            const markList = rep.data.map(i => generateMenuItem(
                <Link to={`mappool/${i.id}`} children={i.name}/>,
                `/home/mappool/${i.id}`)
            );
            if (markList.length === 0) {
                markList.push({
                    label: "请在管理页面添加",
                    disabled: true,
                })
            }
            setMarkPool(markList);
        });
    }

    useLayoutEffect(() => {
        setMarkPool([{label: "请在管理页面添加", disabled: true,}]);

        getUserCard(userData.uid).then((data) => {
            setUserData({
                ...userData,
                cover: data.cover.custom_url,
                avatar: data.avatar_url,
                country: data.country_code,
            })
        });
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
                items={routeList}
                onOpenChange={(title)=>{
                    if (title.includes('/home/mappool')) {
                        updateMenu();
                    }
                }}
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
                <Header breadcrumbItems={extraBreadcrumbItems}
                        userData={userData}
                        handleExit={handleExit}
                        handleReload={handleReload}/>
            </Layout.Header>
            <Layout.Content style={{height: '100%'}}>
                {/*主体容器*/}
                {outlet || <Edit/>}
                <Setter/>
            </Layout.Content>
        </Layout>
    </Layout>
}

function generateMenuItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    }
}

/***
 * 顶框
 * @param breadcrumbItems
 * @param userData
 * @returns {JSX.Element}
 * @constructor
 */
function Header({breadcrumbItems, userData, handleReload, handleExit}) {
    return <><Breadcrumb separator=">" items={breadcrumbItems} style={{marginRight: 'auto'}}/>
        <Popover
            arrow={false}
            placement="bottomRight"
            content={<Card
                style={{width: 350}}
                cover={<img alt={'cover'} src={userData.cover}/>}
                children={<Card.Meta
                    avatar={<Avatar src={userData.avatar}/>}
                    title={userData.name}
                    description={<>
                        {userData.country && <img style={{width: "1.3888888rem", height: "1rem"}} alt={"country"}
                                                  src={getFlagUrlFromCountryCode(userData.country)}/>}
                        不知道写啥,先空着
                    </>}
                />}
                actions={[
                    <ReloadOutlined key={'reload'} onClick={handleReload}/>,
                    <ExportOutlined key={'exit'} onClick={handleExit}/>
                ]}
            />}
        >
            <samp style={{cursor: 'pointer', userSelect: 'none'}}>{userData?.name}</samp>
        </Popover>
        <Divider type="vertical"/>
        <Avatar src={userData.avatar} size={"large"} icon={<UserOutlined/>}/>
    </>
}