import {HttpRequest} from "./util.js";

export async function doLogin(code){
    const config = {
        timeout: 60 * 1000,
        params: {
            code: code,
        }
    }
    try {
        const response = await HttpRequest.get("/api/user/login", config);
        console.log(response.data)
        if (response.data.code !== 200) {
            window.log.error(response.data.message);
        }
        const token = response.data.message;

        window.localStorage.setItem("USER_TOKEN", token);
    } catch (e) {
        window.log.error(e.message);
        return ""
    }

}