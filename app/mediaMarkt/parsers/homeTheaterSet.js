const cheerio = require('cheerio');

let powerConsumption = 'no data',
    powerConsumptionStandby = 'no data',
    noiseLevel = 'no data';

/**
 * 
 * funkcja parsująca obiekt html na informacje zużyciu energii podanym przez producenta
 */
const parseResponseHtml = (html) => {
    return new Promise((resolve, reject) => {
        try {

            const allData = [];
            const $ = cheerio.load(html);
            let div = $('div.m-offerShowData');
            let attrProductName = $("h1.m-typo.m-typo_primary").text().trim();
            const powerNode = div[0].childNodes[13];

            powerNode.children.forEach((item, k) => {
                if (item.type !== "text") {

                    let dt = $(item).find("dt").text().trim();
                    //if (dt === 'Klasa energetyczna') energyClass = $(item).find("dd").text().trim();
                    if (dt === 'Pobór mocy [W]') powerConsumption = Number($(item).find("dd").text().trim()) + ' W';
                    if (dt === 'Pobór mocy (czuwanie) [W]') powerConsumptionStandby = Number($(item).find("dd").text().trim()) + ' W';
                }
            });
            if (powerConsumption === 'no data' && powerConsumptionStandby === 'no data') {
                allData.push({
                    referral: "mediaMarkt",
                    tvName: attrProductName,
                    powerConsumption,
                    powerConsumptionStandby,
                    noiseLevel
                });

                return resolve(allData);
            } else {
                allData.push({
                    referral: "mediaMarkt",
                    tvName: attrProductName,
                    powerConsumption,
                    powerConsumptionStandby,
                    noiseLevel
                });

                return resolve(allData);
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { parseResponseHtml };