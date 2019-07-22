const DeviceListUrlScrapper = require('../app').DeviceListUrlScrapper;
let allUrlData = [];

/**
 * 
 * pomieszanie urządzeń z różnych sklepów
 */
function popingDevice(url1, url2, url3) {

    const request1 = new DeviceListUrlScrapper(url1);
    const request2 = new DeviceListUrlScrapper(url2);
    const request3 = new DeviceListUrlScrapper(url3);

    return Promise.all([request1.getScrapperHtmlTab(), request2.getScrapperHtmlTab(), request3.getScrapperHtmlTab()]).then(promises => {

        console.log(">>>> ALL PROMISES ENDED", promises);

        let pop1 = promises.pop();
        let pop2 = promises.pop();
        let pop3 = promises.pop();

        for (let i = 0; i <= pop2.length; i++) {
            if (pop1[i] !== undefined) allUrlData.push(pop1[i]);
            if (pop2[i] !== undefined) allUrlData.push(pop2[i]);
            if (pop3[i] !== undefined) allUrlData.push(pop3[i]);
        }

        console.log("all data popped", allUrlData)

        return allUrlData;

    }).catch(error => {
        return error;
    })
}

module.exports = { popingDevice }