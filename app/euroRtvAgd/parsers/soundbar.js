const cheerio = require('cheerio');

let energyClass = 'no data',
    powerConsumption = 'no data',
    powerConsumptionStandby = 'no data',
    annualEnergyConsumption = 'no data',
    noiseLevel = 'no data',
    producent = 'no data';

/**
 *  
 * funkcja parsująca obiekt html na informacje zużyciu energii podanym przez producenta
 */
function parseResponseHtml(html, model) {
    return new Promise((resolve, reject) => {
        try {
            const allData = [];
            const $ = cheerio.load(html);
            let attrProductName = $("h1.selenium-KP-product-name");
            let productName = attrProductName[0].childNodes[0].nodeValue.trim();
            producent = productName.split(" ", 1)[0];
            let div = $('table.description-tech-details.js-tech-details');
            const powerNode = div[0].childNodes[1].children.filter(item => item.type === "tag");

            let powerConsumptionIdx = $("td:contains('Pobór mocy')").parent("tr").index();
            let powerConsumptionStandbyIdx = $("td:contains('Pobór mocy w trybie gotowości')").parent("tr").index();

            if (powerConsumptionIdx > 0) {
                powerConsumption = powerNode[powerConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
            }

            if (powerConsumptionStandbyIdx > 0) {
                powerConsumptionStandby = powerNode[powerConsumptionStandbyIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
            }

            allData.push({
                referral: "euroRtvAgd",
                deviceType: 'soundbar',
                productName,
                energyClass,
                powerConsumption,
                powerConsumptionStandby,
                annualEnergyConsumption,
                noiseLevel,
                producent,
                model
            });
            resolve(allData);

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = { parseResponseHtml };