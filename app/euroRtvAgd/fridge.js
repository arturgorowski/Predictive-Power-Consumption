const cheerio = require('cheerio');

let energyClass = '',
    annualEnergyConsumption = '';

/**
 * 
 * funkcja parsująca obiekt html na informacje zużyciu energii podanym przez producenta
 */
function parseResponseHtml(html) {
    return new Promise((resolve, reject) => {
        try {
            const allData = [];
            const $ = cheerio.load(html)
            let attrProductName = $("h1.selenium-KP-product-name")
            let productName = attrProductName[0].childNodes[0].nodeValue.trim()
            let div = $('table.description-tech-details.js-tech-details')
            const powerNode = div[0].childNodes[1].children.filter(item => item.type === "tag");

            let energyClassIndex = $("td:contains('Klasa energetyczna')").parent("tr").index();
            let annualEnergyConsumptionIndex = $("td:contains('Roczne zużycie energii')").parent("tr").index();
            let annualEnergyConsumptionIndex1 = $("td:contains('Roczne zużycie prądu')").parent("tr").index();

            energyClass = powerNode[energyClassIndex].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()
            annualEnergyConsumption = powerNode[annualEnergyConsumptionIndex>0 ? annualEnergyConsumptionIndex : annualEnergyConsumptionIndex1].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()

            allData.push({
                referral: "euroRtvAgd",
                productName,
                energyClass,
                annualEnergyConsumption,

            })

            resolve(allData);

        } catch (error) {
            reject(error);
        }
    })
}

module.exports = { parseResponseHtml };