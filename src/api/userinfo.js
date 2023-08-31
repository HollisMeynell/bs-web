import {HttpRequest, setUser} from "./util.js";

export async function getOauthUrl() {
    const response = await HttpRequest.get("/api/public/getOauthUrl");
    if (response.code !== 200) {
        throw Error(response.message);
    }
    return response.message;
}

export async function doLogin(code) {
    const config = {
        timeout: 60 * 1000,
        params: {
            code: code,
        }
    }
    const response = await HttpRequest.get("/api/user/login", config);
    if (response.code !== 200) {
        throw Error(response.message);
    }
    setUser(response.data);
}

export async function getUserCard(uid) {
    return await HttpRequest.doProxy({
        method: "GET",
        url: `https://osu.ppy.sh/users/${uid}/card`,
    })
}

export async function getUserInfo(uid) {
    let bpList = await HttpRequest.doProxy({
        url: `https://osu.ppy.sh/users/${params.uid}/scores/best`,
        method: "GET",
        parameter: {
            mode: "osu",
            limit: 100,
            offset: 0
        }
    });
    //https://osu.ppy.sh/users/18443135/recent_activity?limit=51&offset=0 近期活动
    //https://osu.ppy.sh/users/17064371/scores/recent?mode=osu&limit=51&offset=0 24h打图
}