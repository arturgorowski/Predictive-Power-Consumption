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
            productName.split(" ", 1)[0].length === 6 ? productName = productName.slice(7) : productName = productName.slice(16)
            producent = productName.split(" ", 1)[0];
            let div = $('table.m-product_dataRow.is-technology');
            const powerNode = div[0].childNodes[1].children.filter(item => item.type === "tag");

            let energyClassIdx = $("td:contains('Klasa energetyczna')").parent("tr").index();
            let cyclePowerConsumptionIdx = $("td:contains('Zużycie prądu pranie z suszeniem [kWh/cykl]')").parent("tr").index();
            let noiseLevelIdx = $("td:contains('Poziom hałasu suszenie [dB]')").parent("tr").index();

            if (energyClassIdx > 0) {
                energyClass = powerNode[energyClassIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
            }

            if (cyclePowerConsumptionIdx > 0) {
                powerConsumption = powerNode[cyclePowerConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
            }

            if (noiseLevelIdx > 0) {
                noiseLevel = powerNode[noiseLevelIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' dB';
            }

            allData.push({
                referral: "mediaExpert",
                deviceType: 'washerDryer',
                productName,
                energyClass,
                powerConsumption,
                powerConsumptionStandby,
                annualEnergyConsumption,
                noiseLevel,
                producent,
                model
            });

            return resolve(allData);

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { parseResponseHtml };