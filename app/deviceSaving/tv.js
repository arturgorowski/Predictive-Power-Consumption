const DeviceListUrlScrapper = require('../app').DeviceListUrlScrapper;
const DeviceListParser = require('../app').DeviceListParser;
let allUrlData = require('../allUrlData');
const mongoose = require('mongoose');

const TvModel = require('../DAO/tvDAO').model;
mongoose.connect('mongodb://localhost/predictivePowerConsumption', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

let parseResponseHtmlMediaMarkt = require('../mediaMarkt/tv').parseResponseHtml;
let parseResponseHtmlMediaExpert = require('../mediaExpert/tv').parseResponseHtml;
let parseResponseHtmlEuroRtvAgd = require('../euroRtvAgd/tv').parseResponseHtml;

const url1 = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory?limit=100&page=';
const url2 = 'https://www.mediaexpert.pl/telewizory?per_page=50&start=';
const url3 = 'https://www.euro.com.pl/telewizory-led-lcd-plazmowe.bhtml?link=mainnavi';

const request1 = new DeviceListUrlScrapper(url1);
const request2 = new DeviceListUrlScrapper(url2);
const request3 = new DeviceListUrlScrapper(url3);

const listScrapper = new DeviceListParser();
let addresses = [];


/**
 * 
 * zapis nazw i adresów URL do bazy danych
 */
Promise.all([request1.getScrapperHtmlTab(), request2.getScrapperHtmlTab(), request3.getScrapperHtmlTab()]).then(promises => {

    console.log(">>>> ALL PROMISES ENDED", promises)

    let pop1 = promises.pop();
    let pop2 = promises.pop();
    let pop3 = promises.pop();

    for (let i = 0; i < pop1.length; i++) {
        if (pop1[i] !== undefined) allUrlData.push(pop1[i]);
        if (pop2[i] !== undefined) allUrlData.push(pop2[i]);
        if (pop3[i] !== undefined) allUrlData.push(pop3[i]);
    }

    console.log("all data popped", allUrlData)

    allUrlData.forEach((item) => {
        let object = new TvModel({name: item.name, address: item.address, shop: item.shop})
        //console.log(object)
        object.save();
    })

    console.log("adding data succesful");

    // return listScrapper.getScrapperList(allUrlData).then(htmlObject => {

    //     //console.log(htmlObject)
    //     let len = (htmlObject.length) / 2;

    //     for (let i = len; i < htmlObject.length; i++) {

    //         let htmlType;
    //         if (htmlObject[i].includes('https://mediamarkt.pl')) htmlType = 'mediamarkt';
    //         if (htmlObject[i].includes('https://www.mediaexpert.pl')) htmlType = 'mediaexpert';
    //         if (htmlObject[i].includes('https://www.euro.com.pl')) htmlType = 'eurortvagd';

    //         switch (htmlType) {

    //             case 'mediamarkt':
    //                 parseResponseHtmlMediaMarkt(htmlObject[i]);
    //                 break;

    //             case 'mediaexpert':
    //                 parseResponseHtmlMediaExpert(htmlObject[i]);
    //                 break;

    //             case 'eurortvagd':
    //                 parseResponseHtmlEuroRtvAgd(htmlObject[i]);
    //                 break;
    //         }
    //     }
    // })
}).catch(error => {
    return error
})
