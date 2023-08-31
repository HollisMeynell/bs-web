import {getOauthUrl} from "@/api/userinfo.js";

export async function doLogin() {
    const link = document.createElement("a");
    link.href = await getOauthUrl();
    link.click();
}