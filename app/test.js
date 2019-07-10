let tab = [[], [1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3, 3]]

let euroRtvAgd = tab.pop()
let mediaExpert = tab.pop()
let mediaMarkt = tab.pop()
let popped4 = tab.pop()

console.log("tab >>>", tab)
console.log("1 >>>", euroRtvAgd)
console.log("2 >>>", mediaExpert)
console.log("3 >>>", mediaMarkt)

for (let i = 0; i < euroRtvAgd.length; i++) {
    if (mediaMarkt[i] !== undefined) tab.push(mediaMarkt[i])
    if (mediaExpert[i] !== undefined) tab.push(mediaExpert[i])
    if (euroRtvAgd[i] !== undefined) tab.push(euroRtvAgd[i])
}

console.log("tab >>>>", tab)