import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { App, ConfigProvider, theme } from "antd";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "@/style/main.css";
import store from "@/components/store.js";
import { router } from "@/routes/index";
import OsuUserCard from "@/components/card/osu-user-card.jsx";
import clickBoomEffect from "@/components/other/boom.js";
import { egg } from "@/components/other/egg.js";
import ErrorPage from "@/components/error";
import {
  delMessage,
  delMessageDone,
  popMessage,
  putMessage,
} from "@/components/store/show.js";
import { putAllPools, putPool } from "@/components/store/pool.js";

const test = {
  path: "/test",
  element: (
    <>
      <OsuUserCard uid={8664140} />
      <OsuUserCard uid={17064371} />
    </>
  ),
  errorElement: <ErrorPage />,
};

function Main() {
  const themeConf = {
    ...useSelector((state) => state.theme.value),
  };
  if (themeConf.dark) {
    themeConf.algorithm = theme.darkAlgorithm;
  }

  const messageShow = useSelector((state) => state.show.message);
  const messageDelKey = useSelector((state) => state.show.delMessageKey);
  const dispatch = useDispatch();

  const { message } = App.useApp();

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
    window.outMessage = (value) => dispatch(putMessage(value));
    window.outMessageCancel = (key) => dispatch(delMessage(key));
    window.outMessageClear = message.destroy;

    window.dispatch = dispatch;

    return () => {
      document.removeEventListener("keydown", egg);
      window.outMessage = void 0;
      window.outMessageCancel = void 0;
      window.outMessageClear = void 0;
      window.dispatch = void 0;
    };
  }, []);

  useEffect(() => {
    if (messageShow?.key) {
      const config = {
        ...messageShow,
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

  return (
    <ConfigProvider theme={themeConf}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <App style={{ height: "100%", overflow: "hidden" }}>
    <Provider store={store}>
      <Main />
    </Provider>
  </App>
);
