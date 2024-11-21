import {
  BulbOutlined,
  HighlightOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { FloatButton, Popover, theme } from "antd";
import { TwitterPicker } from "react-color";
import { useDispatch } from "react-redux";
import { changeDark, setColor } from "@/components/store/theme";

const THEME_COLORS = [
  "#f5222d",
  "#fa541c",
  "#d46b08",
  "#d4b106",
  "#7cb305",
  "#389e0d",
  "#08979c",
  "#0958d9",
  "#722ed1",
  "#eb2f96",
] as const;

interface ColorChangeResult {
  hex: string;
}

export default function Setter() {
  const dispatch = useDispatch();
  const { token } = theme.useToken();

  // 处理颜色变更
  const handleColorChange = (color: ColorChangeResult) => {
    dispatch(setColor(color.hex));
  };

  // 处理暗色模式切换
  const handleDarkModeToggle = () => {
    dispatch(changeDark());
  };

  // 图标样式
  const iconStyle = { color: token.colorPrimary };

  return (
    <FloatButton.Group
      trigger="hover"
      icon={<SettingOutlined style={iconStyle} />}
    >
      <Popover
        content={
          <TwitterPicker
            color={token.colorPrimary}
            onChangeComplete={handleColorChange}
            colors={[...THEME_COLORS]}
            triangle={"hide"}
          />
        }
        placement="left"
        arrow={false}
        trigger="click"
      >
        <FloatButton
          shape="circle"
          icon={<HighlightOutlined style={iconStyle} />}
        />
      </Popover>
      <FloatButton
        shape="circle"
        icon={<BulbOutlined style={iconStyle} />}
        onClick={handleDarkModeToggle}
      />
    </FloatButton.Group>
  );
}
