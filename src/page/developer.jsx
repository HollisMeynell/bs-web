import ErrorPage from "../Err/error.jsx";
import {Input, Layout, Select, Space, theme} from "antd";
import {useEffect, useRef, useState} from "react";
import swatch from "react-color/lib/components/common/Swatch.js";
import {useNavigate} from "react-router";
import {HttpRequest} from "../api/util.js";

export const Router = {
    path: '/dev',
    element: <Developer/>,
    errorElement: <ErrorPage/>,
}

function Developer() {
    const navigate = useNavigate();
    const text = useRef(null);
    const {token} = theme.useToken();
    const [message, setMessage] = useState("");
    const [input, setInput] = useState('');
    const [textLine, setTextLine] = useState([]);
    const [type, setType] = useState('cmd');

    const selector = [
        { value: 'cmd', label: 'command' },
        { value: 'sql', label: 'sql' },
    ];
    function userMsg(s) {
        s = '> ' + s;
        setTextLine((old) => [s, ...old]);
        text.current.resizableTextArea.textArea.scrollTop = 0;
    }

    function sysMsg(s) {
        setTextLine((old) => [s, ...old]);
        text.current.resizableTextArea.textArea.scrollTop = 0;
    }

    function onEnter(e) {
        if (e) {
            if (e === "exit" || e === "quit"){
                navigate('/');
            }
            switch(e) {
                case "exit":
                case "quit": {
                    navigate('/');
                    break;
                }
                case "oauth": {
                    HttpRequest.get("/api/public/getOauthUrl").then((rep) => {
                        sysMsg(rep.data.code);
                    });
                    break;
                }
            }
            userMsg(e);
        }
        setInput('');
    }

    useEffect(() => {
        setMessage(textLine.join('\n'));
    }, [textLine]);


    return <Layout style={{minHeight: '100%'}}>
        <Layout.Header style={{backgroundColor: token.colorPrimaryBg}}>
            <Space.Compact style={{width: '100%'}}>
                <Input value={input} onChange={e => setInput(e.target.value)} onPressEnter={(e) => {onEnter(e.target.value);}} />
                <Select value={type} onChange={setType} style={{width: '120px'}} options={selector}/>
            </Space.Compact>
        </Layout.Header>
        <Layout.Content>
            <div style={{padding: '50px 50px 0', width: '100%', height: '80vh'}}>
                <Input.TextArea
                    ref={text}
                    bordered={false}
                    value={message}
                    style={{resize: 'none'}}
                />
            </div>
        </Layout.Content>
    </Layout>
}