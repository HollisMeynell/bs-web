import {Button, Card, Col, Input, Modal, Popover, Row} from "antd";
import {useReducer, useState} from "react";
import {tipsStyle} from "@/styles";
import Editor from "@/components/markdown.jsx";
import {hexColor2i32} from "@/utils/color-util.js";
import {SketchPicker} from "react-color";
import {CategoryGroupApi} from "@/api/pool-group-api.js";


export default function ({children, poolId}) {
    if (!poolId) {
        return <Card>error: poolId is null</Card>
    }
    const defaultData = {
        name: null,
        info: null,
        poolId: poolId,
        color: 0,
    }
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOkButton, setModalOkButton] = useState(false);
    const statusReduce = (state, action) => {
        switch (action.type) {
            case "name" :
                return {
                    ...state,
                    name: null,
                }
            case "info" :
                return {
                    ...state,
                    info: null,
                }
            case "color" :
                return {
                    ...state,
                    color: null,
                }
            case "all":
                return {
                    ...action.value
                }
        }
    }
    const [insertStatus, setInsertStatus] = useReducer(statusReduce, {}, v => {
        return {
            name: null,
            info: null,
            color: null,
        }
    });
    const dataReduce = (state, action) => {
        switch (action.type) {
            case "name" :
                setInsertStatus({type: "name"});
                return {
                    ...state,
                    name: action.value,
                }
            case "info" :
                setInsertStatus({type: "info"});
                return {
                    ...state,
                    info: action.value,
                }
            case "color" :
                setInsertStatus({type: "color"});
                return {
                    ...state,
                    color: action.value,
                }
            case "clear": return {
                ...defaultData
            }
            default:
                return state;
        }
    }
    const [insertData, setInsertData] = useReducer(dataReduce, {}, v => v);


    const onOpen = () => {
        setModalOpen(true);
    }

    const onClose = () => {
        setModalOpen(false);
    }

    const onSubmit = async () => {
        let allPass = true;
        const status = {};
        if (!insertData.name) {
            status.name = "error";
            allPass = false;
        }
        if (!insertData.info) {
            status.info = "error";
            allPass = false;
        }
        if (!insertData.color) {
            status.color = true;
            allPass = false;
        }

        if (!allPass) {
            setInsertStatus({type: "all", value: status});
            return false;
        }

        const key = "create-group-tip";
        let res;
        outMessage({
            key,
            type: "loading",
            content: "加载中",
            duration: 0,
        })
        try {
            res = await CategoryGroupApi.createGroup({
                name: insertData.name,
                poolId: poolId,
                info: insertData.info,
                color: hexColor2i32(insertData.color),
            });
        } catch (e) {
            outMessage({
                key,
                type:"error",
                content:`创建失败: ${e.message}`,
                duration: 10,
            })
            return false;
        }

        if (res.code === 200) {
            outMessage({
                key,
                type: "success",
                content: '创建完成',
                duration: 3
            });
            return true;
        } else {
            outMessage({
                key,
                type: "error",
                content: `创建失败: ${res.message}`,
                duration: 10
            });
        }

        return false;
    }

    const onOk = async () => {
        setModalOkButton(true);
        const submitOK = await onSubmit();
        setModalOkButton(false)
        if (submitOK) {
            setInsertData({type:"all"});
            setModalOpen(false);
        }
    }

    const colorPicker = <SketchPicker
        color={insertData.color}
        disableAlpha={false}
        onChange={(v) => setInsertData({type: "color", value: v.hex})}
    />

    return <>
        <div onClick={onOpen}>
            {children}
        </div>
        <Modal
            open={modalOpen}
            onOk={onOk}
            onCancel={onClose}
            confirmLoading={modalOkButton}
        >
            <Row align={"middle"} justify="start" style={{marginTop: "2rem"}}>
                <Col span={12} style={tipsStyle}>name</Col>
                <Col span={12} style={tipsStyle}>color</Col>
            </Row>
            <Row align={"middle"} justify="space-evenly" style={{marginTop: "1rem"}}>
                <Col span={12}>
                    <div style={{maxWidth: "10rem"}}>
                        <Input
                            status={insertStatus.name}
                            value={insertData.name}
                            onChange={(v) => setInsertData({type: "name", value: v.target.value})}
                        />
                    </div>
                </Col>
                <Col span={12}>
                    {/**/}
                    <div style={{maxWidth: "10rem"}}>
                        <Popover content={colorPicker} placement="rightTop" trigger="click">
                            <Button style={{color: "#FFF"}} danger={insertStatus.color}>
                                <div style={{width: 32, height: 16, backgroundColor: insertData.color}}/>
                            </Button>
                        </Popover>
                    </div>
                </Col>
            </Row>

            <Row align={"middle"} justify="start" style={{marginTop: "2rem"}}>
                <Col style={tipsStyle}>info</Col>
            </Row>
            <Row align={"middle"} justify="space-evenly" style={{marginTop: "1rem"}}>
                <Col span={24}>
                    <Editor edit onChange={(v) => setInsertData({type: "info", value: v})}
                                       editStatus={insertStatus.info}/>
                </Col>
            </Row>
        </Modal>
    </>
}