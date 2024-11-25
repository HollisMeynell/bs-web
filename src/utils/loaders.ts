import { LoaderFunction } from "react-router-dom";
import { putAllPools } from "@/components/store/pool.js";
import { PoolApi } from "@/api/pool-api.js";
import { HttpRequest, getUser } from "@/api/util.js";
import { CategoryGroupApi } from "@/api/pool-group-api.js";

// 类型定义
interface UserScore {
  // 定义你的得分类型
}

interface Pool {
  id: string;
  users: Array<{
    userId: string;
    permission: string;
  }>;
  // ... 其他池子属性
}

interface MarkPool {
  id: string;
  // ... 其他标记属性
}

interface LoaderResponse<T> {
  data: T;
  error: string | null;
}

// 工具函数
const handleApiError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
};

export const userInfoLoader: LoaderFunction = async ({
  params,
}): Promise<LoaderResponse<UserScore[]>> => {
  try {
    const req = await HttpRequest.doProxy({
      url: `https://osu.ppy.sh/users/${params.uid}/scores/best`,
      method: "GET",
      parameter: {
        mode: "osu",
        limit: 100,
        offset: 0,
      },
    });

    return {
      data: [...req],
      error: null,
    };
  } catch (error) {
    return {
      data: [],
      error: handleApiError(error),
    };
  }
};

async function poolEditLoader({ params }) {
  let req = await PoolApi.queryPoolInfo({ poolName: "" });
  const mark = await PoolApi.getMarkPool();
  const user = getUser();
  const markData = {};
  for (const m of mark.data) {
    markData[m.id] = m;
  }
  for (const pool of req.data) {
    pool.permission = pool.users.find((value) => {
      if (value.userId === user.uid) return true;
    }).permission;
    pool.isMark = markData[pool.id] !== void 0;
  }
  dispatch(putAllPools(req.data));
  return {
    listData: [...req.data],
  };
}

async function homeLoader() {
  const markData = await PoolApi.getMarkPool();
  setTimeout(() => dispatch(putAllPools(markData.data)), 5);
  return {
    marks: markData.data,
  };
}

async function poolPageLoader({ params }) {
  const pid = params.pid;
  let groups;
  const rep = await CategoryGroupApi.getPoolAllGroups(pid);
  return { groups };
}
