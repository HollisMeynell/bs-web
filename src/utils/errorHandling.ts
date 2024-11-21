import { CSSProperties } from "react";

// 错误类型定义
export enum ErrorType {
  AUTHENTICATION = "AUTHENTICATION",
  NETWORK = "NETWORK",
  NOT_FOUND = "NOT_FOUND",
  UNKNOWN = "UNKNOWN",
}

// 错误详情接口
export interface ErrorDetails {
  type: ErrorType;
  message: string;
  action?: () => void;
}

// 错误样式
export const ERROR_STYLES = {
  container: {
    width: "100%",
    height: "100%",
    background: "hsl(255, 10%, 20%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as CSSProperties,
  title: {
    color: "white",
  } as CSSProperties,
  subTitle: {
    color: "white",
  } as CSSProperties,
  buttonSpace: {
    marginTop: 16,
  } as CSSProperties,
};

// TypeIt 配置
export const TYPE_IT_CONFIG = {
  speed: 40,
  cursorChar: "",
} as const;

// 错误信息配置
export const ERROR_MESSAGES = {
  [ErrorType.AUTHENTICATION]: "需要登录",
  [ErrorType.NETWORK]: "网络错误",
  [ErrorType.NOT_FOUND]: "页面不存在",
  [ErrorType.UNKNOWN]: "未知错误",
} as const;

// 保存错误前路径
export function setBefErrPath(path: string) {
  sessionStorage.setItem("beforeErrorPath", path);
}

// 错误处理函数
export function handleRouteError(error: any): ErrorDetails {
  // 认证错误
  if (error?.name === "AxiosError" && error.response?.data.code === 401) {
    return {
      type: ErrorType.AUTHENTICATION,
      message: ERROR_MESSAGES[ErrorType.AUTHENTICATION],
      action: () => {
        setBefErrPath(window.location.pathname);
        window.location.replace("/login");
      },
    };
  }

  // 网络错误
  if (error?.name === "AxiosError" && !error.response) {
    return {
      type: ErrorType.NETWORK,
      message: ERROR_MESSAGES[ErrorType.NETWORK],
    };
  }

  // 404错误
  if (error?.status === 404) {
    return {
      type: ErrorType.NOT_FOUND,
      message: ERROR_MESSAGES[ErrorType.NOT_FOUND],
    };
  }

  // 未知错误
  return {
    type: ErrorType.UNKNOWN,
    message: error?.message || ERROR_MESSAGES[ErrorType.UNKNOWN],
  };
}
