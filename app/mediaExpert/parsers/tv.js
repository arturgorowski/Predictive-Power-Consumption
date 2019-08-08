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
            let attrProductName = $("h3.is-productTitle.tab_desc_title");
            let productName = attrProductName[0].childNodes[0].nodeValue.trim();
            productName = productName.slice(10);
            producent = productName.split(" ", 1)[0];
            let div = $('table.m-product_dataRow.is-technology');
            const powerNode = div[0].childNodes[1].children.filter(item => item.type === "tag");


            let startIdx = $("td:contains('Klasa energetyczna')").parent("tr").index();
            let powerConsumptionIdx = $("td:contains('Pobór mocy (tryb włączenia)')").parent("tr").index();
            let powerConsumptionStandbyIdx = $("td:contains('Pobór mocy (tryb czuwania)')").parent("tr").index();
            let annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie energii [kWh]')").parent("tr").index();

            if (startIdx > 0) {
                energyClass = powerNode[startIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
            }

            if (powerConsumptionIdx > 0) {
                powerConsumption = powerNode[powerConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' kWh';
            }

            if (powerConsumptionStandbyIdx > 0) {
                powerConsumptionStandby = powerNode[powerConsumptionStandbyIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' W';
            }

            if (annualEnergyConsumptionIdx > 0) {
                annualEnergyConsumption = powerNode[annualEnergyConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' kWh';
            }

            allData.push({
                referral: "mediaExpert",
                deviceType: 'tv',
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
    });
}

module.exports = { parseResponseHtml };