import {HttpRequest} from "./util.js";

export async function getMapInfo(bid) {
    return await HttpRequest.get(`/api/pool/getBeatMapInfo/${bid}`)
}