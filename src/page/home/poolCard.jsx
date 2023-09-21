import {Card, Image} from "antd";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {PoolApi} from "@/api/pool-api.js";
import {getImageUrl} from "@/api/util.js";
import {useSelector} from "react-redux";
import {putPool} from "@/components/store/pool.js";

const poolInfoTemp = {
    demo: true,
    id: 0,
    banner: "",
    info: "",
    name: "",
    status: "",
}

export default function ({id, poolInfo = poolInfoTemp}) {
    const [loadingCard, setLoadingCard] = useState(false);
    const [info, setInfo] = useState(poolInfo);

    const allPools = useSelector(state => state.pool.allPool);

    useEffect(() => {
        if (!poolInfo.demo) return;
        setLoadingCard(true);
        if (typeof id !== "number") {
            outMessage({
                key: 'pool-error',
                type: "error",
                content: "type error",
                duration: 3
            })
            return;
        }
        if (allPools[id]) {
            setInfo(allPools[id]);
            setLoadingCard(false);
        } else {
            PoolApi.getPoolInfo({poolId: id}).then(res => {
                dispatch(putPool(res));
                setInfo(res);
                setLoadingCard(false);
            });
        }
    }, []);

    function onInfo() {
    }

    return <div style={{width: '300px'}}>
        <Card
            loading={loadingCard}
            cover={<BannerImg url={getImageUrl(info.banner)} name={info.name}/>}
            bodyStyle={{padding: 0}}
            actions={[
                <SettingOutlined key="setting"/>,
                <EditOutlined key="edit"/>,
                <EllipsisOutlined key="ellipsis" onClick={onInfo}/>,
            ]}
        >

        </Card>
    </div>
}

function BannerImg({url, name}) {
    const preview = {
        visible: false,
        mask: name
    }
    return <Image
        src={url} alt={"banner"}
        preview={preview}
    />
}