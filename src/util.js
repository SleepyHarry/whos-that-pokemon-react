// thx https://stackoverflow.com/a/6274381/5022115
export function shuffle(a) {
    let b = a.slice();
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [b[i - 1], b[j]] = [b[j], b[i - 1]];
    }
    return b;
}