const cheerio = require('cheerio');
const request = require('request');
const tvListUrl = require('./tvListUrl');
var rp = require('request-promise');

const data = [];
let energyClass = '',
    powerConsumption = '',
    powerConsumptionStandby = '',
    annualEnergyConsumption = '',
    powerType;

const url = 'https://www.mediaexpert.pl/telewizory/';
const tvNameAndAddress = [];
let name, address, pageNumber = 1;

const getNameAndAddressesTv = () => {
    rp(url)
        .then((html) => {
            parseResponseHtmlNameAddress(html)
        })
        .catch((error) => {
            throw error
        })
}

getNameAndAddressesTv();

function parseResponseHtmlNameAddress(html) {
    const $ = cheerio.load(html);

    let attrProductName = $("div.c-offerBox_header.clearfix2 a")
    // $("div.c-offerBox_header.clearfix2 a").map((k,v)=> `https://mediaexpert.pl${$(v).attr("href")}`)
    //let page = $("a.m-pagination_item.m-pagination_next")

    for (let i = 0; i < attrProductName.length - 1; i++) {

        let productName = attrProductName[i].attribs;
        if (attrProductName[i].attribs.href !== attrProductName[i + 1].attribs.href && attrProductName[i].attribs.class !== 'c-reviewStars_link under_off js-gtmEvent_click') {
            name = productName.title;
            address = 'https://mediaexpert.pl' + productName.href
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
        let table = [];
        for (let i = len; i < html.length; i++) {
            const $ = cheerio.load(html[i])
            //console.log(html[i])
            let div = $('table.m-product_dataRow.is-technology')
            //console.log("div >>>", div)
            const powerNode = div[0].childNodes[1].children.filter(item=>item.type === "tag");
            console.log("power node >>>", powerNode, "length", powerNode.length);

            let startIdx = $("h2:contains('Efektywność energetyczna')").parent("td").parent("tr").index();
            console.log("energy class", powerNode[startIdx+2].children.filter(item=>item.type === "tag"));
            // powerNode.forEach((item, k) => {
            //     if (item.type !== "text") {
            //         table.push(item)
                  
            //     }
            // })
            // table.forEach((item, k)=>{
            //     console.log(startIdx, table[startIdx], table[startIdx + 1], table[startIdx + 2], table[startIdx + 3]);
            // })
            // energyClass = powerNode.children().eq(startIdx + 2);
            // powerConsumption = powerNode.children().eq(startIdx + 4);
            // powerConsumptionStandby = powerNode.children().eq(startIdx + 6);
            // annualEnergyConsumption = powerNode.children().eq(startIdx + 8);
            // powerType = powerNode.children().eq(startIdx + 10);

            // powerNode.forEach((item, k) => {
            //     if (item.type !== "text") {
            //         item.childNodes[k]
            //         if (k === 144) energyClass = $(item.children[3]).text().trim()
            //         if (k === 146) powerConsumption = Number($(item.children[3]).text().trim())
            //         if (k === 148) powerConsumptionStandby = Number($(item.children[3]).text().trim())
            //         if (k === 150) annualEnergyConsumption = Number($(item.children[3]).text().trim())
            //         if (k === 152) powerType = $(item.children[3]).text().trim()
            //     }
            // })
            data.push({
                id,
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