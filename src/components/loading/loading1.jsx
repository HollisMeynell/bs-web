import './loading1.css';
import {useEffect, useRef} from "react";
import {theme} from "antd";


export default function Loading1({color}){
    const {token} = theme.useToken();
    const spinner = useRef(null);
    useEffect(() => {
        spinner.current.style.setProperty('--color', color || token.colorPrimaryActive);
    }, [token, color]);
    return <div className="spinner" ref={spinner}>
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
    </div>
}