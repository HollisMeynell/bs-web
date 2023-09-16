import {HttpRequest} from "@/api/util.js";

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
    return await HttpRequest.put("/api/pool/", data);
}

export const CategoryGroupApi = {
    createGroup,
}