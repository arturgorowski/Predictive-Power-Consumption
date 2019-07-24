const DeviceListParser = require('../app').DeviceListParser;
const mongoose = require('mongoose');

const getAllData = require('../DAO/soundbarDAO').getAllData;
mongoose.connect('mongodb://localhost/predictivePowerConsumption', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

let parseResponseHtmlMediaMarkt = require('../mediaMarkt/parsers/soundbar').parseResponseHtml;
let parseResponseHtmlMediaExpert = require('../mediaExpert/parsers/soundbar').parseResponseHtml;
let parseResponseHtmlEuroRtvAgd = require('../euroRtvAgd/parsers/soundbar').parseResponseHtml;

const listScrapper = new DeviceListParser();
let allUrlData = [];
let allData = [];
//let allData = require('./allUrlData');

getAllData().then((result) => {
    //console.log("result >>>", result);

    result.forEach(element => {
        allUrlData.push({ name: element.name, address: element.address });
    });

    let objects = []
    for (let i = 0; i < allUrlData.length; i += 50) {
        let sliced = allUrlData.slice(i, i + 50)
        objects.push(sliced)
    }

    callingData(objects[1]).then((response) => {
        console.log("just right now >>>", response)
        allData.push(response)
    })

    // let request = objects.map((item) => {
    //     return new Promise((resolve, reject) => {
    //         return callingData(item).then((response) => {
    //             console.log("just right now", response)
    //             //allData.push(response)
    //             return resolve(response)
    //         }).catch(error => {
    //             reject(error)
    //         })
    //     })
    // })

    // console.log(request)

    // request.reduce((promiseChain, currentTask) => {
    //     return promiseChain
    //         .then(chainResults => currentTask
    //             .then(currentResult => chainResults = chainResults
    //                 .concat(currentResult))
    //         ).catch(err => {
    //             return err;
    //         });
    // }, Promise.resolve(request)).then(response => {
    //     console.log(">>> response laaast", response);
    //     allData.push(response)
    //     return response;
    // }).catch(err => {
    //     console.error(">>> ERR :: ", err);
    //     return err;
    // });

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
        return new Promise((resolve, reject) => {
            //console.log(htmlObject)
            let len = (htmlObject.length) / 2;
            for (let i = len; i < htmlObject.length; i++) {

                let htmlType = '';
                if (htmlObject[i].indexOf('mediamarkt') > -1) htmlType = 'mediamarkt';
                if (htmlObject[i].indexOf('Mediaexpert.pl') > -1) htmlType = 'mediaexpert';
                if (htmlObject[i].indexOf('www.euro.com.pl') > -1) htmlType = 'eurortvagd';

                switch (htmlType) {

                    case 'mediamarkt':
                        parseResponseHtmlMediaMarkt(htmlObject[i]).then(response => {
                            return allData.push(response);
                            //return response
                        }).catch(err => { reject(err) });
                        break;

                    case 'mediaexpert':
                        parseResponseHtmlMediaExpert(htmlObject[i]).then(response => {
                            //console.log(response);
                            return allData.push(response);
                            //return response
                        }).catch(err => { reject(err) });
                        break;

                    case 'eurortvagd':
                        parseResponseHtmlEuroRtvAgd(htmlObject[i]).then(response => {
                            return allData.push(response);
                            //return response
                        }).catch(err => { reject(err) });
                        break;
                }

            }
            resolve(allData);
            //console.log("all data >>>", allData)
            console.log("END >>>")
        }).catch(error => {
            return error
        })
    })
}