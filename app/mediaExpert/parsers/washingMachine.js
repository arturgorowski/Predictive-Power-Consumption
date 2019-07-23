const cheerio = require('cheerio');

let energyClass = 'no data',
    powerConsumption = 'no data',
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
            let powerConsumptionIdx = $("td:contains('Zużycie energii [kWh]')").parent("tr").index();
            let annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie energii [kWh]')").parent("tr").index();
            let noiseLevelIdx = $("td:contains('Poziom hałasu (wirowanie) [dB]')").parent("tr").index();

            if (energyClassIdx > 0) {
                energyClass = powerNode[energyClassIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
            }

            if (powerConsumptionIdx > 0) {
                powerConsumption = powerNode[powerConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' W';
            }

            if (annualEnergyConsumptionIdx > 0) {
                annualEnergyConsumption = powerNode[annualEnergyConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' kWh';
            }

            if (noiseLevelIdx > 0) {
                noiseLevel = powerNode[noiseLevelIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' dB';
            }

            allData.push({
                referral: "mediaExpert",
                productName,
                energyClass,
                powerConsumption,
                annualEnergyConsumption,
                noiseLevel
            });

            return resolve(allData);

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { parseResponseHtml };