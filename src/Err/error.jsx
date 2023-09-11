import {useNavigate, useRouteError} from "react-router";
import {Button, Result} from "antd";
import {useEffect, useRef} from "react";
import TypeIt from "typeit";



export default function ErrorPage(){
    const error = useRouteError();
    console.error(error);
    const infoRef = useRef(null);
    const info = error.statusText || error.message;
    const navigate = useNavigate();
    function toHome(){
        navigate('/');
    }

    function toBack(){
        window.history.go(-1);
    }

    useEffect(() => {
        function addTyped() {
            if (!infoRef.current) {
                setTimeout(addTyped, 50);
                return
            }
            new TypeIt(infoRef.current, {speed: 40,cursorChar: "",})
                .type(info)
                .go();
        }
        addTyped();
    }, []);

    return <div style={{width:'100%', height:'100%', background:'hsl(255, 10%, 20%)'}}>
        <Result
            status="error"
            title={<span style={{color:"white"}}>出错了!</span>}
            subTitle={<span style={{color: "white"}} ref={infoRef}/>}
            extra={<>
                <Button type="primary" onClick={toHome}>主页</Button>
                <Button type="primary" onClick={toBack}>返回</Button>
            </>}
        />
    </div>
}