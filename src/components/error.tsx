import { useNavigate, useRouteError } from "react-router-dom";
import { Button, Result, Space } from "antd";
import { useEffect, useRef, useMemo } from "react";
import TypeIt from "typeit";
import {
  handleRouteError,
  ErrorType,
  ERROR_STYLES,
  TYPE_IT_CONFIG,
} from "@/utils/errorHandling";

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  const infoRef = useRef<HTMLSpanElement>(null);
  const typeItInstance = useRef<any>(null);

  // 处理错误
  const errorDetails = useMemo(() => handleRouteError(error), [error]);

  // 自动执行错误处理动作
  useEffect(() => {
    if (errorDetails.action) {
      errorDetails.action();
    }
  }, [errorDetails]);

  // 处理打字效果
  useEffect(() => {
    const initTypeIt = () => {
      if (!infoRef.current) {
        setTimeout(initTypeIt, 50);
        return;
      }

      typeItInstance.current = new TypeIt(infoRef.current, TYPE_IT_CONFIG)
        .type(errorDetails.message)
        .go();
    };

    initTypeIt();

    return () => {
      if (typeItInstance.current) {
        typeItInstance.current.destroy();
      }
    };
  }, [errorDetails.message]);

  // 如果是认证错误，直接返回 null
  if (errorDetails.type === ErrorType.AUTHENTICATION) {
    return null;
  }

  // 导航处理函数
  const navigationHandlers = {
    toHome: () => navigate("/"),
    toBack: () => window.history.back(),
    retry: () => window.location.reload(),
  };

  return (
    <div style={ERROR_STYLES.container}>
      <Result
        status="error"
        title={<span style={ERROR_STYLES.title}>出错了!</span>}
        subTitle={<span style={ERROR_STYLES.subTitle} ref={infoRef} />}
        extra={
          <Space size="middle" style={ERROR_STYLES.buttonSpace}>
            <Button type="primary" onClick={navigationHandlers.toHome}>
              主页
            </Button>
            <Button type="primary" onClick={navigationHandlers.toBack}>
              返回
            </Button>
            {errorDetails.type === ErrorType.NETWORK && (
              <Button type="primary" onClick={navigationHandlers.retry}>
                重试
              </Button>
            )}
          </Space>
        }
      />
    </div>
  );
}
