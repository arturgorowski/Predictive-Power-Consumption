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
            productName = productName.slice(8);
            producent = productName.split(" ", 1)[0];
            const powerNode = div[0].childNodes[9];

            powerNode.children.forEach((item, k) => {
                if (item.type !== "text") {

                    let dt = $(item).find("dt").text().trim();
                    //if (dt === 'Klasa energetyczna') energyClass = $(item).find("dd").text().trim();
                    if (dt === 'Pobór mocy [W]') powerConsumption = Number($(item).find("dd").text().trim()) + ' W';
                    if (dt === 'Pobór mocy (czuwanie) [W]') powerConsumptionStandby = Number($(item).find("dd").text().trim()) + ' W';
                }
            });
            allData.push({
                referral: "mediaMarkt",
                deviceType: 'bluRay',
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