import {Card} from "antd";
import {useEffect, useRef, useState} from "react";

export default function ({bid=2}) {
    const [cardLoading, setCardLoading] = useState(true);




    useEffect(() => {
        console.log(data.code);
    }, []);
    return <Card loading={cardLoading}>

    </Card>
}