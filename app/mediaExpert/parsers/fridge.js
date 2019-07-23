const cheerio = require('cheerio');

let energyClass = 'no data',
    annualEnergyConsumption = 'no data',
    noiseLevel = 'no data';

/**
 * 
 * funkcja parsująca obiekt html na informacje zużyciu energii podanym przez producenta
 */
function parseResponseHtml(html) {
    return new Promise((resolve, reject) => {
        try {
            const allData = [];

            const $ = cheerio.load(html);

            let attrProductName = $("h3.is-productTitle.tab_desc_title");
            let productName = attrProductName[0].childNodes[0].nodeValue.trim();
            let div = $('table.m-product_dataRow.is-technology');

            const powerNode = div[0].childNodes[1].children.filter(item => item.type === "tag");

            let energyClassIdx = $("td:contains('Klasa energetyczna')").parent("tr").index();
            let annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie energii [kWh]')").parent("tr").index();
            let annualEnergyConsumptionIdx1 = $("td:contains('Roczne zużycie prądu [kWh]')").parent("tr").index();
            let noiseLevelIdx = $("td:contains('Poziom hałasu [dB]')").parent("tr").index();

            if (energyClassIdx > 0) {
                energyClass = powerNode[energyClassIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
            }

            if (annualEnergyConsumptionIdx > 0 || annualEnergyConsumptionIdx1 > 0) {
                annualEnergyConsumption = powerNode[annualEnergyConsumptionIdx > 0 ? annualEnergyConsumptionIdx : annualEnergyConsumptionIdx1].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' [kWh]';
            }

            if (noiseLevelIdx > 0) {
                noiseLevel = powerNode[noiseLevelIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' dB';
            }

            allData.push({
                referral: "mediaExpert",
                productName,
                energyClass,
                annualEnergyConsumption,
                noiseLevel
            });
            resolve(allData);

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { parseResponseHtml };