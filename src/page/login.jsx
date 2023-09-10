import ErrorPage from "@/Err/error.jsx";
import {useEffect, useState} from "react";
import {doOauth} from "@/assets/utils/login.js";
import Loading from "@/components/loading/loading.jsx";

export const Router = {
    path: '/login',
    element: <Login/>,
    errorElement: <ErrorPage/>
}

function Login() {
    const [loading, setLoading] = useState(false);
    async function doLogin(){
        await doOauth();
    }
    function doBack(){
        window.history.go(-2);
    }

    return <div style={{width: '100%', height: '100%', minHeight: 160, overflow: 'hidden'}}>
        <Loading/>
    </div>
}