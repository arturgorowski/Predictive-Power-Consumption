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
            productName.split(" ", 1)[0].length === 4 ? productName = productName.slice(12) : productName = productName.slice(14)
            producent = productName.split(" ", 1)[0];
            let div = $('table.m-product_dataRow.is-technology');

            const powerNode = div[0].childNodes[1].children.filter(item => item.type === "tag");

            let powerConsumptionIdx = $("td:contains('Pobór mocy (włączony) [W]')").parent("tr").index();
            let powerConsumptionStandbyIdx = $("td:contains('Pobór mocy (czuwanie) [W]')").parent("tr").index();

            if (powerConsumptionIdx > 0) {
                powerConsumption = powerNode[powerConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' W';
            }

            if (powerConsumptionStandbyIdx > 0) {
                powerConsumptionStandby = powerNode[powerConsumptionStandbyIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' W';
            }

            allData.push({
                referral: "mediaExpert",
                deviceType: 'homeTheaterSet',
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