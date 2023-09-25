import style from './loading1.module.scss';
import {useLayoutEffect, useRef} from "react";

export default function Loading1({color}){
    const spinner = useRef(null);
    useLayoutEffect(() => {
        if (color) spinner.current.style.setProperty('--color-main', color);
    }, [color]);
    return <div className={style.spinner} ref={spinner}>
        <div className={style.doubleBounce1}></div>
        <div className={style.doubleBounce1}></div>
    </div>
}