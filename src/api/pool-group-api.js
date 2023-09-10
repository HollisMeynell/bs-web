import {HttpRequest} from "@/api/util.js";

async function createGroup(data) {
    return await HttpRequest.put("/api/pool/", data);
}

export const CategoryGroupApi = {
    createGroup,
}