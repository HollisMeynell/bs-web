import style from './loading1.module.scss';
import {useLayoutEffect, useRef} from "react";
import {theme} from "antd";


export default function Loading1({color}){
    const {token} = theme.useToken();
    const spinner = useRef(null);
    useLayoutEffect(() => {
        spinner.current.style.setProperty('--color', color || token.colorPrimaryActive);
    }, [token, color]);
    return <div className={style.spinner} ref={spinner}>
        <div className={style.doubleBounce1}></div>
        <div className={style.doubleBounce1}></div>
    </div>
}