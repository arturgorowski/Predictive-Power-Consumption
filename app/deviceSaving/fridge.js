const DeviceListUrlScrapper = require('../app').DeviceListUrlScrapper;
const DeviceListParser = require('../app').DeviceListParser;
//let allUrlData = require('../allUrlData');
const mongoose = require('mongoose');

const FridgeModel = require('../DAO/fridgeDAO').model;

mongoose.connect('mongodb://localhost/predictivePowerConsumption', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

// let parseResponseHtmlMediaMarkt = require('../mediaMarkt/fridge').parseResponseHtml;
// let parseResponseHtmlMediaExpert = require('../mediaExpert/fridge').parseResponseHtml;
// let parseResponseHtmlEuroRtvAgd = require('../euroRtvAgd/fridge').parseResponseHtml;

const url1 = 'https://mediamarkt.pl/agd/lodowki-i-zamrazarki?limit=100&page=';
const url2 = 'https://www.mediaexpert.pl/lodowki?per_page=50&start=';
const url3 = 'https://www.euro.com.pl/lodowki.bhtml?link=mainnavi';

const url4 = 'https://www.mediaexpert.pl/zamrazarki?per_page=50&start=';
const url5 = 'https://www.euro.com.pl/zamrazarki.bhtml?link=mainnavi';

const request1 = new DeviceListUrlScrapper(url1);
const request2 = new DeviceListUrlScrapper(url2);
const request3 = new DeviceListUrlScrapper(url3);
// const request4 = new DeviceListUrlScrapper(url4);
// const request5 = new DeviceListUrlScrapper(url5);

let allUrlData = [];
const listScrapper = new DeviceListParser();
let addresses = [];

/**
 * 
 * zapis nazw i adresów URL do bazy danych
 */
Promise.all([request1.getScrapperHtmlTab(), request2.getScrapperHtmlTab(), request3.getScrapperHtmlTab()/*, request4.getScrapperHtmlTab(), request5.getScrapperHtmlTab()*/]).then(promises => {
    
    console.log(">>>> ALL PROMISES ENDED", promises)

    let pop1 = promises.pop();
    let pop2 = promises.pop();
    let pop3 = promises.pop();
    // let pop4 = promises.pop();
    // let pop5 = promises.pop();

    for (let i = 0; i <= pop2.length; i++) {
        if (pop1[i] !== undefined) allUrlData.push(pop1[i]);
        if (pop2[i] !== undefined) allUrlData.push(pop2[i]);
        if (pop3[i] !== undefined) allUrlData.push(pop3[i]);
        // if (pop4[i] !== undefined) allUrlData.push(pop4[i]);
        // if (pop5[i] !== undefined) allUrlData.push(pop5[i]);
    }

    console.log("all data popped", allUrlData)

    allUrlData.forEach((item) => {
        let object = new FridgeModel({name: item.name, address: item.address, shop: item.shop})
        //console.log(object)
        object.save();
    })

    console.log("adding data succesful");

}).catch(error => {
    return error
})
