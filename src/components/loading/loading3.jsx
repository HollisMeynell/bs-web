import style from './loading3.module.scss'
import {useLayoutEffect, useRef} from "react";
import {theme} from "antd";

export default function ({color}){
    const {token} = theme.useToken();
    const spinner = useRef(null);
    useLayoutEffect(() => {
        spinner.current.style.setProperty('--color', color || token.colorPrimaryActive);
    }, [token, color]);

    return <div className={style.skCircle} ref={spinner}>
        <div className={style.skChild}></div>
        <div className={`${style.skChild} ${style.skCircle2}`}></div>
        <div className={`${style.skChild} ${style.skCircle3}`}></div>
        <div className={`${style.skChild} ${style.skCircle4}`}></div>
        <div className={`${style.skChild} ${style.skCircle5}`}></div>
        <div className={`${style.skChild} ${style.skCircle6}`}></div>
        <div className={`${style.skChild} ${style.skCircle7}`}></div>
        <div className={`${style.skChild} ${style.skCircle8}`}></div>
        <div className={`${style.skChild} ${style.skCircle9}`}></div>
        <div className={`${style.skChild} ${style.skCircle10}`}></div>
        <div className={`${style.skChild} ${style.skCircle11}`}></div>
        <div className={`${style.skChild} ${style.skCircle12}`}></div>
    </div>
}