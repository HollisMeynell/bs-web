import {Input, Space, Tag, theme} from "antd";
import {useEffect, useRef, useState} from "react";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";

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
        setTags(tagList);
    }, [tagList]);

    useEffect(() => {
        inputRef?.current?.focus();
    }, [changeTag, inputVisible]);

    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setTags(newTags);
    };
    const showInput = () => {
        setInputVisible(true);
    };
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleTagSet = (tag) => {
        return function (e) {
            const newTags = tags.map(t => t === tag ? e.target.value : tag);
            setChangeTag('');
        }
    }

    /**
     * @param {string} tag
     */
    const handleSet = (tag) => {
        return () => {
            setInputValue(tag);
            setChangeTag(tag);
        }
    }

    const handleInputConfirm = () => {
        if (inputValue && inputValue.length > 12) {
            setInputStatus('error');
            outMessage({
                key: messageKey,
                type: 'error',
                content: "单个TAG不得超过12个字符",
                duration: 4,
            });
            return
        }

        if (tags.indexOf(inputValue) !== -1) {
            outMessage({
                key: messageKey,
                type: 'error',
                content: "此tag已存在",
                duration: 4,
            });
            setInputStatus('error');
            return;
        }
        if (changeTag) {
            const newTags = tags.map(t => t === changeTag ? inputValue : t);
            setTags(newTags);
            setChangeTag('');
            setInputVisible(false);
            setInputValue('');
            return;
        }
        setTags([...tags, inputValue]);
        setInputStatus('');
        setInputVisible(false);
        setInputValue('');
    };
    const tagInputStyle = {
        width: 64, verticalAlign: 'top', marginInlineEnd: 8
    };
    const tagPlusStyle = {
        background: token.colorBgContainer, borderStyle: 'dashed',
    };

    return <Space size={[10, 8]} wrap align={"start"} style={{marginTop: 10, marginBottom: 10}}>
        <Space size={[0, 8]} wrap align={"start"}>
            {tags.map((tag) => {
                if (!tag) return null;
                if (changeTag && changeTag === tag) {
                    return <Input
                        key={tag}
                        ref={inputRef}
                        type="text"
                        size="small"
                        style={tagInputStyle}
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputConfirm}
                        onPressEnter={handleInputConfirm}
                        status={inputStatus}
                    />
                }
                return (<Tag
                    key={tag}
                    bordered={false}
                    color={token.colorPrimaryBg}
                    style={{userSelect: 'none',}}
                    onDoubleClick={handleSet(tag)}
                    children={<><span style={colorActive} children={tag}/>
                        <CloseOutlined style={colorActive} onClick={() => handleClose(tag)}/></>}
                />);
            })}
        </Space>
        {changeTag ?
            null :
            inputVisible ?
                <Input
                    ref={inputRef}
                    type="text"
                    size="small"
                    style={tagInputStyle}
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputConfirm}
                    onPressEnter={handleInputConfirm}
                    status={inputStatus}
                /> :
                <Tag style={tagPlusStyle} onClick={showInput}>
                    <PlusOutlined/> 创建标签
                </Tag>
        }
    </Space>;
}