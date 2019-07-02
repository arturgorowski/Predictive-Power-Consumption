//var tvListUrl = require('./temp');
var tvListUrl = require('./temp2');
var cheerio = require('cheerio');
var RateLimiter = require('request-rate-limiter');
const fetch = require('node-fetch');
const axios = require('axios');
const request = require('request');

var limiter = new RateLimiter(120);
const mediaMarktUrl = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory'
const mediaMarktTv = 'https://mediamarkt.pl/rtv-i-telewizory/telewizor-qled-samsung-qe55q60rat'
const data = [];

let energyClass = '',
    powerConsumption = '',
    powerConsumptionStandby = '',
    annualEnergyConsumption = '',
    powerType;

function parseResponseHtml(html, i) {
    try {
        const $ = cheerio.load(html[i])
        console.log(html)
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
    } catch (error) {
        throw error
    }
    console.log(">>> data", data)
}

let promises = tvListUrl[0].map(url => {
    console.log(">>> url", url)
    //for (let i = 0; i < url.length; i++) {
        //console.log(url[i])
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
    //}

})
console.log(promises)
let iterator = 4
promises.reduce((promiseChain, currentTask) => {
    return promiseChain
        .then(chainResults => currentTask
            .then(currentResult => chainResults = chainResults
                .concat(currentResult)
            )
        );
}, Promise.resolve(promises))
    .then(htmlBody => {
        //console.log(">>> htmlBody", htmlBody[1]);
        iterator +=1
        parseResponseHtml(htmlBody, iterator)
        //return htmlBody;
    }).then(model => {
        //console.log(">>> model ", model);
        return model;
    }).catch(err => {
        console.error(">>> ERR :: ", err);
        return err;
    });

// Promise.all(promises)
//     .then(html => {
//         console.log(html)
//         const $ = cheerio.load(html)
//         let div = $('div.m-offerShowData')
//         const powerNode = div[0].childNodes[13];

//         powerNode.children.forEach((item, k) => {
//             if (item.type !== "text") {

//                 if (k === 3) energyClass = $(item).find("dd").text().trim()
//                 if (k === 5) powerConsumption = Number($(item).find("dd").text().trim())
//                 if (k === 7) powerConsumptionStandby = Number($(item).find("dd").text().trim())
//                 if (k === 9) annualEnergyConsumption = Number($(item).find("dd").text().trim());
//                 if (k === 11) powerType = $(item).find("dd").text().trim();
//             }
//         })
//         data.push({
//             energyClass,
//             powerConsumption,
//             powerConsumptionStandby,
//             annualEnergyConsumption,
//             powerType
//         })
//         console.log(data)
//     })
//     .catch(error => {
//         throw error
//     })