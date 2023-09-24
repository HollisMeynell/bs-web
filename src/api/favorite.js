import {HttpRequest} from "./util.js";

const favorite = {
    id: 0, userId: 0, bid: 0, info: '', create: '2023-09-24T20:24:49.330535', tags: ['']
}

/**
 * @returns {{data: [favorite]}}
 */
async function getAllFavorites() {
    return await HttpRequest.get('/api/favorite');
}

/**
 * @param {{tags:[number]}}data
 * @returns {{data: [favorite]}}
 */
async function getByTags(data) {
    return await HttpRequest.get('/api/favorite/byTags', {params: data});
}

/**
 * @returns {{data: [string]}}
 */
async function getAllTags() {
    return await HttpRequest.get('/api/favorite/allTags');
}

/**
 * @param {{bid:number, info:string, tags:[string]?}} data
 * @returns {{data: favorite}}
 */
async function createFavorite(data) {
    return await HttpRequest.put('/api/favorite', data);
}

/**
 * @param {id:number} data
 * @returns {{message:string}}
 */
async function deleteFavorite(data) {
    return await HttpRequest.delete('/api/favorite', {params: data});
}

/**
 * @param {{id:number, info:string, tags:[string]?}} data
 * @returns {{data:favorite}}
 */
async function updateFavorite(data) {
    return await HttpRequest.patch('/api/favorite', data);
}

/**
 * @param {{id: number, tag:string}}data
 * @returns {{data:favorite}}
 */
async function addTag(data) {
    return await HttpRequest.put('/api/favorite/tag', data);
}

/**
 * @param {{id: number, tags:[string, string]}} data tags: [old, new]
 * @returns {{data:favorite}}
 */
async function setTag(data) {
    return await HttpRequest.patch('/api/favorite/tag', data);
}

/**
 * @param {{id: number, tag:string}}data
 * @returns {{data:favorite}}
 */
async function deleteTag(data) {
    return await HttpRequest.delete('/api/favorite/tag', {params: data});
}

export const FavoriteApi = {
    getAllFavorites,
    createFavorite,
    updateFavorite,
    deleteFavorite,
    getByTags,
    getAllTags,
    addTag,
    setTag,
    deleteTag,
}