const DeviceListUrlScrapper = require('./app').DeviceListUrlScrapper;
const DeviceListParser = require('./app').DeviceListParser;
//let allUrlData = require('./allUrlData');
const mongoose = require('mongoose');

const getAllData = require('./DAO/tvDAO').getAllData;
mongoose.connect('mongodb://localhost/predictivePowerConsumption', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

let parseResponseHtmlMediaMarkt = require('./mediaMarkt/tv').parseResponseHtml;
let parseResponseHtmlMediaExpert = require('./mediaExpert/tv').parseResponseHtml;
let parseResponseHtmlEuroRtvAgd = require('./euroRtvAgd/tv').parseResponseHtml;

const listScrapper = new DeviceListParser();
let allUrlData = [];
//let allData = [];
let allData = require('./allUrlData');


getAllData().then((result) => {
    console.log("result >>>", result);
    result.forEach(element => {
        allUrlData.push({ name: element.name, address: element.address });
    });
    let sliced = allUrlData.slice(1019)
    console.log(sliced)
    callingData(sliced);
}).catch(error => {
    console.log("ERR getAllData >>>", error)
    return error;
})

/**
 * 
 * pasruje adresy URL na obiekty <html>, następnie parsuje obiekty dla każdego urządzenia i zwraca informacje o poborze mocy
 */
function callingData(allUrlData) {
    return listScrapper.getScrapperList(allUrlData).then(htmlObject => {

        //console.log(htmlObject)
        let len = (htmlObject.length) / 2;
        for (let i = len; i < htmlObject.length; i++) {

            let htmlType = '';
            if (htmlObject[i].indexOf('mediamarkt') > -1) htmlType = 'mediamarkt';
            if (htmlObject[i].indexOf('Mediaexpert.pl') > -1) htmlType = 'mediaexpert';
            if (htmlObject[i].indexOf('www.euro.com.pl') > -1) htmlType = 'eurortvagd';


            switch (htmlType) {

                case 'mediamarkt':
                    parseResponseHtmlMediaMarkt(htmlObject[i]);
                    break;

                case 'mediaexpert':
                    parseResponseHtmlMediaExpert(htmlObject[i]);
                    break;

                case 'eurortvagd':
                    parseResponseHtmlEuroRtvAgd(htmlObject[i]);
                    break;
            }
        }
        console.log("all data >>>", allData)
        console.log("END >>>")
    }).catch(error => {
        return error
    })
}
