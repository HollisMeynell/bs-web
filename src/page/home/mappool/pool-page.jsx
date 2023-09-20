import {useLoaderData, useParams} from "react-router";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import style from '@/style/home/page.module.scss'
import ErrorPage from "@/Err/error.jsx";
import CreateCategoryGroup from "@/components/pool/create-category-group.jsx";
import {Button} from "antd";
import {CategoryGroupApi} from "@/api/pool-group-api.js";
import PoolUpdate from "@/components/pool/pool-update.jsx";

export const Router = {
    path: ":pid",
    loader: loader,
    Component: PoolPage,
    errorElement: <ErrorPage/>,
}

async function loader({params}) {
    const pid = params.pid;
    let groups;
    const rep = await CategoryGroupApi.getPoolAllGroups(pid);
    groups = rep.data;
    return {groups}
}

function PoolPage() {
    const {pid} = useParams();
    const {groups} = useLoaderData();
    const allPool = useSelector(state => state.pool.allPool)
    const [poolInfo, setPoolInfo] = useState({});

    useEffect(() => {
        setPoolInfo(allPool[pid]);
    }, [pid]);

    return <div className={style.box}>
        <div className={style.title}>

        </div>
        <CreateCategoryGroup poolId={pid}>
            <Button>create group</Button>
        </CreateCategoryGroup>
        <PoolUpdate poolId={pid} data={allPool[pid]}>
            <Button>update</Button>
        </PoolUpdate>
    </div>
}