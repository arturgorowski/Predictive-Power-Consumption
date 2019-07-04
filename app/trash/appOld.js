const tvListUrl = require('./tvListUrl2');
const cheerio = require('cheerio');
const request = require('request');

const data = [];
let energyClass = '',
    powerConsumption = '',
    powerConsumptionStandby = '',
    annualEnergyConsumption = '',
    powerType;

function parseResponseHtml(html) {
    try {
        let len = (html.length) / 2
        for (let i = len; i < html.length - 1; i++) {
            const $ = cheerio.load(html[i])
            //console.log(html)
            let div = $('div.m-offerShowData')
            //console.log("div >>>", div)
            const powerNode = div[0].childNodes[13];
            //console.log("powerNode >>>", powerNode)

            powerNode.children.forEach((item, k) => {
                if (item.type !== "text") {

                    if (k === 3) energyClass = $(item).find("dd").text().trim()
                    if (k === 5) powerConsumption = Number($(item).find("dd").text().trim())
                    if (k === 7) powerConsumptionStandby = Number($(item).find("dd").text().trim())
                    if (k === 9) annualEnergyConsumption = Number($(item).find("dd").text().trim());
                    if (k === 11) powerType = $(item).find("dd").text().trim();
                }
            })

            data.push({
                energyClass,
                powerConsumption,
                powerConsumptionStandby,
                annualEnergyConsumption,
                powerType
            })
        }
    } catch (error) {
        throw error
    }
    console.log(">>> data", data)
}

let promises = tvListUrl[0].map(url => {
    console.log(">>> url", url)
    return new Promise((resolve, reject) => {
        request(url, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                //console.log(">>> body", html)    
                resolve(html);
            } else {
                reject(error);
            }
        });
    });
})
//console.log(promises)
promises.reduce((promiseChain, currentTask) => {
    return promiseChain
        .then(chainResults => currentTask
            .then(currentResult => chainResults = chainResults
                .concat(currentResult)
            )
        );
}, Promise.resolve(promises))
    .then(htmlBody => {
        //console.log(">>> htmlBody", htmlBody);
        parseResponseHtml(htmlBody)
        //return htmlBody;
    }).then(model => {
        //console.log(">>> model ", model);
        return model;
    }).catch(err => {
        console.error(">>> ERR :: ", err);
        return err;
    });