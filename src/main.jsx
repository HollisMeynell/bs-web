import React from 'react'
import ReactDOM from 'react-dom/client'
import './style/index.css'
import {ConfigProvider, message, theme} from "antd";
import {Router as indexRouter} from './page/index.jsx'
import {Router as devRouter} from './page/developer.jsx'
import {Router as homeRouter} from './page/home.jsx'
import {Router as bindRouter} from './page/bind.jsx'
import store from "./components/store.js";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import {Provider, useSelector} from "react-redux";

const router = createBrowserRouter([indexRouter, homeRouter, devRouter, bindRouter])


function Main() {
    const [messageApi, contextHolder] = message.useMessage();
    window.log = messageApi;
    const themeConf = {
        ...useSelector((state) => state.theme.value)
    };
    if (themeConf.dark) {
        themeConf.algorithm = theme.darkAlgorithm;
    }
    return <ConfigProvider theme={themeConf}>
        {contextHolder}
        <RouterProvider router={router}/>
    </ConfigProvider>
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <Main/>
        </Provider>
    </React.StrictMode>
)
