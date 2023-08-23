import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Input, Switch, theme} from 'antd'
import '@/style/github-markdown.css'
import "./markdown.css"
import {useSelector} from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";
import 'mac-scrollbar/dist/mac-scrollbar.css';
import {MacScrollbar} from "mac-scrollbar";

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
        if (edit) {
            typeof onChange === 'function' && onChange(e.target.value);
            setMdStr(e.target.value);
        }
    }

    function handleShow() {
        setEditText((e) => !e);
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
                placeholder={"Markdown 支持,如果想使用图片请用外链插入markdown '![text](url)'"}
            />
            :
            <MacScrollbar style={{maxHeight: "100%", maxWidth: "100%"}}>
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath, remarkFrontmatter]} children={mdStr}/>
            </MacScrollbar>
        }
        <div hidden={!allowControl} className={"markdown-controller"}>
            <Switch checkedChildren="预览" unCheckedChildren="编辑" checked={!editText} onChange={handleShow}/>
        </div>
    </div>

}