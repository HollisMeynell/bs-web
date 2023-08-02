import {Button, Modal, Col, Row, Input} from "antd";
import {useRef, useState} from "react";
import ImageCropper from "./image-cropper.jsx";

export default function () {
    const [modalOpen, setModalOpen] = useState(false);

    const onClick = () => {
        setModalOpen((e) => !e);
    }

    return <>
        <Button onClick={onClick}>
            add pool map
        </Button>
        <Modal open={modalOpen} onCancel={onClick} onOk={onClick}>
            <Row>
                <Col>
                    <div style={{height: "3rem"}}></div>
                </Col>
            </Row>
            <Row justify="space-evenly">
                <Col span={6}>name</Col>
                <Col span={6}><Input/></Col>
            </Row>
            <Row justify="space-evenly">
                <Col span={6}>info</Col>
                <Col span={6}><Input/></Col>
            </Row>
            <Row justify="space-evenly">
                <Col span={6}>image</Col>
                <Col span={6}>
                    <ImageCropper/>
                </Col>
            </Row>
        </Modal>
    </>
}