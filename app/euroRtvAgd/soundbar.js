const cheerio = require('cheerio');

let powerConsumption = '',
    powerConsumptionStandby = '';

/**
 * 
 * funkcja parsująca obiekt html na informacje zużyciu energii podanym przez producenta
 */
function parseResponseHtml(html) {
    return new Promise((resolve, reject) => {
        try {
            const allData = [];
            const $ = cheerio.load(html)
            let attrProductName = $("h1.selenium-KP-product-name")
            let productName = attrProductName[0].childNodes[0].nodeValue.trim()
            let div = $('table.description-tech-details.js-tech-details')
            const powerNode = div[0].childNodes[1].children.filter(item => item.type === "tag");

            let powerConsumptionIdx = $("td:contains('Pobór mocy')").parent("tr").index();
            let powerConsumptionStandbyIdx = $("td:contains('Pobór mocy w trybie gotowości')").parent("tr").index();

            if (powerConsumptionIdx > 0 && powerConsumptionStandbyIdx > 0) {

                powerConsumption = powerNode[powerConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
                powerConsumptionStandby = powerNode[powerConsumptionStandbyIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()

                allData.push({
                    referral: "euroRtvAgd",
                    productName,
                    powerConsumption,
                    powerConsumptionStandby,

                })

                resolve(allData);
            } else {
                allData.push({
                    referral: "euroRtvAgd",
                    productName,
                    powerConsumption: 'no data',
                    powerConsumptionStandby: 'no data',

                })

                resolve(allData);
            }



        } catch (error) {
            reject(error);
        }
    })
}

module.exports = { parseResponseHtml };