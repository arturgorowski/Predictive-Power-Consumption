var tvList = require('./temp');
var request = require('request');
var cheerio = require('cheerio');
var RateLimiter = require('request-rate-limiter');

var limiter = new RateLimiter(120);
const mediaMarktUrl = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory'
const mediaMarktTv = 'https://mediamarkt.pl/rtv-i-telewizory/telewizor-qled-samsung-qe55q60rat'
const data = [];

let energyClass = '',
    powerConsumption = '',
    powerConsumptionStandby = '',
    annualEnergyConsumption = '',
    powerType;

tvList.forEach((url, k) => {
    const firstUrl = url[0]

    console.log(firstUrl)
    request(firstUrl, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            try {
                const $ = cheerio.load(html)

                let div = $('div.m-offerShowData')
                const powerNode = div[0].childNodes[13];

                powerNode.children.forEach((item, k) => {
                    if (item.type !== "text") {

                        if (k === 3) energyClass = $(item).find("dd").text().trim()
                        if (k === 5) powerConsumption = Number($(item).find("dd").text().trim())
                        if (k === 7) powerConsumptionStandby = Number($(item).find("dd").text().trim())
                        if (k === 9) annualEnergyConsumption = Number($(item).find("dd").text().trim());
                        if (k === 11) powerType = $(item).find("dd").text().trim();

                        let dt = $(item).find("dt").text().trim()
                        let dd = $(item).find("dd").text().trim()
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
        }
    })
    console.log(data)
})

// limiter.request(mediaMarktTv, function (error, response, html) {
//     if (!error && response.statusCode == 200) {
//         try {
//             const $ = cheerio.load(html)

//             let div = $('div.m-offerShowData')
//             const powerNode = div[0].childNodes[13];

//             powerNode.children.forEach((item, k) => {
//                 if (item.type !== "text") {

//                     if (k === 3) energyClass = $(item).find("dd").text().trim()
//                     if (k === 5) powerConsumption = Number($(item).find("dd").text().trim())
//                     if (k === 7) powerConsumptionStandby = Number($(item).find("dd").text().trim())
//                     if (k === 9) annualEnergyConsumption = Number($(item).find("dd").text().trim());
//                     if (k === 11) powerType = $(item).find("dd").text().trim();

//                     let dt = $(item).find("dt").text().trim()
//                     let dd = $(item).find("dd").text().trim()
//                 }
//             })

//             data.push({
//                 energyClass,
//                 powerConsumption,
//                 powerConsumptionStandby,
//                 annualEnergyConsumption,
//                 powerType
//             })

//             console.log(data)

//         } catch (error) {
//             throw error
//         }
//     }
// });