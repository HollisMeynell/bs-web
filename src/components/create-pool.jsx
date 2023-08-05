import {Button, Modal, Col, Row, Input, App} from "antd";
import {useState} from "react";
import ImageCropper from "./image-cropper.jsx";
import {uploadImage} from "../api/util.js";
import {createPool} from "../api/mapinfo.js";
import TextArea from "antd/es/input/TextArea.js";
import Editor from "@/components/markdown.jsx";

const tipsStyle = {lineHeight: "100%", fontSize: 18};
export default function ({children}) {

    const [insertData, setInsertData] = useState({});
    const {message} = App.useApp();

    const [insertStatus, setInsertStatus] = useState({
        name: null,
        info: null,
        banner: false,
    });
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOkButton, setModalOkButton] = useState(false);

    const setData = (a) => {
        return (e) => {
            const newData = {
                ...insertData
            }
            newData[a] = e.target.value;
            setInsertData(newData);
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
        const newData = {
            ...insertData,
            banner: imgBlob,
        }
        if (imgBlob) {
            setInsertStatus({
                ...insertStatus,
                banner: false
            })
        }
        setInsertData(newData);
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
            content:"加载中"
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
                type:"success",
                content: '创建完成',
                duration: 3
            });
            return true;
        } else {
            message.open({
                key,
                type:"error",
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
            setModalOpen(false);
        }
    }

    const row = (children)=> {
        return <Row align={"middle"} justify="space-evenly" style={{marginTop: "1rem"}}>
            <Col span={24}>{children}</Col>
        </Row>
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
                <Col style={tipsStyle}>name</Col>
            </Row>
            {row(<Input status={insertStatus.name} value={insertData.name}
                        onChange={setData("name")}/>)}
            {row(<div style={tipsStyle}>banner</div>)}
            {row(<ImageCropper
                uploadStatus={insertStatus.banner}
                setUploadStatus={setUploadStatus}
                tips={"建议尺寸 172 * 80"}
                aspectRatio={86 / 40}
                setCutImage={getImage}/>)}
            {row(<div style={tipsStyle}>info</div>)}
            {row(<Editor edit={true} onChange={setData("info")}/>)}

        </Modal>
    </>
}
