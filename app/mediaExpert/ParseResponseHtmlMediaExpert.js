const cheerio = require('cheerio');

/**
 * zwraca nazwę produktu i miejsce gdzie znaduje się informacja
 * o poborze mocy oraz hałasie w zależności od parsowanego urządzenia
 */
function getPowerNode(productName, deviceType, $) {

    return new Promise((resolve, reject) => {
        try {
            switch (deviceType) {
                case 'bluRay':
                    productName.split(" ", 1)[0].length === 4 ? productName = productName.slice(12) : productName = productName.slice(14)
                    powerConsumptionIdx = $("td:contains('Pobór mocy')").parent("tr").index();
                    powerConsumptionStandbyIdx = $("td:contains('Pobór mocy (czuwanie) [W]')").parent("tr").index();

                    resolve({ productName, powerConsumptionIdx, powerConsumptionStandbyIdx });
                    break;

                case 'cooker':
                    productName = productName.slice(8);
                    powerConsumptionIdx = $("td:contains('Zużycie energii [kWh/cykl]')").parent("tr").index();
                    annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie energii [kWh]')").parent("tr").index();

                    resolve({ productName, powerConsumptionIdx, annualEnergyConsumptionIdx });
                    break;

                case 'dryer':
                    productName = productName.slice(9);
                    annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie energii [kWh]')").parent("tr").index();

                    resolve({ productName, annualEnergyConsumptionIdx });
                    break;

                case 'fridge':
                    productName.split(" ", 1)[0].length === 7 ? productName = productName.slice(8) : productName = productName.slice(11);
                    annualEnergyConsumption1 = $("td:contains('Roczne zużycie energii [kWh]')").parent("tr").index();
                    annualEnergyConsumption2 = $("td:contains('Roczne zużycie prądu [kWh]')").parent("tr").index();
                    annualEnergyConsumptionIdx = annualEnergyConsumption1 > 0 ? annualEnergyConsumption1 : annualEnergyConsumption2;

                    resolve({ productName, annualEnergyConsumptionIdx });
                    break;

                case 'homeTheaterSet':
                    productName.split(" ", 1)[0].length === 4 ? productName = productName.slice(12) : productName = productName.slice(14)
                    powerConsumptionIdx = $("td:contains('Pobór mocy (włączony) [W]')").parent("tr").index();
                    powerConsumptionStandbyIdx = $("td:contains('Pobór mocy (czuwanie) [W]')").parent("tr").index();

                    resolve({ productName, powerConsumptionIdx, powerConsumptionStandbyIdx });
                    break;

                case 'oven':
                    productName = productName.slice(10);
                    powerConsumptionIdx = $("td:contains('Zużycie energii [kWh/cykl]')").parent("tr").index();
                    annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie energii [kWh]')").parent("tr").index();

                    resolve({ productName, powerConsumptionIdx, annualEnergyConsumptionIdx });
                    break;

                case 'soundbar':
                    productName = productName.slice(9);
                    powerConsumptionIdx = $("td:contains('Pobór mocy [W]')").parent("tr").index();

                    resolve({ productName, powerConsumptionIdx });
                    break;

                case 'tv':
                    productName = productName.slice(10);
                    powerConsumptionIdx = $("td:contains('Pobór mocy (tryb włączenia)')").parent("tr").index();
                    powerConsumptionStandbyIdx = $("td:contains('Pobór mocy (tryb czuwania)')").parent("tr").index();
                    annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie energii [kWh]')").parent("tr").index();

                    resolve({ productName, powerConsumptionIdx, annualEnergyConsumptionIdx, powerConsumptionStandbyIdx });
                    break;

                case 'washer':
                    productName = productName.slice(9);
                    powerConsumptionIdx = $("td:contains('Zużycie energii [kWh/cykl]')").parent("tr").index();
                    annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie energii [kWh]')").parent("tr").index();

                    resolve({ productName, powerConsumptionIdx, annualEnergyConsumptionIdx });
                    break;

                case 'washerDryer':
                    productName.split(" ", 1)[0].length === 6 ? productName = productName.slice(7) : productName = productName.slice(16);
                    powerConsumptionIdx = $("td:contains('Zużycie prądu pranie z suszeniem [kWh/cykl]')").parent("tr").index();

                    resolve({ productName, powerConsumptionIdx });
                    break;

                case 'washingMachine':
                    productName = productName.slice(7);
                    powerConsumptionIdx = $("td:contains('Zużycie energii [kWh]')").parent("tr").index();
                    annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie energii [kWh]')").parent("tr").index();

                    resolve({ productName, powerConsumptionIdx, annualEnergyConsumptionIdx });
                    break;
            }
        } catch (error) { reject(error) }

    })
}

/**
 * 
 * funkcja parsująca obiekt html na informacje zużyciu energii podanym przez producenta
 */
function parseResponseHtml(html, model, deviceType) {

    let energyClass = 'no data',
        powerConsumption = 'no data',
        powerConsumptionStandby = 'no data',
        annualEnergyConsumption = 'no data',
        noiseLevel = 'no data',
        producent = 'no data';

    return new Promise((resolve, reject) => {

        try {

            const allData = [];
            const $ = cheerio.load(html);
            let attrProductName = $("h3.is-productTitle.tab_desc_title");
            let productName = attrProductName[0].childNodes[0].nodeValue.trim();
            let div = $('table.m-product_dataRow.is-technology');
            const powerNode = div[0].childNodes[1].children.filter(item => item.type === "tag");

            getPowerNode(productName, deviceType, $).then(result => {
                //console.log("result", result)

                productName = result.productName;
                producent = productName.split(" ", 1)[0];
                let energyClassIdx = $("td:contains('Klasa energetyczna')").parent("tr").index();
                let noiseLevelIdx = $("td:contains('Poziom hałasu [dB]')").parent("tr").index();

                const { powerConsumptionIdx, powerConsumptionStandbyIdx, annualEnergyConsumptionIdx } = result
                //console.log(energyClassIdx, powerConsumptionIdx, powerConsumptionStandbyIdx, annualEnergyConsumptionIdx, noiseLevelIdx)

                if (energyClassIdx > 0) {
                    energyClass = powerNode[energyClassIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
                }

                if (powerConsumptionIdx > 0) {
                    powerConsumption = (powerNode[powerConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim());

                    if (deviceType === 'bluRay' || deviceType === 'homeTheaterSet' || deviceType === 'soundbar') {
                        powerConsumption = powerConsumption / 1000;
                        powerConsumption = Math.round(powerConsumption * 100) / 100;
                    }
                }

                if (powerConsumptionStandbyIdx > 0) {
                    powerConsumptionStandby = (powerNode[powerConsumptionStandbyIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim()) / 1000;
                    powerConsumptionStandby = Math.round(powerConsumptionStandby * 100) / 100;
                }

                if (annualEnergyConsumptionIdx > 0) {
                    annualEnergyConsumption = powerNode[annualEnergyConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
                    if (deviceType === 'fridge') {
                        powerConsumption = annualEnergyConsumption / 366;
                        powerConsumption = Math.round(annualEnergyConsumptionTemp * 100) / 100;
                    }
                }

                if (noiseLevelIdx > 0) {
                    noiseLevel = powerNode[noiseLevelIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
                }

                allData.push({
                    referral: "mediaExpert",
                    deviceType,
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

            }).catch((error) => { return error })

        } catch (error) { reject(error) }

    })

}

module.exports = { parseResponseHtml }