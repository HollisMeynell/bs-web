import axios from "axios";

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
    baseURL: 'http://localhost:8080',
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
    const {config} = error;
    if (error.code === 'ECONNABORTED' && config.timeout <= TimeoutMax) {
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

export async function sleep(time) {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}

export function getFlagUrlFromCountryCode(code) {
    if (code.length < 2) throw Error("code length err");
    code = code.toUpperCase();
    const startNum = 0x1f1e6;
    const Acode = 65;
    const i1 = code.charCodeAt(0) - Acode + startNum;
    const i2 = code.charCodeAt(1) - Acode + startNum;
    return `https://osu.ppy.sh/assets/images/flags/${i1.toString(16)}-${i2.toString(16)}.svg`;
}

export async function uploadImage(file, name) {
    const res = await HttpRequest.post("/api/file/stream/" + name, file, {headers: {"Content-Type": "application/octet-stream"}});
    if (res.code === 200) {
        return {
            fileKey: res.data
        }
    } else throw new Error(res.message)
}

export async function uploadAllImage(files) {
    const res = await HttpRequest.post("/api/file/upload", files);
    if (res.code === 200) {
        return res.data
    } else throw new Error(res.message)
}