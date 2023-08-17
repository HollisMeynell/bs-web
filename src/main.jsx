import React, {useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import '@/style/index.css'
import {App, ConfigProvider, message, theme} from "antd";
import {Router as indexRouter} from '@/page/index.jsx'
import {Router as devRouter} from '@/page/developer.jsx'
import {Router as homeRouter} from '@/page/home.jsx'
import {Router as bindRouter} from '@/page/bind.jsx'
import {Router as userInfoRouter} from '@/page/userInfo.jsx'
import store from "@/components/store.js";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import {Provider, useSelector} from "react-redux";
import {egg} from "@/components/other/egg.js";
import clickBoomEffect from "@/components/other/boom.js";

const router = createBrowserRouter([indexRouter, homeRouter, devRouter, bindRouter, userInfoRouter])


function Main() {
    const themeConf = {
        ...useSelector((state) => state.theme.value)
    };
    if (themeConf.dark) {
        themeConf.algorithm = theme.darkAlgorithm;
    }

    useEffect(() => {
        setTimeout(clickBoomEffect, 32*1000);
        document.addEventListener("keydown", egg);
        return () => {
            document.removeEventListener("keydown", egg);
        }
    }, []);
    return <ConfigProvider theme={themeConf}>
        <RouterProvider router={router}/>
    </ConfigProvider>
}

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
        <App style={{height:'100%'}}>
            <Provider store={store}>
                <Main/>
            </Provider>
        </App>
    // </React.StrictMode>
)
