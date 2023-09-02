import {App, Card, Image} from "antd";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import {useEffect, useLayoutEffect, useState} from "react";
import {getPoolInfo} from "@/api/mapinfo.js";
import {getImageUrl} from "@/api/util.js";

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
    const {message, modal} = App.useApp();

    useEffect(() => {
        if (!poolInfo.demo) return;
        setLoadingCard(true);
        if (typeof id !== "number") {
            message.error("type error");
            return;
        }

        getPoolInfo({poolId: id}).then(res => {
            setInfo(res.data[0]);
            setLoadingCard(false);
        });
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