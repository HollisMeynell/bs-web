import axios from "axios";

const TimeoutMax = 30000
const TimeoutStep = 2000
const RetryDelay = 1000;
export const HttpRequest = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 15,
});
HttpRequest.interceptors.request.use((config) => {
    let token = window.localStorage.getItem("USER_TOKEN")
    if (token) {
        config.headers.set("Authorization", "Bearer " + token, true);
    }
    return config;
})
HttpRequest.interceptors.response.use((rep) => {
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