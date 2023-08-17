const keyboardKey = {
    up: "ArrowUp",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    keyB: "b",
    keyA: "a",
}
const p = [
    keyboardKey.up,
    keyboardKey.up,
    keyboardKey.down,
    keyboardKey.down,
    keyboardKey.left,
    keyboardKey.right,
    keyboardKey.left,
    keyboardKey.right,
    keyboardKey.keyB,
    keyboardKey.keyA,
]

let nowIndex = 0;
export function egg(keyboardEvent) {
    const event = keyboardEvent;
    if (event.key === p[nowIndex]) {
        nowIndex ++;
        if (nowIndex >= p.length) {
            nowIndex = 0;
            doEgg();
        }
    } else {
        nowIndex = 0;
    }
}
function doEgg () {
    alert("偶吼吼~ 居然触发了彩蛋")
}