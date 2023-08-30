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
    const [mdStr, setMdStr] = useState(defaultValue);
    const [editText, setEditText] = useState(edit);

    function handleChange(e) {
        let text;
        if (typeof e?.target?.value == "undefined") {
            text = e;
        } else {
            text = e.target.value;
        }
        if (edit) {
            typeof onChange === 'function' && onChange(text);
            setMdStr(text);
        }
    }

    function handleShow() {
        console.log();
        setEditText((e) => !e);
    }

    async function onTextAreaPaset(e) {
        const clipboardData = e.clipboardData || e.originalEvent.clipboardData;
        const textArea = e.target;
        if (!(clipboardData || clipboardData.items)) return;
        textArea.style.cursor = "wait";
        for (const item of clipboardData.items) {
            if (item.type.startsWith("image")) {
                e.preventDefault();
                await handleImage(item);
            }
        }
        textArea.style.cursor = "default";

        async function handleImage(item) {
            const file = item.getAsFile();
            let text;
            try {
                const res = await uploadImage(file, file.name);
                text = ` ![image](${res.fileKey}) `;
            } catch (e) {
                text = ` 图片上传失败, 请稍后再试. `;
            }
            textAreaAddStr(text)
        }

        function textAreaAddStr(str) {
            const s = {
                start: textArea.selectionStart,
                end: textArea.selectionEnd,
            }
            handleChange(textArea.value.substring(0, s.start) + str + textArea.value.substring(s.end));
            s.start += str.length;
            s.end += str.length;
            setTimeout(() => {
                textArea.focus();
                textArea.selectionStart = s.start;
                textArea.selectionEnd = s.end;
            }, 0)
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
                autoSize
                value={mdStr}
                status={editStatus}
                onChange={handleChange}
                style={{minHeight: 180}}
                disabled={!edit}
                onPaste={onTextAreaPaset}
                placeholder={"Markdown 支持,如果想使用图片请用外链插入markdown '![text](url)'"}
            />
            : <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath, remarkFrontmatter]}
                             children={markdownReplaceImage(mdStr)}/>
        }
        <div hidden={!allowControl} className={"markdown-controller"}>
            <Switch checkedChildren="预览" unCheckedChildren="编辑" checked={!editText} onChange={handleShow}/>
        </div>
    </div>
}

function markdownReplaceImage(md) {
    const reg = /(?<=!\[image]\()(?=[a-z0-9\-]+\))/g
    debugger
    return md.replaceAll(reg, getImageUrl(""));
}
