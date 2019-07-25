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
const parseResponseHtml = (html, model) => {
    return new Promise((resolve, reject) => {
        try {

            const allData = [];
            const $ = cheerio.load(html);
            let div = $('div.m-offerShowData');
            let productName = $("h1.m-typo.m-typo_primary").text().trim();
            productName = productName.slice(9);
            producent = productName.split(" ", 1)[0];
            const energyClassNode = div[0].childNodes[3];
            const noiseNode = div[0].childNodes[1];

            noiseNode.children.forEach((item, k) => {
                if (item.type !== "text") {
                    let dt = $(item).find("dt").text().trim();
                    if (dt === 'Poziom hałasu [dB]') noiseLevel = $(item).find("dd").text().trim() + ' dB';
                }
            });

            energyClassNode.children.forEach((item, k) => {
                if (item.type !== "text") {
                    let dt = $(item).find("dt").text().trim();
                    if (dt === 'Klasa energetyczna') energyClass = $(item).find("dd").text().trim();
                    if (dt === 'Zużycie energii w trybie czuwania [W]') powerConsumptionStandby = Number($(item).find("dd").text().trim()) + ' W';
                    if (dt === 'Zużycie energii na cykl [kWh]') powerConsumption = Number($(item).find("dd").text().trim()) + ' kWh';
                    if (dt === 'Zużycie energii na rok [kWh]') annualEnergyConsumption = Number($(item).find("dd").text().trim()) + ' kWh';
                }
            });

            allData.push({
                referral: "mediaMarkt",
                deviceType: 'washer',
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