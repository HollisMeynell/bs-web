import {HttpRequest} from "./util.js";


async function getPublicPools() {
    // return {code:0, data:[{id:0, info:'', name:''}], message:''}
    return await HttpRequest.get("/api/public/getAllPool");
}

/**
 * 增加 mark pool (右侧下拉栏)
 * @param {number} poolId
 * @returns {Promise<{
 *     id:{number},
 *
 * }>}
 */
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

/**
 *
 * @param {{
 *     name: string,
 *     banner: string,
 *     info: string
 * }} data
 * @returns {Promise<{
 *     id: number,
 *     banner: string,
 *     info: string,
 *     status: "SHOW"|"OPEN"|"STOP"|"DELETE",
 * }>}
 */
async function createPool(data = CREATE_POOL) {
    return await HttpRequest.put("/api/pool/pool", data);
}

const UPDATE_POOL = {
    poolId: 0,
    name: "",
    banner: "",
    info: ""
}

/**
 *
 * @param {{
 *     poolId: number,
 *     name: string,
 *     banner: string,
 *     info: string,
 * }} data
 * @returns {Promise<any>}
 */
async function updatePool(data ) {
    return await HttpRequest.patch("/api/pool/pool", data);
}

async function deletePool(poolId) {
    return await HttpRequest.delete("/api/pool/pool", {params: {poolId}})
}

/***
 *
 * @param {{poolId: number}} data
 * @returns {Promise<>}
 */
async function getPoolInfo(data) {
    return await HttpRequest.get("/api/pool/queryPublic", {
        params: data,
    });
}

/**
 *
 * @param {{poolName: string}} data
 * @returns {Promise<>}
 */
async function queryPoolInfo(data) {
    return await HttpRequest.get("/api/pool/queryPublic", {
        params: data,
    });
}

/**
 *
 * @param {{
 *
 * }} data
 * @returns {Promise<void>}
 */
async function addUser(data) {
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