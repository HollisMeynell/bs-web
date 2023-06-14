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

export function getUser(){
    const uStr = window.localStorage.getItem("USER_INFO");
    return uStr && JSON.stringify(uStr);
}

export const HttpRequest = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 15,
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