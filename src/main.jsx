import React, {useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import '@/style/index.css'
import {App, ConfigProvider, theme} from "antd";
import {Router as indexRouter} from '@/page/index.jsx'
import {Router as devRouter} from '@/page/developer.jsx'
import {Router as homeRouter} from '@/page/home.jsx'
import {Router as bindRouter} from '@/page/bind.jsx'
import {Router as userInfoRouter} from '@/page/userInfo.jsx'
import {Router as LoginRouter} from '@/page/login.jsx'
import {Router as OauthRouter} from '@/page/oauth.jsx'
import store from "@/components/store.js";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import {Provider, useSelector} from "react-redux";
import {egg} from "@/components/other/egg.js";
import clickBoomEffect from "@/components/other/boom.js";
import ErrorPage from "@/Err/error.jsx";
import OsuUserCard from "@/components/card/osu-user-card.jsx";

const test = {
    path: '/test',
    element: <>
        <OsuUserCard uid={8664140}/>
        <OsuUserCard uid={17064371}/>
    </>,
    errorElement: <ErrorPage/>,
}

const router = createBrowserRouter(
    [indexRouter, homeRouter, devRouter, bindRouter, userInfoRouter, OauthRouter, LoginRouter, test],
    {
        basename: import.meta.env.BASE_URL || ""
    }
)


function Main() {
    const themeConf = {
        ...useSelector((state) => state.theme.value)
    };
    if (themeConf.dark) {
        themeConf.algorithm = theme.darkAlgorithm;
    }

    useEffect(() => {
        setTimeout(clickBoomEffect, 15);
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
    <App style={{height: '100%', overflow: "hidden"}}>
        <Provider store={store}>
            <Main/>
        </Provider>
    </App>
)
