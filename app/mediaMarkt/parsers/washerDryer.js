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
            productName.split(" ", 1)[0].length === 6 ? productName = productName.slice(7) : productName = productName.slice(16)
            producent = productName.split(" ", 1)[0];

            const energyClassNode = div[0].childNodes[3];
            const powerNode = div[0].childNodes[5];
            const noiseNode = div[0].childNodes[1];

            noiseNode.children.forEach((item, k) => {
                if (item.type !== "text") {
                    let dt = $(item).find("dt").text().trim();
                    if (dt === 'Poziom hałasu podczas wirowania [dB]') noiseLevel = $(item).find("dd").text().trim() + ' dB';
                }
            });

            energyClassNode.children.forEach((item, k) => {
                if (item.type !== "text") {
                    let dt = $(item).find("dt").text().trim();
                    if (dt === 'Klasa energetyczna') energyClass = $(item).find("dd").text().trim();
                }
            });

            powerNode.children.forEach((item, k) => {
                if (item.type !== "text") {
                    let dt = $(item).find("dt").text().trim();
                    if (dt === 'Zużycie energii na cykl (pranie i wirowanie) [kWh]') powerConsumption = Number($(item).find("dd").text().trim()) + ' kWh';
                    if (dt === 'Zużycie energii na rok (pranie, wirowanie i suszenie [kWh]') annualEnergyConsumption = Number($(item).find("dd").text().trim()) + ' kWh';
                }
            });

            allData.push({
                referral: "mediaMarkt",
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

            resolve(allData);

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = { parseResponseHtml };