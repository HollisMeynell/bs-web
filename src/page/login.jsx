import ErrorPage from "@/Err/error.jsx";
import {useEffect, useRef, useState} from "react";
import {doOauth} from "@/assets/utils/login.js";
import TypeIt from "typeit";
import {Button} from "antd";
import {hiddenStyle, showHiddenStyle} from "@/components/js-style.js";

export const Router = {
    path: '/login',
    Component: Login,
    errorElement: <ErrorPage/>
}

function Login() {
    async function doLogin(){
        await doOauth();
    }
    function doBack(){
        window.history.go(-1);
    }

    return <div style={{width: '100%', height: '100%', minHeight: 160,  overflow: 'hidden'}}>
        <Tips doLogin={doLogin} doBack={doBack}/>
    </div>
}

function Tips({doLogin, doBack}){
    const buttonBoxRef = useRef(null);
    const titleRef = useRef(null);
    const typeOpt = {
        strings:['这不是你应该来的地方...', '或者你可以:'],
        speed: 50,
        waitUntilVisible: true,
        cursorChar: "",
        afterComplete:addButton,
    }
    const buttonStyle = {marginRight: 10, userSelect:'none'};
    useEffect(() => {
        new TypeIt(titleRef.current, typeOpt).go();
    }, []);
    function addButton() {
        showHiddenStyle(buttonBoxRef.current);
    }
    return <div style={{marginTop:40, marginLeft:60}}>
        <div style={{color:"white"}}>
            <h1 ref={titleRef}/>
        </div>
        <div ref={buttonBoxRef} style={hiddenStyle}>
            <Button type="primary" style={buttonStyle} onClick={doLogin}>尝试登录</Button>
            <Button type="primary" style={buttonStyle} onClick={doBack}>原路返回</Button>
        </div>
    </div>
}