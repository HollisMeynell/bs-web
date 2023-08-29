
export async function sleep(time) {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}