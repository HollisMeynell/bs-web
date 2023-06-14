import {Divider, Input, Space, Tag, theme} from "antd";
import {useEffect, useRef, useState} from "react";
import {CloseOutlined, PlusOutlined} from "@ant-design/icons";

export function TagBox({tagList = [], onChange}) {
    const {token} = theme.useToken();
    const [tags, setTags] = useState(tagList);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [inputStatus, setInputStatus] = useState('');
    const inputRef = useRef(null);
    const editInputRef = useRef(null);
    const colorActive = {color: token.colorPrimaryTextActive};

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    useEffect(() => {
        editInputRef.current?.focus();
    }, [inputValue]);

    useEffect(() => {
        if (typeof onChange === 'function') {
            onChange(tags);
        }
    }, [tags]);
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
    const handleInputConfirm = () => {
        if (inputValue && inputValue.length > 12) {
            setInputStatus('error');
            log.error("单个TAG不得超过12个字符").then();
            return
        }
        if (inputValue) {
            if (tags.indexOf(inputValue) === -1) {
                setTags([...tags, inputValue]);
            } else {
                log.info("此tag已存在").then();
            }
        }
        setInputStatus('');
        setInputVisible(false);
        setInputValue('');
    };
    const tagInputStyle = {
        width: 78, verticalAlign: 'top',
    };
    const tagPlusStyle = {
        background: token.colorBgContainer, borderStyle: 'dashed',
    };
    return (<Space size={[10, 8]} wrap align={"start"}>
        <Space size={[0, 8]} wrap align={"start"} >
            {tags.map((tag) => {
                if (!tag) return null;
                return (<Tag
                    key={tag}
                    bordered={false}
                    color={token.colorPrimaryBg}
                    style={{userSelect: 'none',}}
                    children={<><span style={colorActive} children={tag}/>
                        <CloseOutlined style={colorActive} onClick={() => handleClose(tag)}/></>}
                />);
            })}
        </Space>
        {inputVisible ? (<Input
            ref={inputRef}
            type="text"
            size="small"
            style={tagInputStyle}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
            status={inputStatus}
        />) : (<Tag style={tagPlusStyle} onClick={showInput}>
            <PlusOutlined/> 创建标签
        </Tag>)}
    </Space>);
}