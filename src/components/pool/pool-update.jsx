import {useEffect, useReducer, useState} from "react";
import {poolDataReduce} from "@/components/pool/pool-create.jsx";
import {uploadImage} from "@/api/util.js";
import {PoolApi} from "@/api/pool-api.js";
import {Col, Input, Modal, Row} from "antd";
import {tipsStyle} from "@/components/js-style.js";
import ImageCropper from "@/components/image-cropper.jsx";
import Editor from "@/components/markdown.jsx";
import {useSelector} from "react-redux";
import {putPool} from "@/components/store/pool.js";

export default function ({poolId, children}) {
    const [insertStatus, setInsertStatus] = useState({
        name: null,
        info: null,
        banner: null,
    });
    const [insertData, setInsertData] = useReducer(poolDataReduce, {
        name: '',
        info: '',
        banner: ''
    });
    const allPools = useSelector(state => state.pool.allPool);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalOkButton, setModalOkButton] = useState(false);

    useEffect(() => {
        loadData();
    }, [poolId]);
    const setData = (a) => {
        return (e) => {
            setInsertData({type: 'set', key: a, value: e});
            if (insertStatus[a]) {
                const newStatus = {
                    ...insertStatus
                }
                newStatus[a] = null;
                setInsertStatus(newStatus);
            }
        }
    }

    /**
     * @param {Blob} imgBlob
     */
    function getImage(imgBlob) {
        if (imgBlob) {
            setInsertStatus({
                ...insertStatus,
                banner: false
            })
        }

        setInsertData({type: "img", value: imgBlob});
    }

    function checkSubmit() {
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
        }
        return allPass;
    }

    async function onSubmit() {
        if (!checkSubmit()) return false;
        const key = "pool-update";
        outMessage({
            key,
            type: "loading",
            content: "加载中"
        })
        let res;
        try {
            let fileKey;
            if (typeof insertData.banner !== 'string') {
                fileKey = (await uploadImage(insertData.banner, "banner.png")).fileKey;
            } else {
                fileKey = insertData.banner;
            }
            res = await PoolApi.updatePool({
                poolId,
                name: insertData.name,
                info: insertData.info,
                banner: fileKey,
            });
        } catch (e) {
            outMessage({
                key,
                type: "error",
                content: `修改失败: ${e.message}`,
                duration: 10
            });
            return false;
        }
        if (res.code === 200) {
            dispatch(putPool(res.data));
            outMessage({
                key,
                type: "success",
                content: '修改完成',
                duration: 3
            });
            return true;
        } else {
            outMessage({
                key,
                type: "error",
                content: `修改失败: ${res.message}`,
                duration: 10
            });
        }

        return false;
    }

    function loadData() {
        const thisPool = allPools[poolId];
        if (thisPool) {
            setInsertData({
                type: 'all', value: thisPool
            });
        } else {
            PoolApi.getPoolInfo({poolId})
                .then(poolInfo => {
                    dispatch(putPool(poolInfo));
                    setInsertData({
                        type: 'all', value: poolInfo
                    });
                })
                .catch(e => {
                    outMessage({
                        key: 'get-pool-err',
                        type: "error",
                        content: `加载错误: ${e.message}`,
                        duration: 6
                    })
                });
        }
    }

    const setUploadStatus = (f) => {
        setInsertStatus({
            ...insertStatus,
            banner: f,
        })
    }

    const onOpen = () => {
        setModalOpen(true);
        loadData()
    }

    const onClose = () => {
        setModalOpen(false);
    }

    const onOk = async () => {
        setModalOkButton(true);
        const submitOK = await onSubmit();
        setModalOkButton(false)
        if (submitOK) {
            setInsertData({type: "clear"});
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
                        tips={"使用宽高比 2.15"}
                        aspectRatio={86 / 40}
                        imageOldUrl={insertData.banner}
                        setCutImage={getImage}/>
                </Col>
            </Row>

            <Row align={"middle"} justify="start" style={{marginTop: "2rem"}}>
                <Col style={tipsStyle}>info</Col>
            </Row>

            <Row align={"middle"} justify="space-evenly" style={{marginTop: "1rem"}}>
                <Col span={24}>
                    <Editor edit onChange={setData("info")} editStatus={insertStatus.info}
                            defaultValue={insertData.info}/>
                </Col>
            </Row>
        </Modal>
    </>
}