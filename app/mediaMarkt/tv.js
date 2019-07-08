const cheerio = require('cheerio');
let rp = require('request-promise');
const DeviceListUrlScrapper = require('../app').DeviceListUrlScrapper

const data = [];
let energyClass = '',
    powerConsumption = '',
    powerConsumptionStandby = '',
    annualEnergyConsumption = '',
    powerType;

//const url = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory?limit=100&page=';
const url = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory';

const tvNameAndAddress = [];
let name, address, pageNumber = 1;

const request = new DeviceListUrlScrapper(url);

request.getNameAndAddresses()
    .then(result => {
        //console.log("result >>> ", result);
        getPowerInformation(result)
    })

// const getNameAndAddressesTv = () => {
//     rp(url + pageNumber)
//         .then((html) => {
//             console.time("timer")
//             parseResponseHtmlNameAddress(html)
//         })
//         .catch((error) => {
//             throw error
//         })
// }
// getNameAndAddressesTv();

// const parseResponseHtmlNameAddress = (html) => {
//     const $ = cheerio.load(html);

//     let attrProductName = $("a.js-product-name")
//     let page = $("a.m-pagination_item.m-pagination_next")

//     for (let i = 0; i < attrProductName.length - 1; i++) {

//         let productName = attrProductName[i].attribs;
//         if (attrProductName[i].attribs.href !== attrProductName[i + 1].attribs.href) {
//             name = productName.title;
//             address = 'https://mediamarkt.pl' + productName.href
//             tvNameAndAddress.push({ i, name, address })

//         } else {
//             productName = attrProductName[i + 1].attribs
//         }
//     }
//     // if (pageNumber <= page.length) {
//     //     pageNumber++
//     //     getNameAndAddressesTv()
//     //     //getPowerInformation(tvNameAndAddress)
//     // }
//     getPowerInformation(tvNameAndAddress)
//     console.log(tvNameAndAddress)
// }

let addresses = []
let iter = 1
const getPowerInformation = (tvNameAddress) => {

    tvNameAddress.forEach((address) => {
        addresses.push(address.address)
    })
    //console.log("addresses:", addresses)
    let promises = addresses.map(url => {
        //console.log(">>> url", url)
        return new Promise((resolve, reject) => {
            rp(url)
                .then((response) => {
                    resolve(response)
                    console.log(iter)
                    iter++
                })
                .catch((err) => {
                    reject(err)
                })
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
}

let id = 1;
const parseResponseHtml = (html) => {
    try {
        let len = (html.length) / 2

        for (let i = len; i < html.length; i++) {
            const $ = cheerio.load(html[i])
            //console.log(html)
            let div = $('div.m-offerShowData')
            let attrProductName = $("h1.m-typo.m-typo_primary").text().trim()
            //console.log("div >>>", div)
            const powerNode = div[0].childNodes[13];
            //console.log("powerNode >>>", powerNode)

            powerNode.children.forEach((item, k) => {
                if (item.type !== "text") {

                    let dt = $(item).find("dt").text().trim()
                    if (dt === 'Klasa energetyczna') energyClass = $(item).find("dd").text().trim()
                    if (dt === 'Pobór mocy (IEC 62087 Edition 2) [W]') powerConsumption = Number($(item).find("dd").text().trim())
                    if (dt === 'Pobór mocy w trybie czuwania [W]') powerConsumptionStandby = Number($(item).find("dd").text().trim())
                    if (dt === 'Roczne zużycie energii [kWh]') annualEnergyConsumption = Number($(item).find("dd").text().trim())
                    if (dt === 'Rodzaj zasilania') powerType = $(item).find("dd").text().trim()
                }
            })

            data.push({
                id,
                tvName: attrProductName,
                energyClass,
                powerConsumption,
                powerConsumptionStandby,
                annualEnergyConsumption,
                powerType
            })
            id++
        }
    } catch (error) {
        throw error
    }
    console.log(">>> data", data)
}