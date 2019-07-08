const cheerio = require('cheerio');
var rp = require('request-promise');
const DeviceListUrlScrapper = require('../app').DeviceListUrlScrapper

// get all tv url 
//$("div.list div").map((k,v)=> `https://www.euro.com.pl${$(v).attr("data-product-href")}`)
const data = [];
let energyClass = '',
    powerConsumption = '',
    powerConsumptionStandby = '',
    annualEnergyConsumption = '',
    powerType;

const url = 'https://www.mediaexpert.pl/telewizory/';
const tvNameAndAddress = [];
let name, address, pageNumber = 1;

const request = new DeviceListUrlScrapper(url);

request.getNameAndAddresses()
    .then(result => {
        console.log("result >>> ", result);
        getPowerInformation(result)
    })

// const getNameAndAddressesTv = () => {
//     rp(url)
//         .then((html) => {
//             parseResponseHtmlNameAddress(html)
//         })
//         .catch((error) => {
//             throw error
//         })
// }
// getNameAndAddressesTv();

// function parseResponseHtmlNameAddress(html) {
//     const $ = cheerio.load(html);

//     let attrProductName = $("div.c-offerBox_header.clearfix2 a")
//     // $("div.c-offerBox_header.clearfix2 a").map((k,v)=> `https://mediaexpert.pl${$(v).attr("href")}`)
//     //let page = $("a.m-pagination_item.m-pagination_next")

//     for (let i = 0; i < attrProductName.length - 1; i++) {

//         let productName = attrProductName[i].attribs;
//         if (attrProductName[i].attribs.href !== attrProductName[i + 1].attribs.href && attrProductName[i].attribs.class !== 'c-reviewStars_link under_off js-gtmEvent_click') {
//             name = productName.title;
//             address = 'https://mediaexpert.pl' + productName.href
//             tvNameAndAddress.push({ i, name, address })

//         } else {
//             productName = attrProductName[i + 1].attribs
//         }
//     }
//     // if (page.length > 0) {
//     //     pageNumber++
//     //     getPowerInformation(tvNameLink)
//     // }
//     getPowerInformation(tvNameAndAddress)
//     console.log(tvNameAndAddress)
// }

let addresses = []
function getPowerInformation(tvNameAddress) {

    tvNameAddress.forEach((address) => {
        addresses.push(address.address)
    })

    let promises = addresses.map(url => {
        //console.log("url >>", url)
        return new Promise((resolve, reject) => {
            rp(url)
                .then((response) => {
                    resolve(response)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    })

    promises.reduce((promiseChain, currentTask) => {
        return promiseChain
            .then(chainResults => currentTask
                .then(currentResult => chainResults = chainResults
                    .concat(currentResult)
                )
            )
    }, Promise.resolve(promises))
        .then(htmlBody => {
            parseResponseHtml(htmlBody)
        })
        .then(model => {
            return model;
        })
        .catch(err => {
            console.log(">>> ERR :", err);
            return err;
        })
}

function parseResponseHtml(html) {
    try {
        let len = (html.length) / 2;
        let id = 1;
        for (let i = len; i < html.length; i++) {
            const $ = cheerio.load(html[i])
            //console.log(html[i])
            //let attrProductName = $("div.c-offerBox_header.clearfix2 a")
            let attrProductName = $("h3.is-productTitle.tab_desc_title")
            let productName = attrProductName[0].childNodes[0].nodeValue.trim()
            //console.log(attrProductName[0].childNodes[0].nodeValue.trim())
            let div = $('table.m-product_dataRow.is-technology')
            //console.log("div >>>", div)
            const powerNode = div[0].childNodes[1].children.filter(item=>item.type === "tag");
            //console.log("power node >>>", powerNode, "length", powerNode.length);

            let startIdx = $("h2:contains('Efektywność energetyczna')").parent("td").parent("tr").index();

            energyClass = powerNode[startIdx+1].children.filter(item=>item.type === "tag")[1].children[0].nodeValue.trim()
            powerConsumption = powerNode[startIdx+2].children.filter(item=>item.type === "tag")[1].children[0].nodeValue.trim()
            powerConsumptionStandby = powerNode[startIdx+3].children.filter(item=>item.type === "tag")[1].children[0].nodeValue.trim()
            annualEnergyConsumption = powerNode[startIdx+4].children.filter(item=>item.type === "tag")[1].children[0].nodeValue.trim()
            //powerType = powerNode[startIdx+5].children.filter(item=>item.type === "tag")[1].children[0].nodeValue.trim()

            //console.log(energyClass, powerConsumption, powerConsumptionStandby, annualEnergyConsumption, powerType)

            data.push({
                id,
                productName,
                energyClass,
                powerConsumption,
                powerConsumptionStandby,
                annualEnergyConsumption,
                //powerType
            })
            id++
        }

    } catch (error) {
        throw error
    }
    console.log(">>> data", data)
}