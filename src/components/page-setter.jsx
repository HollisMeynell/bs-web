import {BulbOutlined, HighlightOutlined, SettingOutlined} from "@ant-design/icons";
import {FloatButton, Popover, theme} from "antd";
import {TwitterPicker} from "react-color";
import {useParams} from "react-router";
import {useDispatch} from "react-redux";
import {changeDark, setColor} from "@/components/store/theme.js";


export function Setter() {
    const dispatch = useDispatch();
    const {} = useParams();
    const {token} = theme.useToken();

    const colors = [
        '#f5222d', '#fa541c', '#d46b08', '#d4b106',
        '#7cb305', '#389e0d', '#08979c',
        '#0958d9', '#722ed1', '#eb2f96',
    ]

    function changeColor(color) {
        dispatch(setColor(color.hex));
    }

    function darkMode() {
        dispatch(changeDark());
    }

    return <FloatButton.Group
        trigger="hover"
        icon={<SettingOutlined style={{color: token.colorPrimary}}/>}
    >
        <Popover content={<TwitterPicker color={token.colorPrimary} onChangeComplete={changeColor}
                                         colors={colors} triangle={'hide'}/>}
                 placement={"left"}
                 arrow={false}
                 trigger={"click"}
        >
            <FloatButton shape="circle"
                         icon={<HighlightOutlined style={{color: token.colorPrimary}}/>}/>
        </Popover>
        <FloatButton shape="circle"
                     icon={<BulbOutlined style={{color: token.colorPrimary}} onClick={darkMode}/>}/>
    </FloatButton.Group>
}