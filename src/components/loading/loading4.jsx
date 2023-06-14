import './loading4.css'
import {useEffect, useRef} from "react";
import {theme} from "antd";

export default function ({color}){
    const {token} = theme.useToken();
    const spinner = useRef(null);
    useEffect(() => {
        spinner.current.style.setProperty('--color', color || token.colorPrimaryActive);
    }, [token, color]);

    return <div className="sk-folding-cube" ref={spinner}>
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
    </div>
}