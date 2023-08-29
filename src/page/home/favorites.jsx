import ErrorPage from "../../Err/error.jsx";
import {Button, Space} from "antd";
import './favorites.css';
import FilterCard from "@/components/card/filter-card.jsx";
import {useRef} from "react";
import {dom2image} from "@/assets/utils/dom-to-image.js";
import {saveFile, writeImageToClipboard} from "@/assets/utils/file-util.js";

export const Router = {
    path: 'favorites', element: <Favorites/>, errorElement: <ErrorPage/>
}

export default function Favorites() {
    const filterR = useRef(null);

    async function copy() {
        const node = filterR.current;
        const width = node.clientWidth
        const height = node.scrollHeight
        const image = await dom2image.toPng(node, {width, height});
        await writeImageToClipboard(image);
        alert("OK~");
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
        const link = document.createElement('a');
        link.download = "paint.png";
        link.href = image;
        link.click();
    }

    return <>
        <div style={{margin: '10px 10px'}}>
            <Space size={[10, 10]} align="start" wrap>
                <div ref={filterR}>
                    <FilterCard/>
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