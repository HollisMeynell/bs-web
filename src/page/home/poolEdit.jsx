import {useEffect} from "react";
import {Button, Card, Col, Row, Table} from "antd";
import PoolCard from "./poolCard.jsx";
import './poolEdit.css'
import CreatePool from "../../components/create-pool.jsx";
import CreateCategoryGroup from "@/components/create-category-group.jsx";
import {queryPoolInfo} from "@/api/mapinfo.js";
import {getImageUrl} from "@/api/util.js";

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
        render: (key) => <img src={getImageUrl(key)} alt={"banner"}/>
    },
    {
        title: 'STATUS',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            return status;
        }
    },
]

export default function ({setLoading}) {

    useEffect(() => {
        if (typeof setLoading === "function") {
            setLoading(false);
        }
        queryPoolInfo().then(e => {
            console.log(e);
        })
    }, []);
    return <>
        <Table columns={columns}/>
        <CreatePool>
            <Button>create pool map X</Button>
        </CreatePool>
    </>
}