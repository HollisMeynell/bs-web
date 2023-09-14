import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import style from '@/style/home/page.module.scss'
import ErrorPage from "@/Err/error.jsx";

export const Router = {
    path: ":pid",
    Component: PoolPage,
    errorElement: <ErrorPage/>,
}
function PoolPage() {
    const  {pid} = useParams();
    const allPool = useSelector(state => state.pool.allPool)
    const [poolInfo, setPoolInfo] = useState({});

    useEffect(() => {
        setPoolInfo(allPool[pid]);
    }, [pid]);

    return <div className={style.box}>
        <div className={style.title}>
            <img />
        </div>
    </div>
}