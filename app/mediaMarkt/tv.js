const tvListUrl = require('../trash/tvListUrl2');
const cheerio = require('cheerio');
const request = require('request');
var rp = require('request-promise');

const data = [];
let energyClass = '',
    powerConsumption = '',
    powerConsumptionStandby = '',
    annualEnergyConsumption = '',
    powerType;

const url = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory';
const tvNameAndAddress = [];
let name, address, pageNumber = 1;

const getNameAndAddressesTv = () => {
    rp(url)
        .then((html) => {
            console.time("first")
            parseResponseHtmlNameAddress(html)
        })
        .catch((error) => {
            throw error
        })
    // request(url, function (error, response, html) {
    //     if (!error && response.statusCode == 200) {
    //         try {
    //             console.time("first")
    //             parseResponseHtmlNameAddress(html)
    //         } catch (error) {
    //             throw error
    //         }
    //     }
    // })
}
getNameAndAddressesTv();

parseResponseHtmlNameAddress = (html) => {
    const $ = cheerio.load(html);

    let attrProductName = $("a.js-product-name")
    //let page = $("a.m-pagination_item.m-pagination_next")

    for (let i = 0; i < attrProductName.length - 1; i++) {

        let productName = attrProductName[i].attribs;
        if (attrProductName[i].attribs.href !== attrProductName[i + 1].attribs.href) {
            name = productName.title;
            address = 'https://mediamarkt.pl' + productName.href
            tvNameAndAddress.push({ i, name, address })

        } else {
            productName = attrProductName[i + 1].attribs
        }
    }
    // if (page.length > 0) {
    //     pageNumber++
    //     getPowerInformation(tvNameLink)
    // }
    getPowerInformation(tvNameAndAddress)
    console.log(tvNameAndAddress)
}

let addresses = []
getPowerInformation = (tvNameAddress) => {

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
                    //console.log(response)
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

parseResponseHtml = (html) => {
    try {
        let len = (html.length) / 2
        let id = 1;
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

                    if (k === 3) energyClass = $(item).find("dd").text().trim()
                    if (k === 5) powerConsumption = Number($(item).find("dd").text().trim())
                    if (k === 7) powerConsumptionStandby = Number($(item).find("dd").text().trim())
                    if (k === 9) annualEnergyConsumption = Number($(item).find("dd").text().trim());
                    if (k === 11) powerType = $(item).find("dd").text().trim();
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
    console.timeEnd("first")
}