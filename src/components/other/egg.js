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
    if (keyboardEvent.key === p[nowIndex]) {
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
    if (typeof window.egg === 'function') {
        window.egg();
    }

    const audio = document.createElement('audio');
    audio.src = "/api/file/static/boom.wav";
    audio.play();
}