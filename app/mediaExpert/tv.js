const cheerio = require('cheerio');
//let allData = require('../allUrlData');

// get all tv url 
//$("div.list div").map((k,v)=> `https://www.euro.com.pl${$(v).attr("data-product-href")}`)
// const allData = [];
let energyClass = '',
    powerConsumption = '',
    powerConsumptionStandby = '',
    annualEnergyConsumption = '';

//let id = 1;
/**
 * 
 * funkcja parsująca obiekt html na informacje zużyciu energii podanym przez producenta
 */
function parseResponseHtml(html) {
    return new Promise((resolve, reject) => {
        try {
            const allData = [];
            // let len = (html.length) / 2;

            // for (let i = len; i < html.length; i++) {
            //     const $ = cheerio.load(html[i])
            const $ = cheerio.load(html)
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
            let powerConsumptionIdx = $("td:contains('Pobór mocy (tryb włączenia)')").parent("tr").index();
            let powerConsumptionStandbyIdx = $("td:contains('Pobór mocy (tryb czuwania)')").parent("tr").index();
            let annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie energii [kWh]')").parent("tr").index();


            energyClass = powerNode[startIdx + 1].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            // powerConsumption = powerNode[startIdx + 2].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' W';
            // powerConsumptionStandby = powerNode[startIdx + 3].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' W';
            // annualEnergyConsumption = powerNode[startIdx + 4].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' kWh';

            powerConsumption = powerNode[powerConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' W';
            powerConsumptionStandby = powerNode[powerConsumptionStandbyIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' W';
            annualEnergyConsumption = powerNode[annualEnergyConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' kWh';
            //powerType = powerNode[startIdx+5].children.filter(item=>item.type === "tag")[1].children[0].nodeValue.trim()

            //console.log(energyClass, powerConsumption, powerConsumptionStandby, annualEnergyConsumption, powerType)

            allData.push({
                //id,
                referral: "mediaExpert",
                productName,
                energyClass,
                powerConsumption,
                powerConsumptionStandby,
                annualEnergyConsumption,
                //powerType
            })
            //id++
            //}
            return resolve(allData);

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = { parseResponseHtml };