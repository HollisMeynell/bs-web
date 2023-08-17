import './loading3.css'
import {useLayoutEffect, useRef} from "react";
import {theme} from "antd";

export default function ({color}){
    const {token} = theme.useToken();
    const spinner = useRef(null);
    useLayoutEffect(() => {
        spinner.current.style.setProperty('--color', color || token.colorPrimaryActive);
    }, [token, color]);

    return <div className="sk-circle" ref={spinner}>
        <div className="sk-circle1 sk-child"></div>
        <div className="sk-circle2 sk-child"></div>
        <div className="sk-circle3 sk-child"></div>
        <div className="sk-circle4 sk-child"></div>
        <div className="sk-circle5 sk-child"></div>
        <div className="sk-circle6 sk-child"></div>
        <div className="sk-circle7 sk-child"></div>
        <div className="sk-circle8 sk-child"></div>
        <div className="sk-circle9 sk-child"></div>
        <div className="sk-circle10 sk-child"></div>
        <div className="sk-circle11 sk-child"></div>
        <div className="sk-circle12 sk-child"></div>
    </div>
}