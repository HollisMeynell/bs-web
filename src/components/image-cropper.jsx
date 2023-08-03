import {useRef, useState} from "react";
import {Button, Divider, Modal, Upload} from "antd";
import Cropper from "react-cropper";
import {UploadOutlined} from "@ant-design/icons";
import "cropperjs/dist/cropper.css";


export default function ({
                             setCutImage = (imgBlob) => {
                             },
                         }) {

    const [image, setImage] = useState("");

    const [modalOpen, setModalOpen] = useState(false);

    const cropRef = useRef();

    const closeModal = () => {
        setModalOpen(false);
    }

    const onUpload = (file) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        }
        setModalOpen(true);
        reader.readAsDataURL(file);
    }
    const getCropData = async () => {
        if (typeof cropRef.current?.cropper !== "undefined") {
            let blob = await new Promise((resolve) => {
                cropRef.current?.cropper.getCroppedCanvas().toBlob((blob) => {
                    resolve(blob);
                });
            })
            if (blob.size > 800 * 1024) {
                blob = await new Promise((resolve) => {
                    cropRef.current?.cropper.getCroppedCanvas().toBlob((blob) => {
                        resolve(blob);
                    }, "image/jpeg", 95);
                })
                setCutImage(blob);
            } else {
                setCutImage(blob);
            }
        }
    };

    return <>
        <Upload beforeUpload={onUpload} fileList={[]}>
            <Button icon={<UploadOutlined/>}>
                上传
            </Button>
        </Upload>

        <Modal open={modalOpen} onOk={getCropData} onCancel={closeModal} width={650}>
            <div style={{width: 600, height: 400}}>
                <Divider orientation={"left"}>建议尺寸 </Divider>
                <div style={{width: "80%", margin: "0 auto", display: "flex", justifyContent: "center"}}>
                    <Cropper
                        ref={cropRef}
                        style={{height: "100%"}}
                        zoomTo={0}
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
                        checkOrientation={false}
                        guides={true}
                    />
                </div>
                <Divider orientation={"left"}>预览图</Divider>
                <div>
                    <div className="box" style={{width: "80%", margin: "0 auto"}}>
                        <div
                            className="img-preview"
                            style={{width: "100%", float: "left", height: "300px", overflow: "hidden"}}
                        />
                    </div>
                </div>
                <br style={{clear: "both"}}/>
            </div>
        </Modal>
    </>
}