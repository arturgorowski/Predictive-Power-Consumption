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

const url = 'https://www.mediaexpert.pl/telewizory?per_page=50&start=';
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
            //console.log(html[i])
            //let attrProductName = $("div.c-offerBox_header.clearfix2 a")
            let attrProductName = $("h3.is-productTitle.tab_desc_title")
            let productName = attrProductName[0].childNodes[0].nodeValue.trim()
            //console.log(attrProductName[0].childNodes[0].nodeValue.trim())
            let div = $('table.m-product_dataRow.is-technology')
            //console.log("div >>>", div)
            const powerNode = div[0].childNodes[1].children.filter(item => item.type === "tag");
            //console.log("power node >>>", powerNode, "length", powerNode.length);

            let startIdx = $("h2:contains('Efektywność energetyczna')").parent("td").parent("tr").index();

            energyClass = powerNode[startIdx + 1].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            powerConsumption = powerNode[startIdx + 2].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            powerConsumptionStandby = powerNode[startIdx + 3].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            annualEnergyConsumption = powerNode[startIdx + 4].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
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
    console.timeEnd("get mediaExpert data")
}