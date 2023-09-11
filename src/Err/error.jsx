import {useNavigate, useRouteError} from "react-router";
import {Button, Result} from "antd";
import {useEffect, useRef} from "react";
import TypeIt from "typeit";



export default function ErrorPage(){
    const error = useRouteError();
    console.error(error);
    if (error.code === 401) {
        return noLoginError();
    }
    const infoRef = useRef(null);
    const info = error.statusText || error.message;
    const navigate = useNavigate();
    function toHome(){
        navigate('/');
    }

    useEffect(() => {
        function addTyped() {
            if (!infoRef.current) {
                setTimeout(addTyped, 50);
                return
            }
            new TypeIt(infoRef.current, {speed: 40})
                .type(info)
                .go();
        }
        addTyped();
    }, []);

    return <Result
        status="error"
        title={<span style={{color:"white"}}>出错了!</span>}
        subTitle={<span style={{color: "white"}} ref={infoRef}/>}
        extra={<Button type="primary" onClick={toHome}>返回主页</Button>}
        />
}

function noLoginError() {
    const navigate = useNavigate();
    function toLogin(){
        navigate('/oauth');
    }
    function toHome(){
        navigate('/');
    }
    return <Result
        status="warning"
        title="禁止访问"
        subTitle="此页面访问需要权限 . . . . . ."
        extra={<>
            <Button type="primary" onClick={toHome}>返回主页</Button>
            <Button type="primary" onClick={toLogin}>登录</Button>
        </>}
    />
}

