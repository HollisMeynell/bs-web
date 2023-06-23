import {useState} from 'react'
import '../style/App.css'
import {Button, Card, Col, Layout, Row, theme} from "antd";
import ErrorPage from "../Err/error.jsx";
import {useNavigate} from "react-router";
import {Setter} from "./components.jsx";
import {LoginOutlined} from "@ant-design/icons";
import imgCard1 from '../assets/card1.jpg';
import imgCard2 from '../assets/card2.jpg';
import imgCard3 from '../assets/card3.jpg';
import {HttpRequest} from "../api/util.js";

const {useToken} = theme;

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

export const Router = {
    path: '/',
    element: <Index/>,
    errorElement: <ErrorPage/>,
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
            cover={<img src={cover} alt={"cover"}/>}
        >
            <Card.Meta title={title} description={button}/>

        </Card>
    </Col>
}