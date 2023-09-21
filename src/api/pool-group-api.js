import {HttpRequest} from "@/api/util.js";

const Group = {
    id: 0,
    name: '',
    info: '',
    color: 0,
    sort: 0
}

/**
 *
 * @param {number} id
 * @returns {Promise<Group>}
 */
async function getPoolAllGroups(id) {
    return await HttpRequest.get('/api/pool/categoryGroupByPool', {
        params:{id}
    });
}

/**
 *
 * @param {{
 *     name: string,
 *     info: string,
 *     poolId: number,
 *     color: number,
 * }} data
 * @returns {Promise<{}>}
 */
async function createGroup(data) {
    return await HttpRequest.put("/api/pool/categoryGroup", data);
}

/**
 *
 * @param {{
 *    poolId: number,
 *    groupId: number,
 *    name: string,
 *    info: string,
 *    color: number,
 *    sort: number,
 * }} data
 */
async function updateGroup(data) {
    return await HttpRequest.patch("/api/pool/categoryGroup", data);
}

async function deleteGroup(groupId) {
    return await HttpRequest.delete('/api/pool/categoryGroup', {
        params: {groupId}
    });
}

export const CategoryGroupApi = {
    getPoolAllGroups,
    createGroup,
    setGroup: updateGroup,
    deleteGroup
}