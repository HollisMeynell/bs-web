import ErrorPage from "../Err/error.jsx";
import {App, Card, message, Modal, theme} from "antd";
import Loading from "../components/loading/loading.jsx";
import {useEffect, useState} from "react";
import {doLogin} from "../api/userinfo.js";
import {useNavigate} from "react-router";

export const Router = {
    path: '/bind',
    element: <BindPage/>,
    errorElement: <ErrorPage/>,
}

function BindPage() {
    const [loading, setLoading] = useState(false);
    const {message} = App.useApp();

    function login() {
        setLoading(true);
        const arg = window.location.search;
        const start = arg.indexOf("code=") + 5;
        const end = arg.indexOf("state=") - 1;
        if (start >= end) {
            message.error("出错了: [code is null]", 10)
                .then(() => {
                    navigate('/');
                });
            return;
        }
        const code = arg.substring(start, end);
        doLogin(code).then(() => {
            message.success("登陆成功!", 3)
                .then(() => {
                navigate('/');
            });
        }).catch((err) => {
            message.error(err.message, 10)
                .then(() => {
                navigate('/');
            });
        });
    }

    const navigate = useNavigate();
    useEffect(() => {

    }, []);
    return <div style={{width: '100%', height: '100%', minHeight: 160, overflow: 'hidden'}}>
        {loading && <Loading/>}
        <Modal open={!loading} title={"绑定中"} children={"确认是否绑定"}
               onOk={login} onCancel={() => navigate('/')}/>
    </div>
}