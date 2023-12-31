export function hexColor2i32(s) {
    if (typeof s !== "string") {
        throw new Error("input type error");
    }
    if (s.startsWith("#")) s = s.substring(1);
    if (s.length === 3) {
        return 0xFF << 24
            | parseInt((s.charAt(0) + s.charAt(0)), 16) << 16
            | parseInt((s.charAt(1) + s.charAt(1)), 16) << 8
            | parseInt((s.charAt(2) + s.charAt(2)), 16);
    } else if (s.length === 6) {
        return 0xFF << 24
            | parseInt(s.substring(0, 2), 16) << 16
            | parseInt(s.substring(2, 4), 16) << 8
            | parseInt(s.substring(4, 6), 16);
    } else if (s.length >= 8) {
        return parseInt(s.substring(0, 2), 16) << 24
            | parseInt(s.substring(2, 4), 16) << 16
            | parseInt(s.substring(4, 6), 16) << 8
            | parseInt(s.substring(6, 8), 16);
    }

}

export function i32Color2Hex(i) {
    if (!Number.isSafeInteger(i)) {
        throw new Error("input type error");
    }
    if ((i & 0xFF000000) === 0xFF) {

        return `#${((i >> 16) & 0xFF).toString(16)}${((i >> 8) & 0xFF).toString(16)}${(i & 0xFF).toString(16)}`;
    } else {
        return `#${((i >> 24) & 0xFF).toString(16)}${((i >> 16) & 0xFF).toString(16)}${((i >> 8) & 0xFF).toString(16)}${(i & 0xFF).toString(16)}`;
    }
}