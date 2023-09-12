import {HttpRequest} from "./util.js";


async function getPublicPools() {
    // return {code:0, data:[{id:0, info:'', name:''}], message:''}
    return await HttpRequest.get("/api/public/getAllPool");
}

async function addMarkPool(poolId) {
    return await HttpRequest.put("/api/pool/mark", {poolId});
}

async function deleteMarkPool(poolId) {
    return await HttpRequest.delete("/api/pool/mark", {
        params: {poolId}
    });
}

async function getMarkPool() {
    return await HttpRequest.get("/api/pool/mark");
}

const CREATE_POOL = {
    name: "",
    banner: "",
    info: ""
}

async function createPool(data = CREATE_POOL) {
    return await HttpRequest.put("/api/pool/pool", data);
}

const UPDATE_POOL = {
    poolId:0,
    name: "",
    banner: "",
    info: ""
}
async function updatePool(data = UPDATE_POOL) {
    return await HttpRequest.patch("/api/pool/pool", data);
}
async function deletePool(poolId) {
    return await HttpRequest.delete("/api/pool/pool", {params: {poolId}})
}

async function getPoolInfo(data = {poolId: 0}) {
    return await HttpRequest.get("/api/pool/queryPublic", {
        params: data,
    });
}

async function queryPoolInfo(data = {poolName: ""}) {
    return await HttpRequest.get("/api/pool/queryPublic", {
        params: data,
    });
}

const CREATE_GROUP = {
    name: "",
    info: "",
    poolId: 0,
    color: 0,
}

const ADD_USER = {

}
async function addUser(data = ADD_USER){
    await HttpRequest.put("");
}

export const PoolApi = {
    getPublicPools,
    addMarkPool,
    getMarkPool,
    deleteMarkPool,
    getPoolInfo,
    queryPoolInfo,
    createPool,
    updatePool,
    deletePool,
}