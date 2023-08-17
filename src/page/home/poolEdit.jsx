import {useEffect} from "react";
import {Button, Card, Col, Row} from "antd";
import PoolCard from "./poolCard.jsx";
import './poolEdit.css'
import CreatePool from "../../components/create-pool.jsx";
import CreateCategoryGroup from "@/components/create-category-group.jsx";
import {queryPoolInfo} from "@/api/mapinfo.js";

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
        <CreatePool>
            <Button>create pool map X</Button>
        </CreatePool>
    </>
}