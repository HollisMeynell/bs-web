import {useEffect, useRef, useState} from "react";
import {Button, Card, Col, Table, Tag} from "antd";
import '@/style/home/poolEdit.css'
import CreatePool from "../../components/create-pool.jsx";
import {PoolApi} from "@/api/pool-api.js";
import {getImageUrl} from "@/api/util.js";
import ErrorPage from "@/Err/error.jsx";

export const Router = {
    path: "manege",
    element: <PoolEdit/>,
    errorElement: <ErrorPage/>
}

const columns = [
    {
        title: "NAME",
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'BANNER',
        dataIndex: 'banner',
        key: 'banner',
        render: (key) => <img width={86} height={40} src={getImageUrl(key)} alt={"banner"}/>
    },
    {
        title: 'STATUS',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            return getStatusTag(status);
        }
    },
]

function getStatusTag(s) {
    switch (s) {
        case "OPEN":
            return <Tag bordered={false} color={"processing"}>选图</Tag>
        case "SHOW":
            return <Tag bordered={false} color={"success"}>公开</Tag>
        case "STOP":
            return <Tag bordered={false} color={"error"}>截至</Tag>
        case "DELETE":
            return <Tag bordered={false} color={"#333"}>已删除</Tag>
        default:
            return <Tag bordered={false} color={"#EEE"}>ERROR</Tag>
    }
}

const fakeValue = [
    {
        status:"OPEN",
        banner: "ffff14e4-7259-46ff-a05b-d6f551857dc1",
    },
    {
        status:"SHOW",
        banner: "ffff14e4-7259-46ff-a05b-d6f551857dc1",
    },
    {
        status:"STOP",
        banner: "ffff14e4-7259-46ff-a05b-d6f551857dc1",
    },
    {
        status:"DELETE",
        banner: "ffff14e4-7259-46ff-a05b-d6f551857dc1",
    },
    {
        status:"E",
        banner: "ffff14e4-7259-46ff-a05b-d6f551857dc1",
    },
]

export default function PoolEdit({setLoading}) {
    useEffect(() => {
        if (typeof setLoading === "function") {
            setLoading(false);
        }
        PoolApi.queryPoolInfo().then(e => {
            console.log(e);
        })
    }, []);

    return <>
        <Table columns={columns} dataSource={fakeValue} size={"small"} pagination={false}/>
        <CreatePool>
            <Button>create pool map X</Button>
        </CreatePool>
    </>
}