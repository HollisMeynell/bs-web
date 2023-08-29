import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Input, Switch, theme} from 'antd'
import '@/style/github-markdown.css'
import "./markdown.css"
import {useSelector} from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";
import {getImageUrl, uploadImage} from "@/api/util.js";

export default function Editor({
                                   edit,
                                   defaultValue,
                                   onChange,
                                   editStatus,
                                   allowControl: allowControl = true,
                                   maxHeight,
                                   maxWidth
                               }) {
    const box = useRef(null);
    const textArea = useRef(null);
    const [mdStr, setMdStr] = useState(defaultValue);
    const [editText, setEditText] = useState(edit);

    function handleChange(e) {
        if (edit) {
            typeof onChange === 'function' && onChange(e.target.value);
            setMdStr(e.target.value);
        }
    }

    function handleShow() {
        console.log();
        setEditText((e) => !e);
    }

    async function onTextAreaPaset(e) {
        const clipboardData = e.clipboardData || e.originalEvent.clipboardData;
        if (!(clipboardData || clipboardData.items)) return;
        for (const item of clipboardData.items) {
            if (item.type.startsWith("image")) {
                e.preventDefault();
                debugger
                await handleImage(item);
            }
        }

        async function handleImage(item){
            const file = item.getAsFile();
            try {
                const res = await uploadImage(file, file.name);
                await navigator.clipboard.writeText(`\n![image](${getImageUrl(res.fileKey)})`);
            } catch (e) {
                // do nothing
            }
        }
    }

    const isDark = useSelector((state) => state.theme.value.dark);
    useEffect(() => {
        if (isDark) {
            box.current.classList.add('markdown-dark');
            box.current.classList.remove('markdown-light');
        } else {

            box.current.classList.add('markdown-light');
            box.current.classList.remove('markdown-dark');
        }
    }, [isDark]);

    useEffect(() => {
        const textAreaNode = textArea.current.resizableTextArea.textArea;
        // textAreaNode.addEventListener("");
    }, []);

    const style = {};
    if (maxWidth) {
        style.maxWidth = maxWidth;
    }
    if (maxHeight) {
        style.maxHeight = maxHeight;
    }
    return <div className={"markdown-body"} ref={box} style={style}>

        {!!editText ?
            <Input.TextArea
                ref={textArea}
                autoSize
                value={mdStr}
                status={editStatus}
                onChange={handleChange}
                style={{minHeight: 180}}
                disabled={!edit}
                onPaste={onTextAreaPaset}
                placeholder={"Markdown 支持,如果想使用图片请用外链插入markdown '![text](url)'"}
            />
            : <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath, remarkFrontmatter]} children={markdownReplaceImage(mdStr)}/>
        }
        <div hidden={!allowControl} className={"markdown-controller"}>
            <Switch checkedChildren="预览" unCheckedChildren="编辑" checked={!editText} onChange={handleShow}/>
        </div>
    </div>
}

function markdownReplaceImage(md){
    const reg = /(?<=!\[image]\()(?=[a-z0-9\-]{36}\))/
    return md;
}
