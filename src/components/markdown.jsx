import {useEffect, useRef, useState} from "react";
import {Input} from 'antd'
import '../style/github-markdown.css'
import {useSelector} from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";




export default function Editor({edit, defaultValue, onChange, editStatus}) {
    const box = useRef(null);
    const [mdStr, setMdStr] = useState(defaultValue);
    function handleChange(e) {
        typeof onChange === 'function' && onChange(e.target.value);
        setMdStr(e.target.value);
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

    return <div className={"markdown-body"} style={{marginTop: 20}} ref={box}>
        {!!edit ?
            <Input.TextArea
                autoSize
                value={mdStr}
                status={editStatus}
                onChange={handleChange}
                style={{minHeight: 180}}
                placeholder={"Markdown 支持,如果想使用图片请用外链插入markdown '![text](url)'"}
            />
            :
            <ReactMarkdown remarkPlugins={[remarkGfm,remarkMath,remarkFrontmatter]} children={mdStr}/>
        }
    </div>
}