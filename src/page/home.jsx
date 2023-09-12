import {useOutlet, useNavigate, useParams, useLocation, useLoaderData} from "react-router";
import ErrorPage from "../Err/error.jsx";
import {Avatar, Breadcrumb, Card, Divider,Layout, Menu, Popover, theme} from "antd";
import {Router as childRouter} from './child.jsx'
import {Router as Favorites} from './home/favorites.jsx'
import {Router as PoolEdit} from './home/poolEdit.jsx'
import {Router as PoolRouter} from './home/mappool/index.jsx'
import {Link} from "react-router-dom";
import {Setter} from "@/components/page-setter.jsx";
import {default as Index} from "./home/index.jsx";
import {useLayoutEffect, useRef, useState} from "react";
import {
    AppstoreOutlined,
    ExportOutlined,
    FolderOpenOutlined, HomeOutlined,
    ReloadOutlined,
    UngroupOutlined,
    UserOutlined
} from "@ant-design/icons";
import {getFlagUrlFromCountryCode, getUser} from "@/api/util.js";
import {getUserCard} from "@/api/userinfo.js";
import {PoolApi} from "@/api/pool-api.js";
import {useDispatch, useSelector} from "react-redux";
import {initMarkList} from "@/components/store/pool.js";

export const Router = {
    path: '/home',
    Component: Home,
    loader: loader,
    errorElement: <ErrorPage/>,
    children: [childRouter, Favorites, PoolEdit, PoolRouter, ]
}

async function loader(){
    const markData = await PoolApi.getMarkPool();
    return {
        marks: markData.data,
    }
}

function parseMark(list) {
    const markList = list.map(i => generateMenuItem(<Link to={`mappool/${i.id}`} children={i.name}/>, `/home/mappool/${i.id}`));
    if(markList.length === 0) markList.push({label: "请在管理页面添加", disabled: true, key: "NONE"});
    return markList;
}

function Home() {
    const {token} = theme.useToken();
    const {marks} = useLoaderData();
    const markPool = useSelector(state => state.pool.markList)
    const setMarkPool = useDispatch()
    const navigate = useNavigate();
    const outlet = useOutlet();
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


    const routeList = [
        generateMenuItem(<Link to={''} children={"主页"}/>, "/home", <HomeOutlined/>),
        generateMenuItem("图池", "/home/mappool", <FolderOpenOutlined/>, parseMark(markPool)),
        generateMenuItem(<Link to={'favorites'} children={"收藏"}/>, "/home/favorites", <AppstoreOutlined/>),
        generateMenuItem(<Link to={'manege'} children={"管理"}/>, "/home/manege", <UngroupOutlined/>),
    ];

    function updateMenu() {
        PoolApi.getMarkPool().then(rep => {
            const markList = rep.data;
            setMarkPool(initMarkList(markList));
        });
    }

    useLayoutEffect(() => {
        setMarkPool(initMarkList(marks));

        getUserCard(userData.uid).then((data) => {
            setUserData({
                ...userData,
                cover: data.cover.custom_url,
                avatar: data.avatar_url,
                country: data.country_code,
            })
        }).catch((e) => {
            console.log(e);
        });
    }, []);

    function handleReload() {

    }

    function handleExit() {
        navigate('/');
    }

    return <Layout style={{color: token.colorText, maxHeight: '100%', height: '100%'}}>
        {/*侧边栏*/}
        <Layout.Sider theme={'light'} trigger={null}>
            <Menu
                mode="inline"
                items={routeList}
                onOpenChange={(title) => {
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
            <Layout.Content style={{overflow: "auto", height: '100%'}}>
                {/*主体容器*/}
                {outlet || <Index/>}
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