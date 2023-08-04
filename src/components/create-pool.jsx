import {Button, Modal, Col, Row, Input} from "antd";
import {useState} from "react";
import ImageCropper from "./image-cropper.jsx";
import {uploadImage} from "../api/util.js";
import {createPool} from "../api/mapinfo.js";

const tipsStyle = {lineHeight: "100%", fontSize: 18};
export default function ({node =<Button>create pool map</Button>}) {

    const [insertData, setInsertData] = useState({});

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

        if (allPass) {
            const {fileKey} = await uploadImage(insertData.banner, "test.png");
            const res = await createPool({
                name: insertData.name,
                info: insertData.info,
                banner: fileKey,
            });

            return true;
        }

        setInsertStatus(status)
        return false;
    }

    const setUploadStatus = (f) => {
        setInsertStatus({
            ...insertStatus,
            banner: f,
        })
    }


    const onClose = () => {
        setModalOpen((e) => !e);
    }

    const onOk = async () => {
        setModalOkButton(true);
        const submitOK = await onSubmit();
        setModalOkButton(false)
        if (submitOK) {
            setModalOpen(false);
        }
    }

    return <>
        <div onClick={onClose}>
            {node}
        </div>
        <Modal
            open={modalOpen}
            onCancel={onClose}
            onOk={onOk}
            confirmLoading={modalOkButton}

            width={360}
        >
            <Row align={"middle"} justify="space-evenly" style={{marginTop: "2rem"}}>
                <Col span={9} style={tipsStyle}>name</Col>
                <Col span={9}><Input status={insertStatus.name} value={insertData.name}
                                     onChange={setData("name")}/></Col>
            </Row>
            <Row align={"middle"} justify="space-evenly" style={{marginTop: "1rem"}}>
                <Col span={9} style={tipsStyle}>info</Col>
                <Col span={9}><Input status={insertStatus.info} value={insertData.info}
                                     onChange={setData("info")}/></Col>
            </Row>
            <Row align={"middle"} justify="space-evenly" style={{marginTop: "1rem"}}>
                <Col span={9} style={tipsStyle}>image</Col>
                <Col span={9}>
                    <ImageCropper
                        uploadStatus={insertStatus.banner}
                        setUploadStatus={setUploadStatus}
                        tips={"建议尺寸 172 * 80"}
                        aspectRatio={86 / 40}
                        setCutImage={getImage}/>
                </Col>
            </Row>
        </Modal>
    </>
}