import {useOutlet, useNavigate, useParams, useLocation, useLoaderData} from "react-router";
import {Avatar, Breadcrumb, Card, Divider, Layout, Menu, Popover, theme} from "antd";
import Main from '@/page/home/main.jsx'
import {Link} from "react-router-dom";
import Setter from "@/components/page-setter";
import {useEffect, useLayoutEffect, useState} from "react";
import {
    AppstoreOutlined,
    ExportOutlined,
    FolderOpenOutlined, HomeOutlined,
    ReloadOutlined, SettingOutlined,
    UngroupOutlined,
    UserOutlined
} from "@ant-design/icons";
import {getFlagUrlFromCountryCode, getUser} from "@/api/util.js";
import {getUserCard} from "@/api/userinfo.js";
import {PoolApi} from "@/api/pool-api.js";
import {useDispatch, useSelector} from "react-redux";
import {initMarkList, putAllPools} from "@/components/store/pool.js";

async function loader() {
    const markData = await PoolApi.getMarkPool();
    setTimeout(() => dispatch(putAllPools(markData.data)), 5);
    return {
        marks: markData.data,
    }
}

export default function Home() {
    const {token} = theme.useToken();
    const {marks} = useLoaderData();
    const allPool = useSelector(state => state.pool.allPool)
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

    const [routList, setRoutList] = useState([]);

    function updateMenu() {
        PoolApi.getMarkPool().then(rep => {
            const markList = rep.data;
            setMarkPool(initMarkList(markList.map(m => m.id)))
            dispatch(putAllPools(markList));
        });
    }

    useEffect(() => {
        setRoutList([
            generateMenuItem(<Link to={''} children={"主页"}/>, "/home", <HomeOutlined/>),
            generateMenuItem("赛事", "/home/match", <AppstoreOutlined/>, parseMatchs([])),
            generateMenuItem("图池", "/home/mappool", <AppstoreOutlined/>, parseMarks(markPool.map(i => allPool[i]))),
            generateMenuItem(<Link to={'favorites'} children={"谱面收藏夹"}/>, "/home/favorites",
                <FolderOpenOutlined/>),
            generateMenuItem(<Link to={'manege'} children={"管理"}/>, "/home/manege", <SettingOutlined/>),
        ]);
    }, [markPool, allPool]);

    useLayoutEffect(() => {
        setMarkPool(initMarkList(marks.map(m => m.id)))

        getUserCard(userData.uid).then((data) => {
            setUserData({
                ...userData,
                cover: data.cover.custom_url,
                avatar: data.avatar_url,
                country: data.country_code,
            })
        }).catch((e) => {
            console.error(e);
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
                items={routList}
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
                {outlet || <Main/>}
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

function parseMarks(list) {
    const markList = list.filter(i => i && i.id).map(i => generateMenuItem(<Link to={`mappool/${i.id}`}
                                                                                 children={i.name}/>, `/home/mappool/${i.id}`));
    if (markList.length === 0) markList.push({label: "请在管理页添加图池", disabled: true, key: "NONE"});
    return markList;
}

function parseMatchs(list) {
    const matchList = [];
    if (matchList.length === 0) matchList.push({label: "请在管理页添加比赛", disabled: true, key: "NONE"});
    return matchList;
}

/***
 * 顶框
 * @param breadcrumbItems
 * @param userData
 * @param handleReload
 * @param handleExit
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