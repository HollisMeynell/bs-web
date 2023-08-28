import {Buffer} from "buffer";
export async function saveFile(type, file) {
    let fileHandle;
    switch (type.toLowerCase()) {
        default:
        case "jpg":
        case "jpeg": {
            fileHandle = await showSaveFilePicker({
                suggestedName: "pinter.jpg",
                type: [{
                    description: "保存到jpg",
                    accept:{
                        'text/plain': ['.txt'],
                        "image/jpeg": [".jpg"],
                    }
                }]
            })
            break;
        }
        case "png": {
            fileHandle = await showSaveFilePicker({
                suggestedName: "pinter.png",
                type: [{
                    description: "保存到png",
                    accept:{
                        "image/png": [".png"],
                    }
                }]
            })
            break;
        }
        case "svg": {
            fileHandle = await showSaveFilePicker({
                suggestedName: "pinter.svg",
                type: [{
                    description: "保存到svg",
                    accept:{
                        "image/svg+xml": [".svg"],
                    }
                }]
            })
            break;
        }
    }
    const writable = await fileHandle.createWritable();
    if (typeof file === "string" && file.startsWith("data:")) {
        await writable.write(dataURLtoBlob(file));
    } else {
        await writable.write(file);
    }
    await writable.close();
}

export async function writeImageToClipboard(image) {
    if (typeof image === "string" && image.startsWith("data:")) {
        const img = await dataURLtoBlob(image);
        const items = {};
        items[img.type] = img
        let permission = await navigator.permissions.query({name:"clipboard-write"});
        if (permission.state === "granted") {
            const imgClipboard = new ClipboardItem(items);
            await navigator.clipboard.write([imgClipboard]);
        } else {
            throw new Error("can not support");
        }
    }
}

export function dataURLtoBlob (dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const b = Buffer.from(arr[1], 'base64');
    return new Blob([b], { type: mime });
}