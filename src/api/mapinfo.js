import {HttpRequest} from "./util.js";


export async function getPublicPools() {
    // return {code:0, data:[{id:0, info:'', name:''}], message:''}
    return await HttpRequest.get("/api/public/getAllPool");
}

export async function getMarkPool() {
    return await HttpRequest.get("/api/map/getMark");
}