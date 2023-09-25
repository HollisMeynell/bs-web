import Loading1 from "./loading1.jsx";
import Loading2 from "./loading2.jsx";
import Loading3 from "./loading3.jsx";
import {useLayoutEffect, useState} from "react";

export default function ({index = 0, color}) {
    const [loading, setLoading] = useState(null);
    useLayoutEffect(() => {
        if (index) {
            index = 1 + (Math.round(index) % 3);
        } else {
            index = Math.floor(Math.random() * 3) + 1
        }
        switch (index) {
            case 1: setLoading(<Loading1 color={color}/>);break
            case 2: setLoading(<Loading2 color={color}/>);break
            case 3: setLoading(<Loading3 color={color}/>);break
        }
    }, [color])
    return loading
}