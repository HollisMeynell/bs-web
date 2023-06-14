import {Card} from "antd";
import Editor from "../../components/markdown.jsx";
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";

export default function ({id, name, info}){
    return <div style={{width:'600px'}}>
        <Card
            title={name}
            actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
                <EllipsisOutlined key="ellipsis" />,
            ]}
        >
            <Editor defaultValue={info}/>
        </Card>
    </div>
}