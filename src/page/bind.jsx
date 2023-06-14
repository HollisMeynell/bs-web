import ErrorPage from "../Err/error.jsx";
import {Card, theme} from "antd";
import Loading from "../components/loading/loading.jsx";
import {useEffect} from "react";
import {doLogin} from "../api/userinfo.js";
import {useNavigate} from "react-router";

export const Router = {
    path: '/bind',
    element: <BindPage/>,
    errorElement: <ErrorPage/>,
}

function BindPage() {
    const navigate = useNavigate();
    useEffect(() => {
        const arg = window.location.search;
        const start = arg.indexOf("code=") + 5;
        const end = arg.indexOf("state=") - 1;
        const code = arg.substring(start, end);
        doLogin(code).then(() => {
            navigate('/');
        });
    }, []);
    return <div style={{width: '100%', height:'100%', overflow:'hidden'}}>
        <Loading/>
    </div>
}