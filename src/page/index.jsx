import {useEffect, useRef, useState} from 'react'
import style from '@/style/index.module.scss'
import {Button, Card, Col, Layout, Row, theme} from "antd";
import ErrorPage from "../Err/error.jsx";
import {useNavigate} from "react-router";
import {Setter} from "../components/page-setter.jsx";
import {LoginOutlined} from "@ant-design/icons";
import imgCard1 from '../assets/card1.jpg';
import imgCard2 from '../assets/card2.jpg';
import imgCard3 from '../assets/card3.jpg';
import TypeIt from "typeit";
import {hiddenStyle, showHiddenStyle} from "@/components/js-style.js";

const {useToken} = theme;

export const Router = {
    path: '/',
    element: <IndexA/>,
    errorElement: <ErrorPage/>,
}

function IndexA() {
    const title = "No name yet.";
    const info = "一个关于OSU的比赛管理网站";
    const infoItem = ["创建比赛", "招募成员", "管理图池", "成绩统计", "以及其他比赛相关的事情"]

    const mainBox = useRef(void 0);
    const {token} = useToken();
    useEffect(() => {
        mainBox.current.style.setProperty('--main-color', token.colorPrimaryBg);
        mainBox.current.style.backgroundImage = `url(${imgCard2})`;
    }, [token.colorPrimaryBg]);
    const navigate = useNavigate();

    const titleRef = useRef(null);
    const infoRef = useRef(null);
    const buttonBoxRef = useRef(null);

    const titleTypeOpt = {
        strings: title,
        speed: 50,
        cursorChar: "",
        afterComplete: infoShow,
    }
    const infoTypeOpt = {
        speed: 80,
        cursorChar: "",
    }

    function titleShow() {
        new TypeIt(titleRef.current, titleTypeOpt).go();
    }

    function infoShow() {
        buttonShow();
        const infoType = new TypeIt(infoRef.current, infoTypeOpt)
            .type(info, {delay: 3000})
            .delete()
            .type("你可以: ");
        for (const item of infoItem) {
            infoType.type(item, {delay: 2000})
                .delete(item.length);
        }
        infoType.delete()
            .type(info)
            .go();
    }

    function buttonShow() {
        showHiddenStyle(buttonBoxRef.current);
    }

    function userEnter() {

        navigate('/home');
    }

    function developerEnter() {
        navigate('/dev');
    }

    function guestEnter() {
        navigate('/test');
    }

    useEffect(() => {
        titleShow();
    }, []);

    return <div ref={mainBox} className={style.main}>
        <div className={style.box}>
            <div className={style.title} ref={titleRef}/>
            <span className={style.info} ref={infoRef}/>
            <div ref={buttonBoxRef} className={style.bottom} style={hiddenStyle}>
                <Button size="large" shape="round" type="primary" onClick={userEnter}>进入主页</Button>
                <Button size="large" shape="round" ghost onClick={guestEnter}>公开信息</Button>
            </div>
        </div>
        <Setter/>
    </div>
}

function Index() {
    const navigate = useNavigate();
    const {token} = useToken();

    function userEnter() {
        navigate('/home');
    }

    function developerEnter() {
        navigate('/dev');
    }

    function guestEnter() {
        navigate('/oauth');
    }

    return <>
        <Layout style={{minHeight: '100%'}}>
            <Layout.Content style={{backgroundColor: token.colorPrimaryBg}}>
                <Row style={{marginTop: '3rem'}} justify="space-evenly">
                    <LoginCard text={"点击进入"} index={1} title={"我是游客"} enter={guestEnter}/>
                    <LoginCard text={"点击进入"} index={3} title={"我是使用者"} enter={userEnter}/>
                    <LoginCard text={"点击进入"} index={2} title={"我是开发者"} enter={developerEnter}/>
                </Row>
                <Setter/>
            </Layout.Content>
        </Layout>
    </>
}

function LoginCard({title, text, enter, index}) {
    const buttonStyle = {height: '15vh'};
    const {token} = useToken();

    const button = <Button
        block
        ghost
        style={buttonStyle}
        type={"primary"}
        icon={<LoginOutlined/>}
        onClick={enter} children={text}
    />
    let cover;
    switch (index) {
        case 1:
            cover = imgCard1;
            break;
        case 2:
            cover = imgCard2;
            break;
        case 3:
            cover = imgCard3;
            break;
    }
    return <Col span={6}>
        <Card
            bordered={false}
            hoverable
            style={{backgroundColor: token.colorFillQuaternary}}
            // cover={<img src={cover} alt={"cover"}/>}
        >
            <Card.Meta title={title} description={button}/>
        </Card>
    </Col>
}