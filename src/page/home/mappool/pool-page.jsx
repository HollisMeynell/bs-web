import {useLoaderData, useParams} from "react-router";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import style from '@/style/home/page.module.scss'
import CreateCategoryGroup from "@/components/pool/create-category-group.jsx";
import {Button} from "antd";
import {CategoryGroupApi} from "@/api/pool-group-api.js";
import PoolUpdate from "@/components/pool/pool-update.jsx";
import {PoolApi} from "@/api/pool-api.js";
import Loading from "@/components/loading/loading.jsx";
import {putPool} from "@/components/store/pool.js";

export const Router = {
    path: ":pid",
    loader: loader,
    Component: PoolPage,
}

async function loader({params}) {
    const pid = params.pid;
    let groups;
    const rep = await CategoryGroupApi.getPoolAllGroups(pid);
    return {groups}
}

export default function PoolPage() {
    const {pid} = useParams();
    const {groups} = useLoaderData();
    const allPool = useSelector(state => state.pool.allPool)
    const [error, setError] = useState(null);
    const [poolInfo, setPoolInfo] = useState({});

    useEffect(() => {
        setPoolInfo(allPool[pid]);
    }, [pid]);

    useEffect(() => {
        if (allPool[pid]) {
            setPoolInfo(allPool[pid]);
            return;
        }
        const messageKey = 'loading-pool'
        outMessage({
            key: messageKey,
            type: 'loading',
            content: '加载中',
            duration: 0
        });
        PoolApi.getPoolInfo({poolId: pid}).then(rep => {
            outMessageCancel(messageKey);
            dispatch(putPool(rep));
        }).catch(e => {
            outMessage({
                key: messageKey,
                type: "error",
                content: '加载出错' + e.message,
                duration: 5
            })
        });
    }, [allPool]);

    const page = <div className={style.box}>
        <div className={style.title}>
        </div>
        <CreateCategoryGroup poolId={pid}>
            <Button>create group</Button>
        </CreateCategoryGroup>
        <PoolUpdate poolId={pid}>
            <Button>update</Button>
        </PoolUpdate>
    </div>
    return poolInfo ? page : <Loading/>
}