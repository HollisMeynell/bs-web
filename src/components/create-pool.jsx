import {Modal, Col, Row, Input, App} from "antd";
import {useReducer, useState} from "react";
import ImageCropper from "./image-cropper.jsx";
import {uploadImage} from "../api/util.js";
import {createPool} from "../api/mapinfo.js";
import Editor from "@/components/markdown.jsx";
import {tipsStyle} from "@/components/js-style.js";

export default function ({children}) {
    const {message} = App.useApp();

    const [insertStatus, setInsertStatus] = useState({
        name: null,
        info: null,
        banner: false,
    });

    const dataReduce = (state, action) => {
        const newData = {
            ...state
        }
        switch (action.type) {
            case "set" : {
                if (typeof action.value === "string") {
                    newData[action.key] = action.value;
                } else {
                    newData[action.key] = action.value.target.value;
                }
                break;
            }
            case "img" : {
                newData.banner = action.value;
                break;
            }
            case "clear":{
                return {}
            }
        }
        return newData;
    }
    const [insertData, setInsertData] = useReducer(dataReduce, {}, v => v);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOkButton, setModalOkButton] = useState(false);

    const setData = (a) => {
        return (e) => {
            setInsertData({type: "set", key: a, value: e});
            if (insertStatus[a]) {
                const newStatus = {
                    ...insertStatus
                }
                newStatus[a] = null;
                setInsertStatus(newStatus);
            }
        }
    }

    const getImage = (imgBlob = new Blob()) => {
        if (imgBlob) {
            setInsertStatus({
                ...insertStatus,
                banner: false
            })
        }

        setInsertData({type: "img", value: imgBlob});
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
        if (!insertData.banner) {
            status.banner = true;
            allPass = false;
        }

        if (!allPass) {
            setInsertStatus(status)
            return false;
        }
        const key = "tip";
        let res;
        message.open({
            key,
            type: "loading",
            content: "加载中"
        })
        try {
            const {fileKey} = await uploadImage(insertData.banner, "banner.png");
            res = await createPool({
                name: insertData.name,
                info: insertData.info,
                banner: fileKey,
            });
        } catch (e) {
            message.open({
                key,
                type: "error",
                content: `创建失败: ${e.message}`,
                duration: 3
            });
            return false;
        }
        if (res.code === 200) {
            message.open({
                key,
                type: "success",
                content: '创建完成',
                duration: 3
            });
            return true;
        } else {
            message.open({
                key,
                type: "error",
                content: `创建失败: ${res.message}`,
                duration: 3
            });
        }

        return false;
    }

    const setUploadStatus = (f) => {
        setInsertStatus({
            ...insertStatus,
            banner: f,
        })
    }

    const onOpen = () => {
        setModalOpen(true);
    }

    const onClose = () => {
        setModalOpen(false);
    }

    const onOk = async () => {
        setModalOkButton(true);
        const submitOK = await onSubmit();
        setModalOkButton(false)
        if (submitOK) {
            setInsertData({type:"clear"});
            setModalOpen(false);
        }
    }

    return <>
        <div onClick={onOpen}>
            {children}
        </div>
        <Modal
            open={modalOpen}
            onCancel={onClose}
            onOk={onOk}
            confirmLoading={modalOkButton}
            width={"70vw"}
        >
            <Row align={"middle"} justify="start" style={{marginTop: "2rem"}}>
                <Col span={12} style={tipsStyle}>name</Col>
                <Col span={12} style={tipsStyle}>banner</Col>
            </Row>

            <Row align={"middle"} justify="space-evenly" style={{marginTop: "1rem"}}>
                <Col span={12}>
                    <div style={{maxWidth: "10rem"}}>
                        <Input
                            status={insertStatus.name}
                            value={insertData.name}
                            onChange={setData("name")}
                        />
                    </div>
                </Col>
                <Col span={12}>
                    <ImageCropper
                        uploadStatus={insertStatus.banner}
                        setUploadStatus={setUploadStatus}
                        tips={"建议尺寸 172 * 80"}
                        aspectRatio={86 / 40}
                        setCutImage={getImage}/>
                </Col>
            </Row>

            <Row align={"middle"} justify="start" style={{marginTop: "2rem"}}>
                <Col style={tipsStyle}>info</Col>
            </Row>

            <Row align={"middle"} justify="space-evenly" style={{marginTop: "1rem"}}>
                <Col span={24}><Editor edit onChange={setData("info")} editStatus={insertStatus.info}/></Col>
            </Row>

        </Modal>
    </>
}
