const cheerio = require('cheerio');

/**
 * 
 * klasa parsująca obiekt html na informacje zużyciu energii podanym przez producenta
 */
// class ParseResponseHtmlMediaMarkt {
//     constructor() {

//     }

/**
 * zwraca nazwę produktu i miejsce gdzie znaduje się informacja
 * o poborze mocy oraz hałasie w zależności od parsowanego urządzenia
 */
function getPowerNode(productName, deviceType, div) {

    return new Promise((resolve, reject) => {
        try {
            switch (deviceType) {
                case 'bluRay':
                    productName = productName.slice(8);
                    powerNode = div[0].childNodes[9];
                    resolve({ productName, powerNode });
                    break;

                case 'cooker':
                    productName = productName.slice(8);
                    powerNode = div[0].childNodes[3];
                    noiseNode = div[0].childNodes[1];
                    resolve({ productName, powerNode, noiseNode });
                    break;

                case 'dryer':
                    productName = productName.slice(9);
                    powerNode = div[0].childNodes[3];
                    noiseNode = div[0].childNodes[1];
                    resolve({ productName, powerNode, noiseNode });
                //break;

                case 'fridge':
                    productName.split(" ", 1)[0].length === 7 ? productName = productName.slice(8) : productName = productName.slice(11)
                    powerNode = div[0].childNodes[3];
                    noiseNode = div[0].childNodes[1];
                    resolve({ productName, powerNode, noiseNode });
                    break;

                case 'homeTheaterSet':
                    productName = productName.slice(12);
                    powerNode = div[0].childNodes[13];
                    resolve({ productName, powerNode });
                    break;

                case 'oven':
                    productName = productName.slice(10);
                    powerNode = div[0].childNodes[5];
                    resolve({ productName, powerNode });
                    break;

                case 'soundbar':
                    productName = productName.slice(9);
                    powerNode = div[0].childNodes[11];
                    resolve({ productName, powerNode });
                    break;

                case 'tv':
                    productName = productName.slice(10);
                    powerNode = div[0].childNodes[13];
                    resolve({ productName, powerNode });
                    break;

                case 'washer':
                    productName = productName.slice(9);
                    powerNode = div[0].childNodes[3];
                    noiseNode = div[0].childNodes[1];
                    resolve({ productName, powerNode, noiseNode });
                    break;

                case 'washerDryer':
                    productName.split(" ", 1)[0].length === 6 ? productName = productName.slice(7) : productName = productName.slice(16)
                    energyClassNode = div[0].childNodes[3];
                    powerNode = div[0].childNodes[5];
                    noiseNode = div[0].childNodes[1];
                    resolve({ productName, powerNode, noiseNode, energyClassNode });
                    break;

                case 'washingMachine':
                    productName = productName.slice(7);
                    energyClassNode = div[0].childNodes[3];
                    powerNode = div[0].childNodes[5];
                    noiseNode = div[0].childNodes[1];
                    resolve({ productName, powerNode, noiseNode, energyClassNode });
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
            let div = $('div.m-offerShowData');
            let productName = $("h1.m-typo.m-typo_primary").text().trim();

            getPowerNode(productName, deviceType, div).then(result => {
                //console.log("result", result)

                productName = result.productName;
                powerNode = result.powerNode;
                noiseNode = result.noiseNode ? result.noiseNode : undefined;
                energyClassNode = result.energyClassNode ? result.energyClassNode : undefined;
                producent = productName.split(" ", 1)[0];

                if (powerNode !== undefined) powerNode.children.forEach((item, k) => {
                    if (item.type !== "text") {

                        let dt = $(item).find("dt").text().trim();


                        //cooker, dryer, fridge, oven, tv, washer
                        if (dt === 'Klasa energetyczna') energyClass = $(item).find("dd").text().trim();

                        //bluRay, homeTheaterSet, soundbar >>>>>>> W => kWh
                        if (dt === 'Pobór mocy [W]') powerConsumption = (Number($(item).find("dd").text().trim())) / 1000;
                        if (dt === 'Pobór mocy (czuwanie) [W]') powerConsumptionStandby = (Number($(item).find("dd").text().trim())) / 1000;

                        //cooker, oven, washer, dryer, washer >>>>>>> kwh
                        if (dt === 'Zużycie energii przy standardowym obciążeniu w trybie tradycyjnym [kWh/cykl]') powerConsumption = Number($(item).find("dd").text().trim());
                        if (dt === 'Zużycie energii na rok [kWh]') annualEnergyConsumption = Number($(item).find("dd").text().trim())

                        //dryer, washer >>>>>>> W => kWh
                        if (dt === 'Zużycie energii w trybie czuwania [W]') powerConsumptionStandby = (Number($(item).find("dd").text().trim())) / 1000;

                        //fridge >>>>>>> kWh
                        if (dt === 'Zużycie energii [kWh/rok]') {
                            annualEnergyConsumption = Number($(item).find("dd").text().trim());

                            powerConsumption = annualEnergyConsumption / 366
                            powerConsumption = Math.round(powerConsumption * 100) / 100 
                        }

                        //oven >>>>>>> kWh
                        if (dt === 'Zużycie energii przy grzaniu konwencjonalnym (kWh)') powerConsumption = Number($(item).find("dd").text().trim());

                        //tv >>>>>>> W => kWh
                        if (dt === 'Pobór mocy (IEC 62087 Edition 2) [W]') powerConsumption = (Number($(item).find("dd").text().trim())) / 1000;
                        if (dt === 'Pobór mocy w trybie czuwania [W]') powerConsumptionStandby = (Number($(item).find("dd").text().trim())) / 1000;
                        if (dt === 'Roczne zużycie energii [kWh]') annualEnergyConsumption = Number($(item).find("dd").text().trim()) //kWh;

                        //washer >>>>>>> kWh
                        if (dt === 'Zużycie energii na cykl [kWh]') powerConsumption = Number($(item).find("dd").text().trim());

                        //washerDryer >>>>>>> kWh
                        if (dt === 'Zużycie energii na cykl (pranie i wirowanie) [kWh]') powerConsumption = Number($(item).find("dd").text().trim());
                        if (dt === 'Zużycie energii na rok (pranie, wirowanie i suszenie [kWh]') annualEnergyConsumption = Number($(item).find("dd").text().trim());

                        //washingMachine >>>>>>> W => kWh
                        if (dt === 'Energii w trybie czuwania [W]') powerConsumptionStandby = (Number($(item).find("dd").text().trim())) / 1000;
                        if (dt === 'Energii na rok [kWh]') annualEnergyConsumption = Number($(item).find("dd").text().trim()) //kWh;

                    }

                });

                if (noiseNode !== undefined) noiseNode.children.forEach((item, k) => {
                    if (item.type !== "text") {
                        let dt = $(item).find("dt").text().trim();

                        //cooker, dryer, fridge, washer
                        if (dt === 'Poziom hałasu [dB]') noiseLevel = $(item).find("dd").text().trim()

                        //washerDryer, washingMachine
                        if (dt === 'Poziom hałasu podczas wirowania [dB]') noiseLevel = $(item).find("dd").text().trim();
                    }
                });

                if (energyClassNode !== undefined) energyClassNode.children.forEach((item, k) => {
                    if (item.type !== "text") {
                        let dt = $(item).find("dt").text().trim();

                        //washerDryer, washingMachine
                        if (dt === 'Klasa energetyczna') energyClass = $(item).find("dd").text().trim();
                    }
                });

                allData.push({
                    referral: "mediaMarkt",
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

            //resolve(allData);

        } catch (error) { reject(error) }

    })

}

//}

//module.exports = { ParseResponseHtmlMediaMarkt }
module.exports = { parseResponseHtml }