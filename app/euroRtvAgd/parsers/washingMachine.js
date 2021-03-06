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
function parseResponseHtml(html) {
    return new Promise((resolve, reject) => {
        try {
            const allData = [];

            const $ = cheerio.load(html);
            let attrProductName = $("h1.selenium-KP-product-name");
            let productName = attrProductName[0].childNodes[0].nodeValue.trim();
            producent = productName.split(" ", 1)[0];
            let div = $('table.description-tech-details.js-tech-details');
            const powerNode = div[0].childNodes[1].children.filter(item => item.type === "tag");

            let energyClassIndex = $("td:contains('Klasa energetyczna')").parent("tr").index();
            let powerConsumptionIndex = $("td:contains('Zużycie prądu')").parent("tr").index();
            let annualEnergyConsumptionIndex = $("td:contains('Roczne zużycie prądu')").parent("tr").index();
            let noiseLevelIndex = $("td:contains('Poziom hałasu (pranie/wirowanie)')").parent("tr").index();

            if (energyClassIndex > 0) {
                energyClass = powerNode[energyClassIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
            }

            if (powerConsumptionIndex > 0) {
                powerConsumption = powerNode[powerConsumptionIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
            }

            if (annualEnergyConsumptionIndex > 0) {
                annualEnergyConsumption = powerNode[annualEnergyConsumptionIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
            }

            if (noiseLevelIndex > 0) {
                noiseLevel = powerNode[noiseLevelIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
            }

            allData.push({
                referral: "euroRtvAgd",
                deviceType: 'washingMachine',
                productName,
                energyClass,
                powerConsumption,
                powerConsumptionStandby,
                annualEnergyConsumption,
                noiseLevel,
                producent
            });
            resolve(allData);

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { parseResponseHtml };