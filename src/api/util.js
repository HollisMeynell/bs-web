import axios from "axios";
import {setBefErrPath, sleep} from "@/utils/util.js";

const TimeoutMax = 30000
const TimeoutStep = 2000
const RetryDelay = 1000;

export function setUser(user) {
    window.localStorage.setItem("USER_TOKEN", user.token);
    const uData = {
        uid: user.uid,
        name: user.name,
    }
    window.localStorage.setItem("USER_INFO", JSON.stringify(uData));
}

export function removeUserToken() {
    window.localStorage.removeItem("USER_TOKEN");
    window.localStorage.removeItem("USER_INFO");
}

export function getUser() {
    const uStr = window.localStorage.getItem("USER_INFO");
    if (!uStr) {
        return {
            uid: 0,
            name: "unknown"
        }
    }
    const u = JSON.parse(uStr);
    return {
        ...u,
        avatar: `https://a.ppy.sh/${u.uid}`
    };
}

export const HttpRequest = axios.create({
    timeout: 3000,
});
HttpRequest.interceptors.request.use((config) => {
    let token = window.localStorage.getItem("USER_TOKEN")
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: 'Bearer ' + token,
        };
    }
    return config;
})
HttpRequest.interceptors.response.use((rep) => {
    return rep.data
}, (error) => {
    const {config, response, request} = error;

    if (error.code === 'ECONNABORTED' && config.timeout <= TimeoutMax) { // 超时处理
        config.timeout += TimeoutStep;
        const backoff = new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, RetryDelay || 1);
        });
        return backoff.then(() => {
            return axios(config);
        })
    }
    if (response.status === 401 && response.statusText === "Unauthorized") {
        setBefErrPath( window.location.pathname);
        window.location.replace("/login");
    }

    return Promise.reject(error);
})
const config = {
    method: "GET" | "POST",
    url: "",
    headers: {},
    body: {},
    parameter: {}
}
HttpRequest.doProxy = function (config = config) {
    return this.post("/api/public/proxy", config);
};

export function getFlagUrlFromCountryCode(code) {
    if (code.length < 2) throw Error("code length err");
    code = code.toUpperCase();
    const startNum = 0x1f1e6;
    const Acode = 65;
    const i1 = code.charCodeAt(0) - Acode + startNum;
    const i2 = code.charCodeAt(1) - Acode + startNum;
    return `https://osu.ppy.sh/assets/images/flags/${i1.toString(16)}-${i2.toString(16)}.svg`;
}

/**
 *
 * @param {Blob} file
 * @param {string} name
 * @returns {Promise<{fileKey: string}>}
 */
export async function uploadImage(file, name) {
    const res = await HttpRequest.post("/api/file/stream/" + name, file, {headers: {"Content-Type": "application/octet-stream"}});
    if (res.code === 200) {
        return {
            fileKey: res.data
        }
    } else throw new Error(res.message)
}

/**
 *
 * @param {[Blob]} files
 * @returns {Promise<{}>}
 */
export async function uploadAllImage(files) {
    const res = await HttpRequest.post("/api/file/upload", files);
    if (res.code === 200) {
        return res.data
    } else throw new Error(res.message)
}

/**
 *
 * @param {string} key
 * @returns {string}
 */
export function getImageUrl(key) {
    return `/api/file/image/${key}`
}