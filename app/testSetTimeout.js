const tab = [1,2,3,4,5,6,7,8,9,10]

console.log("działa")

setInterval(function() {
    tab.forEach(element => {
        console.log(element)
    });
}, 3 * 1000); //odpali po 3s