import {useNavigate, useRouteError} from "react-router";
import {Button, Result} from "antd";



export default function ErrorPage(){
    const error = useRouteError();
    console.error(error);
    if (error.code === 401) {
        return noLoginError();
    }
    const navigate = useNavigate();
    function toHome(){
        navigate('/');
    }

    return <Result
        status="error"
        title="出错了!"
        subTitle={error.statusText || error.message}
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

