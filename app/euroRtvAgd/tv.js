const cheerio = require('cheerio');
let rp = require('request-promise');
const DeviceListUrlScrapper = require('../app').DeviceListUrlScrapper

/**
 * get all tv url 
 * $("div.list div.product-box.js-UA-product").map((k,v)=> `https://www.euro.com.pl${$(v).attr("data-product-href")}`)
 * 
 */

const data = [];
let energyClass = '',
    powerConsumption = '',
    powerConsumptionStandby = '',
    annualEnergyConsumption = '';

const url = 'https://www.euro.com.pl/telewizory-led-lcd-plazmowe.bhtml?link=mainnavi';

const request = new DeviceListUrlScrapper(url);

request.getScrapperHtmlTab()
    .then(result => {
        //console.log(result)
        parseResponseHtml(result)
    })
    .catch(error => {
        return error
    })

let id = 1;
function parseResponseHtml(html) {
    try {
        let len = (html.length) / 2;

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
            //let powerTypeIndex = $("td:contains('Zasilanie')").parent("tr").index();

            energyClass = powerNode[energyClassIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            powerConsumption = powerNode[powerConsumptionIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            powerConsumptionStandby = powerNode[powerConsumptionStandbyIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            annualEnergyConsumption = powerNode[annualEnergyConsumptionIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            //powerTypeIndex > annualEnergyConsumptionIndex ? powerType = powerNode[powerTypeIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() : powerType = 'no data'

            //console.log(i, "--",energyClass,"--", powerConsumption,"--", powerConsumptionStandby,"--", annualEnergyConsumption,"--", powerType)

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
    console.timeEnd("get euroRtvAgd data")
}