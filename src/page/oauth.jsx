import ErrorPage from "../components/error";
import {useEffect} from "react";
import Loading from "@/components/loading/loading.jsx";
import {doOauth} from "@/utils/login.js";

export default function Oauth() {
    useEffect(() => {
        doOauth().then();
    }, []);
    return <div style={{width: '100%', height: '100%', minHeight: 160, overflow: 'hidden'}}>
        <Loading/>
    </div>
}