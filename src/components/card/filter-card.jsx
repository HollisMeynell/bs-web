import {Card, Slider} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import {useEffect, useReducer, useState} from "react";


const defaultValue = {
    length: [0, 750], star: [0, 10], cs: [0, 10], hp: [0, 10], od: [0, 10], ar: [0, 10],
};

function reduce(state, action) {
    if (action.type === "reload") {
        return defaultValue;
    }
    const newValue = {
        ...state
    };
    newValue[action.type] = action.value;
    return newValue;
};

/***
 * 回调 onChange 注意: 当 value.length[1] 为750时逻辑为无上限
 * @returns {JSX.Element}
 * @constructor
 */
export default function FilterCard({onChange}) {
    const [state, dispatch] = useReducer(reduce, defaultValue, (e) => e);

    const timeMarks = {}
    for (let i = 0; i <= 12; i++) {
        timeMarks[i * 60] = i;
    }

    const show = [];
    for (let key in defaultValue) {
        // 长度单独处理
        key === 'length' || show.push({
            key: key, values: defaultValue[key],
        })
    }

    function reload() {
        dispatch({type: "reload"});
    }

    function reanchMin(v) {
        return `${Math.floor(v / 60)}:${v % 60 === 0 ? '00' : '30'}`
    }


    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(state);
        }
    }, [state]);
    return <Card
        style={{width: 300}}
        actions={[<ReloadOutlined key="reload" onClick={reload}/>]}
    >
        <h2>FILTER:</h2>
        {show.map((v, i) => {
            return <div key={`h-${i}`}>
                <h4>{`${v.key}: ${state[v.key][0]}-${state[v.key][1]}`}</h4>
                <Slider min={defaultValue[v.key][0]} max={defaultValue[v.key][1]} step={0.1} range
                        value={state[v.key]}
                        onChange={(s) => {
                            dispatch({type: v.key, value: s})
                        }}
                />
            </div>
        })}
        <h4>{`length: ${reanchMin(state.length[0])}-${state.length[1] <= 720 ? reanchMin(state.length[1]) : '不上限'}`}</h4>
        <Slider min={defaultValue.length[0]} max={defaultValue.length[1]} step={30} range
                value={state.length}
                marks={timeMarks}
                tooltip={{formatter: (v) => v <= 720 ? reanchMin(v) : '不上限'}}
                onChange={(s) => {
                    dispatch({type: "length", value: s})
                }}
        />
    </Card>
}