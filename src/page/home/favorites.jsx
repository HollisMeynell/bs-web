import {Button, Space} from "antd";
import '@/style/home/favorites.css';
import FilterCard from "@/components/card/filter-card.jsx";
import {useRef} from "react";
import {dom2image} from "@/utils/dom-to-image.js";
import {downloadFile, saveFile, writeImageToClipboard} from "@/utils/file-util.js";
import {useDispatch} from "react-redux";

export default function Favorites(){
    const filterR = useRef(null);
    const dispatch = useDispatch();

    async function copy() {
        const node = filterR.current;
        const width = node.clientWidth
        const height = node.scrollHeight
        const image = await dom2image.toPng(node, {width, height});
        await writeImageToClipboard(image);
    }

    async function download() {
        const node = filterR.current;
        const width = node.clientWidth
        const height = node.scrollHeight
        const image = await dom2image.toPng(node, {width, height});
        await saveFile("png", image);
    }

    async function downloadOld() {
        const node = filterR.current;
        const width = node.clientWidth
        const height = node.scrollHeight
        const image = await dom2image.toPng(node, {width, height, toDataUrl: true});
        downloadFile(image, "paint.png");
    }

    function handleChange(v) {

    }

    return <>
        <div style={{margin: '10px 10px'}}>
            <Space size={[10, 10]} align="start" wrap>
                <div ref={filterR}>
                    <FilterCard onChange={handleChange}/>
                </div>
                <Button onClick={copy}>{"<-"}复制到剪切板</Button>
                <Button onClick={download}>下载文件</Button>
                <Button onClick={downloadOld}>下载文件-兼容方案</Button>
                {/*<MapCard bid={1972258} r={"a"}/>*/}
                {/*<MapCard bid={1972258} r={"ab"}/>*/}
                {/*<MapCard bid={1972258} r={"abc"}/>*/}
                {/*<MapCard bid={1972258} r={"abcd"}/>*/}
            </Space>
        </div>
    </>
}