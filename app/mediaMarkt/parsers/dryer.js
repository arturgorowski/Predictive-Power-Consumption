const cheerio = require('cheerio');

let energyClass = 'no data',
    powerConsumptionStandby = 'no data',
    annualEnergyConsumption = 'no data',
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

            const noiseNode = div[0].childNodes[1];
            const powerNode = div[0].childNodes[3];

            noiseNode.children.forEach((item, k) => {
                if (item.type !== "text") {
                    let dt = $(item).find("dt").text().trim();
                    if (dt === 'Poziom hałasu [dB]') noiseLevel = $(item).find("dd").text().trim() + ' dB';
                }
            });

            powerNode.children.forEach((item, k) => {
                if (item.type !== "text") {
                    let dt = $(item).find("dt").text().trim();
                    if (dt === 'Klasa energetyczna') energyClass = $(item).find("dd").text().trim();
                    if (dt === 'Zużycie energii w trybie czuwania [W]') powerConsumptionStandby = Number($(item).find("dd").text().trim()) + ' W';
                    if (dt === 'Zużycie energii na rok [kWh]') annualEnergyConsumption = Number($(item).find("dd").text().trim()) + ' kWh';
                }
            });

            allData.push({
                referral: "mediaMarkt",
                tvName: attrProductName,
                energyClass,
                powerConsumptionStandby,
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