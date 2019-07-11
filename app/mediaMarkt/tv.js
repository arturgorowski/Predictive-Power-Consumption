const cheerio = require('cheerio');

const data = [];
let energyClass = '',
    powerConsumption = '',
    powerConsumptionStandby = '',
    annualEnergyConsumption = '';

// const url = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory?limit=100&page=';
// const url = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory';

// const request = new DeviceListUrlScrapper(url);

// request.getScrapperHtmlTab()
//     .then(result => {
//         //console.log(result)
//         parseResponseHtml(result)
//     })
//     .catch(error => {
//         return error
//     })

// Promise.all([(new DeviceListUrlScrapper(url1)).getScrapperHtmlTab(), (new DeviceListUrlScrapper(url2)).getScrapperHtmlTab(),
//     (new DeviceListUrlScrapper(url3)).getScrapperHtmlTab()]).then(promises=>{


//             console.log(">>>> ALL PROMISES ENDED", promises)
//             // poped tab

//     })

//let id = 1;
const parseResponseHtml = (html) => {
    try {
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
                if (dt === 'Pobór mocy (IEC 62087 Edition 2) [W]') powerConsumption = Number($(item).find("dd").text().trim())
                if (dt === 'Pobór mocy w trybie czuwania [W]') powerConsumptionStandby = Number($(item).find("dd").text().trim())
                if (dt === 'Roczne zużycie energii [kWh]') annualEnergyConsumption = Number($(item).find("dd").text().trim())
                //if (dt === 'Rodzaj zasilania') powerType = $(item).find("dd").text().trim()
            }
        })

        data.push({
            //id,
            tvName: attrProductName,
            energyClass,
            powerConsumption,
            powerConsumptionStandby,
            annualEnergyConsumption,
            //powerType
        })

        //id++
    //}
    } catch (error) {
    throw error
}
console.log(">>> data", data)
}

module.exports = { parseResponseHtml };