import {useEffect, useRef, useState} from "react";
import {Button, Card, Col, Space, Table, Tag} from "antd";
import '@/style/home/poolEdit.css'
import CreatePool from "../../components/create-pool.jsx";
import {PoolApi} from "@/api/pool-api.js";
import {getImageUrl, getUser, HttpRequest} from "@/api/util.js";
import ErrorPage from "@/Err/error.jsx";
import {useLoaderData, useNavigate} from "react-router";
import {BarsOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {deleteMarkList, insertMarkList} from "@/components/store/pool.js";

export const Router = {
    path: "manege",
    loader: loader,
    element: <PoolEdit/>,
    errorElement: <ErrorPage/>
}

async function loader({params}) {

    let req = await PoolApi.queryPoolInfo();
    const mark = await PoolApi.getMarkPool();
    const user = getUser();
    const markData = {};
    for (const m of mark.data) {
        markData[m.id] = m;
    }
    for (const pool of req.data) {
        pool.permission = pool.users.find(value => {
            if (value.userId === user.uid) return true;
        }).permission;
        pool.isMark = markData[pool.id] !== void 0;
    }
    console.log(req.data)
    return {
        listData: [...req.data]
    }
}

function getStatusTag(s) {
    switch (s) {
        case "OPEN":
            return <Tag bordered={false} color={"processing"}>选图中</Tag>
        case "SHOW":
            return <Tag bordered={false} color={"success"}>公开中</Tag>
        case "STOP":
            return <Tag bordered={false} color={"error"}>已结束</Tag>
        case "DELETE":
            return <Tag bordered={false} color={"#333"}>已删除</Tag>
        default:
            return <Tag bordered={false} color={"#EEE"}>ERROR</Tag>
    }
}

function PoolEdit() {
    const {listData} = useLoaderData();
    const [list, setList] = useState(listData);
    const navigate = useNavigate();
    const setPool = useDispatch();

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
        {
            title: 'ACTION',
            key: 'action',
            render: (_, value) => {
                return <Space size={'middle'}>
                    {value.isMark ?
                        <MinusCircleOutlined onClick={() => delMark(value.id)}/>
                        :
                        <PlusCircleOutlined onClick={() => addMark(value.id, value)}/>
                    }
                    <BarsOutlined onClick={() => navigate(`/home/mappool/${value.id}`)}/>
                </Space>
            }
        }
    ]

    async function addMark(id, pool) {
        const rep = await PoolApi.addMarkPool(id);
        if (rep.code !== 200) return;
        let l = [];
        for (let lElement of list) {
            if (lElement.id === id)
                lElement.isMark = true;
            l.push(lElement);
        }
        setPool(insertMarkList(pool));
        setList(l);
    }

    async function delMark(id) {
        const rep = await PoolApi.deleteMarkPool(id);
        console.log(rep)
        if (rep.code !== 200) return;
        let l = [];
        for (let lElement of list) {
            if (lElement.id === id)
                lElement.isMark = false;
            l.push(lElement);
        }
        setPool(deleteMarkList(id));
        setList(l);
    }

    return <>
        <Table columns={columns} dataSource={list} size={"small"} pagination={false}/>
        <CreatePool>
            <Button>create pool map X</Button>
        </CreatePool>
    </>
}
