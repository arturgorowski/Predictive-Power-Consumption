const cheerio = require('cheerio');

let powerConsumption = 'no data',
    powerConsumptionStandby = 'no data'
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

            let powerConsumptionIdx = $("td:contains('Pobór mocy')").parent("tr").index();
            let powerConsumptionStandbyIdx = $("td:contains('Pobór mocy (czuwanie) [W]')").parent("tr").index();

            if (powerConsumptionIdx > 0) {
                powerConsumption = powerNode[powerConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' W';
            }

            if (powerConsumptionStandbyIdx > 0) {
                powerConsumptionStandby = powerNode[powerConsumptionStandbyIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim() + ' W';
            }

            allData.push({
                referral: "mediaExpert",
                productName,
                powerConsumption,
                powerConsumptionStandby,
                noiseLevel
            });
            resolve(allData);

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { parseResponseHtml };