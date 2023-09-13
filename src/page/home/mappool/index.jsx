import ErrorPage from "@/Err/error.jsx";
import {useLoaderData, useOutlet, useParams} from "react-router";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";

export const Router = {
    path: "mappool",
    Component: IndexPage,
    errorElement: <ErrorPage/>,
    children: [
        {
            path: ":pid",
            Component: PoolPage,
            errorElement: <ErrorPage/>,
        }
    ]
}


async function loader(){
    return {}
}
function IndexPage(){
    const  {pid} = useParams();
    const outlet = useOutlet();
    return <div>{pid?outlet:"none"}</div>
}
function PoolPage() {
    const  {pid} = useParams();
    const allPool = useSelector(state => state.pool.allPool)
    const [poolInfo, setPoolInfo] = useState({});

    useEffect(() => {
        setPoolInfo(allPool[pid]);
    }, [pid]);

    return <div>{pid}- {JSON.stringify(poolInfo)}</div>
}