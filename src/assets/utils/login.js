import {getOauthUrl} from "@/api/userinfo.js";

export async function doOauth() {
    const link = document.createElement("a");
    link.href = await getOauthUrl();
    link.click();
}