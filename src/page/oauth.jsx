import ErrorPage from "../Err/error.jsx";
import {useEffect} from "react";
import Loading from "@/components/loading/loading.jsx";
import {doOauth} from "@/assets/utils/login.js";


export const Router = {
    path: '/oauth',
    element: <Oauth/>,
    errorElement: <ErrorPage/>,
}

function Oauth() {
    useEffect(() => {
        doOauth().then();
    }, []);
    return <div style={{width: '100%', height: '100%', minHeight: 160, overflow: 'hidden'}}>
        <Loading/>
    </div>
}