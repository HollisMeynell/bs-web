import {useRef, useState} from "react";
import {Button, Modal, Upload} from "antd";
import Cropper from "react-cropper";
import {UploadOutlined} from "@ant-design/icons";
import "cropperjs/dist/cropper.css";


export default function () {

    const [image, setImage] = useState("");

    const [cropData, setCropData] = useState("#");
    const [modalOpen, setModalOpen] = useState(false);

    const cropRef = useRef();

    const closeModal = () => {
        setModalOpen(false);
    }

    const onUpload = (file) => {
        const reader = new FileReader();
        console.log(file);
        reader.onload = () => {
            setImage(reader.result);
        }
        setModalOpen(true);
        reader.readAsDataURL(file);
    }
    const getCropData = () => {
        if (typeof cropRef.current?.cropper !== "undefined") {
            setCropData(cropRef.current?.cropper.getCroppedCanvas().toDataURL());
        }
    };

    return <>
        <Upload beforeUpload={onUpload} fileList={[]}>
            <Button icon={<UploadOutlined/>}>
                上传
            </Button>
        </Upload>

        <Modal open={modalOpen} onOk={closeModal} onCancel={closeModal}>
            <div>
                <div style={{width: "100%"}}>
                    <button>Use default img</button>
                    <br/>
                    <br/>
                    <Cropper
                        ref={cropRef}
                        style={{height: 400, width: "100%"}}
                        zoomTo={0.5}
                        aspectRatio={3}
                        dragMode="move"
                        preview=".img-preview"
                        src={image}
                        viewMode={1}
                        minCropBoxHeight={10}
                        minCropBoxWidth={10}
                        background={false}
                        responsive={false}
                        autoCropArea={1}
                        checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                        guides={true}
                    />
                </div>
                <div>
                    <div className="box" style={{width: "50%", float: "right"}}>
                        <h1>Preview</h1>
                        <div
                            className="img-preview"
                            style={{width: "100%", float: "left", height: "300px", overflow: "hidden"}}
                        />
                    </div>
                    <div
                        className="box"
                        style={{width: "50%", float: "right", height: "300px"}}
                    >
                        <h1>
                            <span>Crop</span>
                            <button style={{float: "right"}} onClick={getCropData}>
                                Crop Image
                            </button>
                        </h1>
                        <img style={{width: "100%"}} src={cropData} alt="cropped"/>
                    </div>
                </div>
                <br style={{clear: "both"}}/>
            </div>
        </Modal>
    </>
}