import {HttpRequest} from "@/api/util.js";

/**
 * @param {{id:number}} data
 * @returns {Promise<{}>}
 */
async function createCategory(data) {
    return await HttpRequest.put('/pool/category', data);
}

async function updateCategory(data) {
    return await HttpRequest.patch('/pool/category', data);
}

async function deleteCategory(categoryId) {
    return await HttpRequest.delete('/pool/category', {params: {categoryId}});
}
