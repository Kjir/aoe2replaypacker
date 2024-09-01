
export function toBase26(value: number, width: number) {
    const res = []
    value = Math.floor(value)
    do {
        const digit = value % 26
        value = Math.floor(value / 26)
        res.push(String.fromCharCode(0x61 + digit))
    } while (value > 0)
    return res.reverse().join('').padStart(width, 'a')
}

export function logn(x: number, y: number) {
    return Math.log(x) / Math.log(y);
}
