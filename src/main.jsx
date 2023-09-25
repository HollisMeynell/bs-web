import React, {useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import '@/style/main.css'
import {App, ConfigProvider, theme} from "antd";
import {Router as indexRouter} from '@/page/index.jsx'
import {Router as devRouter} from '@/page/developer.jsx'
import {Router as homeRouter} from '@/page/home/index.jsx'
import {Router as bindRouter} from '@/page/bind.jsx'
import {Router as userInfoRouter} from '@/page/userInfo.jsx'
import {Router as LoginRouter} from '@/page/login.jsx'
import {Router as OauthRouter} from '@/page/oauth.jsx'
import store from "@/components/store.js";
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import {Provider, useDispatch, useSelector} from "react-redux";
import {egg} from "@/components/other/egg.js";
import clickBoomEffect from "@/components/other/boom.js";
import ErrorPage from "@/Err/error.jsx";
import OsuUserCard from "@/components/card/osu-user-card.jsx";
import {delMessage, delMessageDone, popMessage, putMessage} from "@/components/store/show.js";
import TestCard from "@/components/card/test-card.jsx";

const test = {
    path: '/test',
    element: <>
        <OsuUserCard uid={8664140}/>
        <OsuUserCard uid={17064371}/>
        <TestCard/>
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

    const messageShow = useSelector(state => state.show.message);
    const messageDelKey = useSelector(state => state.show.delMessageKey);
    const dispatch = useDispatch();

    const {message} = App.useApp();

    useEffect(() => {
        setTimeout(clickBoomEffect, 15);
        document.addEventListener("keydown", egg);

        /**
         *
         * @param {{
         *     key: string,
         *     type: 'success'|'error'|'warning'|'loading',
         *     content: ReactNode,
         *     duration: number,
         * }} value
         * @returns {any}
         */
        window.outMessage = value => dispatch(putMessage(value));
        window.outMessageCancel = key => dispatch(delMessage(key));
        window.outMessageClear = message.destroy;

        window.dispatch = dispatch;

        return () => {
            document.removeEventListener("keydown", egg);
            window.outMessage = void 0;
            window.outMessageCancel = void 0;
            window.outMessageClear = void 0;
            window.dispatch = void 0;
        }
    }, []);

    useEffect(() => {
        if (messageShow?.key) {
            const config = {
                ...messageShow
            };
            message.open(config);
            dispatch(popMessage());
        }
    }, [messageShow]);

    useEffect(() => {
        if (messageDelKey) {
            message.destroy(messageDelKey);
            dispatch(delMessageDone());
        }
    }, [messageDelKey]);

    return <ConfigProvider theme={themeConf}>
        <GlobTheme/>
    </ConfigProvider>
}

function GlobTheme() {
    const {token} = theme.useToken();

    useEffect(() => {
        const root = document.querySelector(':root');
        console.log(token)
        root.style.setProperty('--color-main', token.colorPrimary);
        root.style.setProperty('--color-main-link', token.colorLink);
        root.style.setProperty('--color-main-fill', token.colorFill);
        root.style.setProperty('--color-main-background', token.colorPrimaryBg);
        root.style.setProperty('--color-main-background-hover', token.colorPrimaryBgHover);
        root.style.setProperty('--color-main-border', token.colorPrimaryBorder);
        root.style.setProperty('--color-main-border-hover', token.colorPrimaryBorderHover);
    }, [token]);

    return <RouterProvider router={router}/>
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <App style={{height: '100%', overflow: "hidden"}}>
        <Provider store={store}>
            <Main/>
        </Provider>
    </App>
)
