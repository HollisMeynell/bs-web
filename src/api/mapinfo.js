import {HttpRequest} from "./util.js";


export async function getPublicPools() {
    // return {code:0, data:[{id:0, info:'', name:''}], message:''}
    return await HttpRequest.get("/api/public/getAllPool");
}

export async function getMarkPool() {
    return await HttpRequest.get("/api/map/getMark");
}

export async function getMapInfo(bid) {
    return await HttpRequest.get(`/api/map/getBeatMapInfo/${bid}`)
}

const CREATE_POOL = {
    name: "",
    banner: "",
    info: ""
}

export async function createPool(data = CREATE_POOL) {
    return await HttpRequest.put("/api/map/createPool", data);
}

export async function getPoolInfo(data = {poolId: 0}) {
    return await HttpRequest.get("/api/map/queryPublic", {
        params: data,
    });
}

export async function queryPoolInfo(data = {poolName: ""}) {
    return await HttpRequest.get("/api/map/queryPublic", {
        params: data,
    });
}

const CREATE_GROUP = {
    name: "",
    info: "",
    poolId: 0,
    color: 0,
}

export async function createCategoryGroup(data = CREATE_GROUP) {
    return await HttpRequest.put("/api/map/createCategoryGroup", data);
}