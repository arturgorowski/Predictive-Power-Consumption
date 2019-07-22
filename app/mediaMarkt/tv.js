const cheerio = require('cheerio');
//let allData = require('../allUrlData');

// const allData = [];
let energyClass = '',
    powerConsumption = '',
    powerConsumptionStandby = '',
    annualEnergyConsumption = '';

// const url = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory?limit=100&page=';
// const url = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory';

//let id = 1;

/**
 * 
 * funkcja parsująca obiekt html na informacje zużyciu energii podanym przez producenta
 */
const parseResponseHtml = (html) => {
    return new Promise((resolve, reject) => {
        try {

            const allData = [];
            // let len = (html.length) / 2

            // for (let i = len; i < html.length; i++) {
            //     const $ = cheerio.load(html[i])
            const $ = cheerio.load(html)
            //console.log(html)
            let div = $('div.m-offerShowData')
            let attrProductName = $("h1.m-typo.m-typo_primary").text().trim()
            //console.log("div >>>", div)
            const powerNode = div[0].childNodes[13];
            //console.log("powerNode >>>", powerNode)

            powerNode.children.forEach((item, k) => {
                if (item.type !== "text") {

                    let dt = $(item).find("dt").text().trim()
                    if (dt === 'Klasa energetyczna') energyClass = $(item).find("dd").text().trim()
                    if (dt === 'Pobór mocy (IEC 62087 Edition 2) [W]') powerConsumption = Number($(item).find("dd").text().trim()) + ' W';
                    if (dt === 'Pobór mocy w trybie czuwania [W]') powerConsumptionStandby = Number($(item).find("dd").text().trim()) + ' W';
                    if (dt === 'Roczne zużycie energii [kWh]') annualEnergyConsumption = Number($(item).find("dd").text().trim()) +' kWh';
                    //if (dt === 'Rodzaj zasilania') powerType = $(item).find("dd").text().trim()
                }
            })

            allData.push({
                //id,
                referral: "mediaMarkt",
                tvName: attrProductName,
                energyClass,
                powerConsumption,
                powerConsumptionStandby,
                annualEnergyConsumption,
                //powerType
            })

            resolve(allData)

            //id++
            //}


        } catch (error) {
            reject(error);
        }
    })
}

module.exports = { parseResponseHtml };