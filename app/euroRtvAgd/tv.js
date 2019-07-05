const cheerio = require('cheerio');
var rp = require('request-promise');
const tvNameAddress = require('./tvListUrl');

// get all tv url 
//$("div.list div.product-box.js-UA-product").map((k,v)=> `https://www.euro.com.pl${$(v).attr("data-product-href")}`)

const data = [];
let energyClass = '',
    powerConsumption = '',
    powerConsumptionStandby = '',
    annualEnergyConsumption = '',
    powerType;

const url = 'https://www.euro.com.pl/telewizory-led-lcd-plazmowe.bhtml?link=mainnavi';
const tvNameAndAddress = [];
let name, address, pageNumber = 1;

const getNameAndAddressesTv = () => {
    rp(url)
        .then((html) => {
            console.time("timer")
            parseResponseHtmlNameAddress(html)
        })
        .catch((error) => {
            throw error
        })
}
getNameAndAddressesTv();

function parseResponseHtmlNameAddress(html) {
    const $ = cheerio.load(html);

    let attrProductName = $("div.list div.product-box.js-UA-product")
    
    for (let i = 0; i < attrProductName.length - 1; i++){

        let productName = attrProductName[i].attribs;
       
            //name = productName.title;
            address = 'https://www.euro.com.pl' + productName['data-product-href']
            tvNameAndAddress.push({ i, address })
    }
    getPowerInformation(tvNameAndAddress);
    console.log(tvNameAndAddress)
}

let addresses = []
getPowerInformation = (tvNameAddress) => {

    tvNameAddress.forEach((address) => {
        addresses.push(address.address)
    })

    console.log("addresses:", addresses)
    let promises = addresses.map(url => {
        console.log(">>> url", url)
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

function parseResponseHtml(html) {
    try {
        let len = (html.length) / 2;
        let id = 1;
        for (let i = len; i < html.length; i++) {
            const $ = cheerio.load(html[i])
            //console.log(html)
            let attrProductName = $("h1.selenium-KP-product-name")
            let productName = attrProductName[0].childNodes[0].nodeValue.trim()
            //console.log(attrProductName[0].childNodes[0].nodeValue.trim())
            let div = $('table.description-tech-details.js-tech-details')
            //console.log("div >>>", div)
            const powerNode = div[0].childNodes[1].children.filter(item => item.type === "tag");
            //console.log("power node >>>", powerNode, "length", powerNode.length);

            let energyClassIndex = $("td:contains('Klasa energetyczna')").parent("tr").index();
            let powerConsumptionIndex = $("td:contains('Pobór mocy IEC 62087 Ed.2 (tryb włączenia)')").parent("tr").index();
            let powerConsumptionStandbyIndex = $("td:contains('Pobór mocy (tryb czuwania)')").parent("tr").index();
            let annualEnergyConsumptionIndex = $("td:contains('Roczne zużycie energii')").parent("tr").index();
            let powerTypeIndex = $("td:contains('Zasilanie')").parent("tr").index();

            energyClass = powerNode[energyClassIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            powerConsumption = powerNode[powerConsumptionIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            powerConsumptionStandby = powerNode[powerConsumptionStandbyIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            annualEnergyConsumption = powerNode[annualEnergyConsumptionIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            powerType = powerNode[powerTypeIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()

            //console.log(energyClass, powerConsumption, powerConsumptionStandby, annualEnergyConsumption, powerType)

            data.push({
                id,
                productName,
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
    console.timeEnd("timer")
}