import {useEffect, useRef, useState} from "react";
import {Button, Divider, Modal, Upload} from "antd";
import Cropper from "react-cropper";
import {UploadOutlined} from "@ant-design/icons";
import "cropperjs/dist/cropper.css";
import {getImageUrl} from "@/api/util.js";


export default function ({
                             setCutImage,
                             uploadStatus = false,
                             setUploadStatus,
                             enablePreview = true,
                             tips,
                             imageOldUrl = '',
                             aspectRatio,
                         }) {

    const [image, setImage] = useState("");

    const [imageUrl, setImageUrl] = useState('');
    const [modalOpen, setModalOpen] = useState(false);

    const cropRef = useRef();
    const box = useRef();

    const closeModal = () => {
        setImage("");
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

    const onRemove = () => {
        setImageUrl("");
        setCutImage(null);
    }
    const onPreview = (file) => {
        setImage(file.url);
        setModalOpen(true);
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
                let dataURL = cropRef.current?.cropper.getCroppedCanvas().toDataURL("image/jpeg", 95);
                setImageUrl(dataURL);
            } else {
                setCutImage(blob);
                let dataURL = cropRef.current?.cropper.getCroppedCanvas().toDataURL();
                setImageUrl(dataURL);
            }

            if (typeof setUploadStatus === "function") setUploadStatus(false);
            closeModal();
        }
    };

    /**
     * @param {KeyboardEvent} e
     */
    function handleKeyDown(e) {
        if (e.key === "ArrowUp" || e.key === "w") {
            cropRef.current?.cropper.move(0, 1);
        }
        if (e.key === "ArrowDown" || e.key === "s") {
            cropRef.current?.cropper.move(0, -1);
        }
        if (e.key === "ArrowLeft" || e.key === "a") {
            cropRef.current?.cropper.move(1, 0);
        }
        if (e.key === "ArrowRight" || e.key === "d") {
            cropRef.current?.cropper.move(-1, 0);
        }
        if (e.key === "-") {
            cropRef.current?.cropper.zoom(-0.1);
        }
        if (e.key === "+" || e.key === "=") {
            cropRef.current?.cropper.zoom(0.1);
        }
    }

    useEffect(() => {
        if (typeof imageOldUrl === 'string' && imageOldUrl.length > 0) {
            setImageUrl(getImageUrl(imageOldUrl));
        }
    }, [imageOldUrl]);

    useEffect(() => {

        const interval = setInterval(addEvent, 100);
        function addEvent () {
            if (box.current) {
                box.current.addEventListener('keypress', handleKeyDown);
                clearInterval(interval)
            }
        }
        return () => {
            box.current.removeEventListener('keypress', handleKeyDown);
        }
    }, []);

    return <>
        <div style={{
            width: 100, height: 50, display: "flex",
            justifyContent: "center", alignItems: "center",
            overflow: "hidden"
        }}>
            <div style={imageUrl ? {transform: "translate(4px, 5px)"} : null}>
                <Upload beforeUpload={onUpload}
                        accept={"image/*"}
                        onPreview={onPreview}
                        onRemove={onRemove}
                        listType={imageUrl ? "picture-card" : "text"}
                        fileList={imageUrl ? [{uid: "0", status: "done", url: imageUrl}] : []}>
                    {imageUrl ? null : <Button icon={<UploadOutlined/>} danger={uploadStatus}>上传</Button>}
                </Upload>
            </div>
        </div>
        <Modal open={modalOpen} onOk={getCropData} onCancel={closeModal} width={550}>
            <div style={{width: 500}} ref={box}>
                <Divider orientation={"left"}>{tips}</Divider>
                <div style={{width: "80%", margin: "0 auto", display: "flex", justifyContent: "center"}}>
                    <Cropper
                        ref={cropRef}
                        style={{height: "100%", maxHeight: '16rem'}}
                        zoomTo={0}
                        aspectRatio={aspectRatio}
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
                {enablePreview ?
                    <>
                        <Divider orientation={"left"}>预览图</Divider>
                        <div>
                            <div className="box" style={{width: "80%", margin: "0 auto"}}>
                                <div
                                    className="img-preview"
                                    style={{width: "100%", float: "left", height: "300px", overflow: "hidden"}}
                                />
                            </div>
                        </div>
                    </>
                    : null}
                <br style={{clear: "both"}}/>
            </div>
        </Modal>
    </>
}