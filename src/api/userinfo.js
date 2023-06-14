import {HttpRequest, setUser} from "./util.js";

export async function doLogin(code){
    const config = {
        timeout: 60 * 1000,
        params: {
            code: code,
        }
    }
    const response = await HttpRequest.get("/api/user/login", config);
    console.log(response)
    if (response.code !== 200) {
        throw Error(response.message);
    }
    setUser(response.data);
}