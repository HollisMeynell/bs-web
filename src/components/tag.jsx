import {Input, Space, Tag, theme} from "antd";
import {useEffect, useRef, useState} from "react";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";

const messageKey = 'tagBox';

const TagAlreadyExists = {
    key: messageKey,
    type: 'error',
    content: "此tag已存在",
    duration: 3,
};

const TagTooLong = {
    key: messageKey,
    type: 'error',
    content: "单个TAG不得超过7个字符",
    duration: 3,
}

/**
 * @param {[string]} tagList
 * @param { function([string]) } onChange
 * @param { function(string) } onAddTag
 * @param { function(string) } onDeleteTag
 * @param { function(string, string) } onSetTag
 * @returns {JSX.Element}
 * @constructor
 */
export function TagBox({tagList, onChange, onAddTag, onDeleteTag, onSetTag}) {
    const {token} = theme.useToken();
    const [tags, setTags] = useState(tagList);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [inputStatus, setInputStatus] = useState('');
    const [changeTag, setChangeTag] = useState('');
    const inputRef = useRef(null);
    const colorActive = {color: token.colorPrimaryTextActive};
    const messageKey = 'tagBox';

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(tags);
        }
    }, [tags]);

    useEffect(() => {
        if (tags.length === tagList.length) {
            let f = true;
            for (const tag of tags) {
                if (tagList.indexOf(tag) === -1) {
                    f = false;
                    break;
                }
            }
            if (f) {
                return;
            }
        }
        setTags(tagList);
    }, [tagList]);

    const handleDelete = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setTags(newTags);
    };

    /** 1
     * @param {string} tag
     */
    const handleSet = (tag) => {
        return (newTag) => {
            // 传递为空说明未修改
            if (!newTag) return;
            const newTags = tags.map(t => t === tag ? newTag : t);
            setTags(newTags);
            setChangeTag('');
        }
    }

    function handleCreate(tag) {
        setTags((o) => [...o, tag]);
    }

    function handleCheck(newTag) {
        return tags.indexOf(newTag) !== -1;
    }
    const tagInputStyle = {
        width: 64, verticalAlign: 'top', marginInlineEnd: 8
    };
    const tagPlusStyle = {
        background: token.colorBgContainer, borderStyle: 'dashed',
    };

    return <Space size={[10, 8]} wrap align={"start"} style={{marginTop: 10, marginBottom: 10}}>
        {tags.map((tag) => {
            if (!tag) return null;
            return <EditableTag
                key={tag}
                tag={tag}
                onDelete={handleDelete}
                onChange={handleSet(tag)}
                onChanging={() => setChangeTag(tag)}
                exitChanging={() => setChangeTag('')}
                changeable={changeTag === '' || changeTag === tag}
                checkRepeat={handleCheck}
            />
        })}
        <CreateTag checkRepeat={handleCheck} onCreate={handleCreate}/>
    </Space>;
}

/**
 * @param {string} tag
 * @param {function(string)} onChange
 * @param {function(string)} onChanging
 * @param {function()} exitChanging
 * @param {function(string)} onDelete
 * @param {function(string)} checkRepeat
 * @param {boolean} changeable
 * @return {JSX.Element}
 */
function EditableTag({tag, onChange, onChanging, exitChanging, onDelete, checkRepeat, changeable}) {
    const [change, setChange] = useState(false);
    const [inputStatus, setInputStatus] = useState('');
    const [tagStr, setTagStr] = useState(tag);
    const inputRef = useRef(null);
    const {token} = theme.useToken();
    const colorActive = {color: token.colorPrimaryTextActive};

    useEffect(() => {
        setTagStr(tag);
    }, [tag]);

    useEffect(() => {
        if (change) {
            inputRef?.current?.focus();
        } else {
            exitChanging();
        }
    }, [change]);

    function handleDelete() {
        onDelete(tagStr);
    }

    function handleChange() {
        if (changeable) {
            onChanging(tag);
            setChange(true);
        }
    }

    function handleValueChange(e) {
        setTagStr(e.target.value)
    }

    function handleInputConfirm() {
        const newTag = tagStr.trim();
        if (newTag && newTag.length > 7) {
            setInputStatus('error');
            outMessage(TagTooLong);
            return;
        }

        if (newTag === tag) {
            setInputStatus('');
            setChange(false);
            return;
        }

        if (checkRepeat(newTag)) {
            outMessage(TagAlreadyExists);
            setInputStatus('error');
            return;
        }

        setInputStatus('');
        setChange(false);
        onChange(newTag);
    }

    return change ? <Input
            ref={inputRef}
            type="text"
            size="small"
            style={{width: 64, verticalAlign: 'top'}}
            value={tagStr}
            onChange={handleValueChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
            status={inputStatus}
        /> :
        <Tag
            bordered={false}
            color={token.colorPrimaryBg}
            style={{userSelect: 'none',}}
            onDoubleClick={handleChange}
            children={<>
                <span style={colorActive} children={tagStr}/>
                <CloseOutlined style={colorActive} onClick={handleDelete}/>
            </>}
        />

}

/**
 * @param {function(string)} onCreate
 * @param {function(string)} checkRepeat
 */
function CreateTag({onCreate, checkRepeat}) {
    const {token} = theme.useToken();
    const [tagStr, setTagStr] = useState(null);
    const [creating, setCreating] = useState(false);
    const [inputStatus, setInputStatus] = useState('');
    const inputRef = useRef(null);

    const tagPlusStyle = {
        background: token.colorBgContainer, borderStyle: 'dashed',
    };

    function handleCreat() {
        setCreating(true);
    }

    function handleInputChange(e) {
        setTagStr(e.target.value);
    }

    function handleInputConfirm() {
        const newTag = tagStr.trim();
        if (newTag && newTag.length > 7) {
            setInputStatus('error');
            outMessage(TagTooLong);
            return;
        }

        if (checkRepeat(newTag)) {
            outMessage(TagAlreadyExists);
            setInputStatus('error');
            return;
        }

        onCreate(newTag);
        setInputStatus('');
        setTagStr('');
        setCreating(false);
    }

    useEffect(() => {
        if (creating) {
            inputRef?.current?.focus();
        }
    }, [creating]);
    return creating ? <Input
            ref={inputRef}
            type="text"
            size="small"
            style={{ width: 64, verticalAlign: 'top'}}
            value={tagStr}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
            status={inputStatus}
        /> :
        <Tag style={tagPlusStyle} onClick={handleCreat}>
            <PlusOutlined/> 创建标签
        </Tag>
}