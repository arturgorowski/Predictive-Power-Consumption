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
            productName.split(" ", 1)[0].length === 7 ? productName = productName.slice(8) : productName = productName.slice(11)
            producent = productName.split(" ", 1)[0];

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
                    //if (dt === 'Zużycie energii [kWh/24h]') powerConsumption = Number($(item).find("dd").text().trim()) + ' kWh';
                    if (dt === 'Zużycie energii [kWh/rok]') {
                        annualEnergyConsumption = Number($(item).find("dd").text().trim()); //+ ' kWh';

                        powerConsumption = annualEnergyConsumption / 366
                        powerConsumption = Math.round(annualEnergyConsumptionTemp * 100) / 100
                    }
                }
            });

            allData.push({
                referral: "mediaMarkt",
                deviceType: 'fridge',
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