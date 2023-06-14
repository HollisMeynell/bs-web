import {useEffect} from "react";
import {Card, Col, Row} from "antd";
import PoolCard from "./poolCard.jsx";
import './poolEdit.css'

const v = `
![img](http://disk.365246692.xyz/d/Download/pdir/%E5%A3%81%E7%BA%B8.jpeg?sign=tlSiy1UNuaoxoYKkqllC7KdvQjUbRZEbV0xiUx-g4Sw=:1684934142)
# 这是图池xxx

> 欢迎来到

[Out of Scope](./docs/out-of-scope.md)

mmm xxx


`
const vs = `

## 短的介绍

> 欢迎来到

mmm xxx
`
export default function ({setLoading}) {

    useEffect(() => {
        if (typeof setLoading === "function") {
            setLoading(false);
        }
    }, []);
    return <>
        
    </>
}