import {Button, Modal, Col, Row, Input} from "antd";
import {useState} from "react";
import ImageCropper from "./image-cropper.jsx";
import Loading from "./loading/loading.jsx";
import {uploadImage} from "../api/util.js";

const tipsStyle = {lineHeight: "100%", fontSize: 18};
export default function () {
    const button = {
        wait: <Button>"上传"</Button>,
        loading: <Button><Loading/></Button>,
    }
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOkButton, setModalOkButton] = useState(false);
    const onClick = () => {
        setModalOpen((e) => !e);
    }

    const getImage = async (imgBlob = new Blob()) => {
        let p = await uploadImage(imgBlob, "test.png");
    }

    const onClose = async () => {
        setModalOkButton(true);
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 5000)
        })

        setModalOkButton(false)
        setModalOpen(false);
    }

    return <>
        <Button onClick={onClick}>
            add pool map
        </Button>
        <Modal
            open={modalOpen}
            onCancel={onClick}
            onOk={onClose}
            confirmLoading={modalOkButton}

            width={360}
        >
            <Row align={"middle"} justify="space-evenly" style={{marginTop: "2rem"}}>
                <Col span={9} style={tipsStyle}>name</Col>
                <Col span={9}><Input/></Col>
            </Row>
            <Row align={"middle"} justify="space-evenly" style={{marginTop: "1rem"}}>
                <Col span={9} style={tipsStyle}>info</Col>
                <Col span={9}><Input/></Col>
            </Row>
            <Row align={"middle"} justify="space-evenly" style={{marginTop: "1rem"}}>
                <Col span={9} style={tipsStyle}>image</Col>
                <Col span={9}>
                    <ImageCropper setCutImage={getImage}/>
                </Col>
            </Row>
        </Modal>
    </>
}