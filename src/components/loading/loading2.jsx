import './loading2.css'
import {useEffect, useRef} from "react";
import {theme} from "antd";

export default function ({color}){
    const {token} = theme.useToken();
    const spinner = useRef(null);
    useEffect(() => {
        spinner.current.style.setProperty('--color', color || token.colorPrimaryActive);
    }, [token, color]);

    return <div className="sk-cube-grid" ref={spinner}>
        <div className="sk-cube sk-cube1"></div>
        <div className="sk-cube sk-cube2"></div>
        <div className="sk-cube sk-cube3"></div>
        <div className="sk-cube sk-cube4"></div>
        <div className="sk-cube sk-cube5"></div>
        <div className="sk-cube sk-cube6"></div>
        <div className="sk-cube sk-cube7"></div>
        <div className="sk-cube sk-cube8"></div>
        <div className="sk-cube sk-cube9"></div>
    </div>
}