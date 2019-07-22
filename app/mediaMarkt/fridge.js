const cheerio = require('cheerio');

let energyClass = '',
    powerConsumption = '',
    annualEnergyConsumption = '';

/**
 * 
 * funkcja parsująca obiekt html na informacje zużyciu energii podanym przez producenta
 */
const parseResponseHtml = (html) => {
    return new Promise((resolve, reject) => {
        try {

            const allData = [];
            const $ = cheerio.load(html)
            let div = $('div.m-offerShowData')
            let attrProductName = $("h1.m-typo.m-typo_primary").text().trim()
            const powerNode = div[0].childNodes[3];

            powerNode.children.forEach((item, k) => {
                if (item.type !== "text") {

                    let dt = $(item).find("dt").text().trim()
                    if (dt === 'Klasa energetyczna') energyClass = $(item).find("dd").text().trim()
                    if (dt === 'Zużycie energii [kWh/24h]') powerConsumption = Number($(item).find("dd").text().trim()) + ' [kWh/24h]';
                    if (dt === 'Zużycie energii [kWh/rok]') annualEnergyConsumption = Number($(item).find("dd").text().trim()) + ' [kWh/year]'
                }
            })

            allData.push({
                referral: "mediaMarkt",
                tvName: attrProductName,
                energyClass,
                powerConsumption,
                annualEnergyConsumption,
            })

            resolve(allData)

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = { parseResponseHtml };