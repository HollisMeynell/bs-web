
export async function sleep(time) {
    await new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}

export function timeBetween(time1, time2) {
    if (!time1 || !time1.getTime) {
        return "";
    }

    if (!time2 || !time2.getTime) {
        time2 = new Date();
    }

    let timeSecond = time2.getTime() - time1.getTime();
    timeSecond = Math.abs(timeSecond);
    timeSecond = Math.round(timeSecond / 1000);

    const t = [60, 60*60, 60*60*24, 60*60*24*30, 60*60*24*30*12];
    if (timeSecond >= t[4]) {
        return `${Math.floor(timeSecond / t[4])}年`;
    }
    if (timeSecond >= t[3]) {
        return `${Math.floor(timeSecond / t[3])}月`;
    }
    if (timeSecond >= t[2]) {
        return `${Math.floor(timeSecond / t[2])}天`;
    }
    if (timeSecond >= t[1]) {
        return `${Math.floor(timeSecond / t[1])}小时`;
    }
    if (timeSecond >= t[0]) {
        return `${Math.floor(timeSecond / t[0])}分钟`;
    }

    return `${timeSecond}秒`;
}