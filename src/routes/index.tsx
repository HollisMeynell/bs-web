import {
  createBrowserRouter,
  RouteObject,
  useLocation,
  Navigate,
  LoaderFunction,
} from "react-router-dom";
import { JSXElementConstructor } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/components/store/index";
import ErrorPage from "@/components/error";

// 页面组件导入
import Index from "@/page/index";
import Developer from "@/page/developer";
import Bind from "@/page/bind";
import UserInfo from "@/page/userInfo";
import Login from "@/page/login";
import Oauth from "@/page/oauth";
import Home from "@/page/home/index";
import Box from "@/page/home/child";
import Favorites from "@/page/home/favorites";
import PoolEdit from "@/page/home/poolEdit";
import MapPool from "@/page/home/mappool/index";
import MapPoolDetail from "@/page/home/mappool/pool-page";

// 类型定义
type ExtendedRouteObject = RouteObject & {
  requireAuth?: boolean;
};

interface AuthGuardProps {
  children: React.ReactNode;
}

interface RouteConfig {
  component: JSXElementConstructor<any>;
  requireAuth?: boolean;
  errorElement?: JSX.Element;
  loader?: LoaderFunction;
  children?: Array<{
    path: string;
    component: JSXElementConstructor<any>;
    loader?: LoaderFunction;
  }>;
}

// AuthGuard 组件
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const authState = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  const isAuthenticated = authState?.isAuthenticated ?? false;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// 路由配置
export const routes: Record<string, RouteConfig> = {
  "/": {
    component: Index,
    requireAuth: false,
    errorElement: <ErrorPage />,
  },
  "/home": {
    component: Home,
    requireAuth: false,
    children: [
      // 显式声明子路由关系
      {
        path: "mappool",
        component: MapPool,
      },
      {
        path: "mappool/:pid",
        component: MapPoolDetail,
      },
      {
        path: "favorites",
        component: Favorites,
      },
      {
        path: "manage",
        component: PoolEdit,
      },
      {
        path: ":route",
        component: Box,
      },
    ],
  },
  "/dev": {
    component: Developer,
    requireAuth: false,
  },
  "/bind": {
    component: Bind,
    requireAuth: false,
  },
  "/userInfo/:uid": {
    component: UserInfo,
    requireAuth: false,
    // loader: userInfoLoader,
  },
  "/login": {
    component: Login,
    requireAuth: false,
  },
  "/oauth": {
    component: Oauth,
    requireAuth: false,
  },
};

// 嵌套的路由结构
const transformToNestedRoutes = () => {
  return Object.entries(routes).map(([path, config]) => {
    const routeObject: ExtendedRouteObject = {
      path: path === "/" ? path : path.substring(1),
      element: <config.component />,
      errorElement: config.errorElement || <ErrorPage />,
      loader: config.loader,
      requireAuth: config.requireAuth,
    };

    // 处理子路由
    if ("children" in config && config.children) {
      routeObject.children = config.children.map((child) => ({
        path: child.path,
        element: <child.component />,
        loader: child.loader,
        requireAuth: config.requireAuth, // 继承父路由的权限设置
      }));
    }

    return routeObject;
  });
};

// 路由增强函数
const enhanceRoute = (route: ExtendedRouteObject): RouteObject => {
  if (route.requireAuth) {
    const OriginalComponent = route.element;
    route.element = <AuthGuard>{OriginalComponent}</AuthGuard>;
  }

  if (route.children) {
    route.children = route.children.map(enhanceRoute);
  }

  return route;
};

// 创建最终路由配置
export const router = createBrowserRouter(
  transformToNestedRoutes().map(enhanceRoute),
  {
    basename: import.meta.env.BASE_URL || "",
  }
);
