let tab = [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3, 3, 3, 3, 3, 3]]

let pop1 = tab.pop()
let pop2 = tab.pop()
let pop3 = tab.pop()

console.log("tab >>>", tab)
console.log("1 >>>", pop1)
console.log("2 >>>", pop2)
console.log("3 >>>", pop3)

for (let i = 0; i < pop2.length; i++) {
    if (pop1[i] !== undefined) tab.push(pop1[i])
    if (pop2[i] !== undefined) tab.push(pop2[i])
    if (pop3[i] !== undefined) tab.push(pop3[i])
}

console.log("tab >>>>", tab)