import PoolCard from "@/page/home/poolCard.jsx";
import {useEffect, useState} from "react";
import {PoolApi} from "@/api/pool-api.js";

export default function Main() {
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        PoolApi.getPublicPools().then(data => {
            const datal = data.data;
            setDataList(datal.map(v => v.id));
        })
    }, []);

    return <div style={{display:'flex', flexWrap:'wrap',justifyContent:'space-around'}}>
        {dataList && dataList.map((v,i) => {
            return <PoolCard id={v} key={i}/>
        })}
    </div>
}