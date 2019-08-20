const cheerio = require('cheerio');

/**
 * zwraca nazwę produktu i miejsce gdzie znaduje się informacja
 * o poborze mocy oraz hałasie w zależności od parsowanego urządzenia
 */
function getPowerNode(deviceType, $) {

    return new Promise((resolve, reject) => {
        try {
            switch (deviceType) {
                case 'bluRay':
                    powerConsumptionIdx = $("td:contains('Pobór mocy')").parent("tr").index();

                    resolve({ powerConsumptionIdx });
                    break;

                case 'cooker':
                    powerConsumptionIdx = $("td:contains('Zużycie energii - cykl')").parent("tr").index();
                    annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie prądu')").parent("tr").index();

                    resolve({ powerConsumptionIdx, annualEnergyConsumptionIdx });
                    break;

                case 'dryer':
                    powerConsumptionIdx = $("td:contains('Zużycie energii załadunek pełny / częściowy')").parent("tr").index();
                    annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie prądu')").parent("tr").index();

                    resolve({ powerConsumptionIdx, annualEnergyConsumptionIdx });
                    break;

                case 'fridge':
                    annualEnergyConsumptionIdx1 = $("td:contains('Roczne zużycie energii')").parent("tr").index();
                    annualEnergyConsumptionIdx2 = $("td:contains('Roczne zużycie prądu')").parent("tr").index();
                    annualEnergyConsumptionIdx = annualEnergyConsumptionIdx1 > 0 ? annualEnergyConsumptionIdx1 : annualEnergyConsumptionIdx2

                    resolve({ annualEnergyConsumptionIdx });
                    break;

                case 'homeTheaterSet':
                    powerConsumptionIdx = $("td:contains('Pobór mocy')").parent("tr").index();

                    resolve({ powerConsumptionIdx });
                    break;

                case 'oven':
                    powerConsumptionIdx = $("td:contains('Zużycie energii - cykl')").parent("tr").index();
                    annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie prądu')").parent("tr").index();

                    resolve({ powerConsumptionIdx, annualEnergyConsumptionIdx });
                    break;

                case 'soundbar':
                    powerConsumptionIdx = $("td:contains('Pobór mocy')").parent("tr").index();
                    powerConsumptionStandbyIdx = $("td:contains('Pobór mocy w trybie gotowości')").parent("tr").index();

                    resolve({ powerConsumptionIdx, powerConsumptionStandbyIdx });
                    break;

                case 'tv':
                    powerConsumptionIdx = $("td:contains('Pobór mocy IEC 62087 Ed.2 (tryb włączenia)')").parent("tr").index();
                    powerConsumptionStandbyIdx = $("td:contains('Pobór mocy (tryb czuwania)')").parent("tr").index();
                    annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie energii')").parent("tr").index();

                    resolve({ powerConsumptionIdx, annualEnergyConsumptionIdx, powerConsumptionStandbyIdx });
                    break;

                case 'washer':
                    powerConsumptionIdx = $("td:contains('Zużycie energii - cykl')").parent("tr").index();
                    annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie prądu')").parent("tr").index();

                    resolve({ powerConsumptionIdx, annualEnergyConsumptionIdx });
                    break;

                case 'washerDryer':
                    powerConsumptionIdx = $("td:contains('Zużycie prądu pranie')").parent("tr").index();

                    resolve({ powerConsumptionIdx });
                    break;

                case 'washingMachine':
                    powerConsumptionIdx = $("td:contains('Zużycie prądu')").parent("tr").index();
                    annualEnergyConsumptionIdx = $("td:contains('Roczne zużycie prądu')").parent("tr").index();
                    noiseLevelIdx = $("td:contains('Poziom hałasu (pranie/wirowanie)')").parent("tr").index();

                    resolve({ powerConsumptionIdx, annualEnergyConsumptionIdx, noiseLevelIdx });
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
            let attrProductName = $("h1.selenium-KP-product-name");
            let div = $('table.description-tech-details.js-tech-details');
            const powerNode = div[0].childNodes[1].children.filter(item => item.type === "tag");


            getPowerNode(deviceType, $).then(result => {
                //console.log("result", result)

                let energyClassIdx = $("td:contains('Klasa energetyczna')").parent("tr").index();
                let noiseLevelIdx = $("td:contains('Poziom hałasu')").parent("tr").index();
                powerConsumptionIdx = result.powerConsumptionIdx;
                powerConsumptionStandbyIdx = result.powerConsumptionStandbyIdx;
                annualEnergyConsumptionIdx = result.annualEnergyConsumptionIdx;

                productName = attrProductName[0].childNodes[0].nodeValue.trim();
                producent = productName.split(" ", 1)[0];
                noiseLevelIdx = noiseLevelIdx > 0 ? noiseLevelIdx : result.noiseLevelIdx

                //console.log(">>>>", energyClassIdx, powerConsumptionIdx, powerConsumptionStandbyIdx, annualEnergyConsumptionIdx, noiseLevelIdx)

                if (powerConsumptionIdx > 0) {
                    powerConsumption = powerNode[powerConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
                    // let temp = powerConsumption("contains('kWh')");
                    // let temp1 = powerConsumption.indexOf("W");
                    let powerInfo = powerConsumption
                    powerConsumption = powerConsumption.split(" ", 1)[0];

                    if (deviceType === 'bluRay' || deviceType === 'homeTheaterSet' || deviceType === 'soundbar') {
                        let n = powerInfo.indexOf("W");
                        powerConsumption = (powerInfo.slice(0, n + 1)) / 1000;
                        powerConsumptionStandby = (powerInfo.slice(n + 4)) / 1000;
                    }

                }

                if (energyClassIdx > 0) {
                    energyClass = powerNode[energyClassIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
                }

                if (noiseLevelIdx > 0) {
                    noiseLevel = powerNode[noiseLevelIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
                    noiseLevel = noiseLevel.split(" ", 1)[0];
                }

                if (annualEnergyConsumptionIdx > 0) {
                    annualEnergyConsumption = powerNode[annualEnergyConsumptionIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim();
                    annualEnergyConsumption = annualEnergyConsumption.split(" ", 1)[0];

                    if (deviceType === 'fridge') {
                        powerConsumption = annualEnergyConsumption / 366;
                        powerConsumption = Math.round(powerConsumption * 100) / 100;
                    }

                }

                if (powerConsumptionStandbyIdx > 0) {
                    powerConsumptionStandby = (powerNode[powerConsumptionStandbyIdx].children.filter(item => item.type === "tag")[1].children[0].nodeValue.trim());
                    powerConsumptionStandby = powerConsumptionStandby.split(" ", 1)[0];
                    powerConsumptionStandby = powerConsumptionStandby / 1000;
                }

                allData.push({
                    referral: "euroRtvAgd",
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
                //console.log(allData);
                resolve(allData);

            }).catch((error) => { return error })

        } catch (error) { reject(error) }

    })

}

module.exports = { parseResponseHtml }