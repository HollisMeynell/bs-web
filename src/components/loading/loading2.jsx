import style from './loading2.module.scss'
import {useLayoutEffect, useRef} from "react";

export default function ({color}){
    const spinner = useRef(null);
    useLayoutEffect(() => {
        if (color) spinner.current.style.setProperty('--color-main', color);
    }, [color]);

    return <div className={style.skCubeGrid} ref={spinner}>
        <div className={`${style.skCube} ${style.skCube1}`}/>
        <div className={`${style.skCube} ${style.skCube2}`}/>
        <div className={`${style.skCube} ${style.skCube3}`}/>
        <div className={`${style.skCube} ${style.skCube4}`}/>
        <div className={`${style.skCube} ${style.skCube5}`}/>
        <div className={`${style.skCube} ${style.skCube6}`}/>
        <div className={`${style.skCube} ${style.skCube7}`}/>
        <div className={`${style.skCube} ${style.skCube8}`}/>
        <div className={`${style.skCube} ${style.skCube9}`}/>
    </div>
}