let responseHtmlMediaMarkt = require('../mediaMarkt/ParseResponseHtmlMediaMarkt').parseResponseHtml
let responseHtmlMediaExpert = require('../mediaExpert/ParseResponseHtmlMediaExpert').parseResponseHtml
let responseHtmlEuroRtvAgd = require('../euroRtvAgd/ParseResponseHtmlEuroRtvAgd').parseResponseHtml

const DeviceListParser = require('../app').DeviceListParser;
// const ParseResponseHtmlMediaMarkt = require('../mediaMarkt/ParseResponseHtmlMediaMarkt').ParseResponseHtmlMediaMarkt;
// const ParseResponseHtmlMediaExpert = require('../mediaExpert/ParseResponseHtmlMediaExpert').ParseResponseHtmlMediaExpert;
// const ParseResponseHtmlEuroRtvAgd = require('../euroRtvAgd/ParseResponseHtmlEuroRtvAgd').ParseResponseHtmlEuroRtvAgd;
const mongoose = require('mongoose');
const getAllData = require('../DAO/devicesDAO').getAllData;
mongoose.connect('mongodb://localhost/predictivePowerConsumption', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

const DevicesPowerInformationModel = require('../DAO/devicesDetailsDAO').model;
const listScrapper = new DeviceListParser();
// const mediaMarktParser = new ParseResponseHtmlMediaMarkt();
// const mediaExpertParser = new ParseResponseHtmlMediaExpert();
// const euroRtvAgdParser = new ParseResponseHtmlEuroRtvAgd();

let allUrlData = [];
let allData = [];

getAllData().then((result) => {
    //console.log("result >>>", result);

    result.forEach(element => {
        allUrlData.push({ name: element.name, address: element.address, type: element.type, shop: element.shop, model: element.model });
    });

    let objects = []
    for (let i = 0; i < allUrlData.length; i += 20) {
        let sliced = allUrlData.slice(i, i + 20)
        objects.push(sliced)
    }

    console.log(">>>>", objects.length)

    //6, 8 nie poszło
    callingData(objects[ 16 ]).then((response) => {
        console.log("just right now >>>", response)

        //allData.push(response)
        response.forEach((item) => {

            let object = new DevicesPowerInformationModel({
                referral: item[0].referral,
                deviceType: item[0].deviceType,
                productName: item[0].productName,
                energyClass: item[0].energyClass,
                powerConsumption: item[0].powerConsumption,
                powerConsumptionStandby: item[0].powerConsumptionStandby,
                annualEnergyConsumption: item[0].annualEnergyConsumption,
                noiseLevel: item[0].noiseLevel,
                producent: item[0].producent,
                model: item[0].model
            })
            object.save();

        })
        console.log("adding data succesfull")

    })

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

            let len = (htmlObject.length) / 2;
            let shopType, deviceType;
            for (let i = len; i < htmlObject.length; i++) {

                shopType = htmlObject[i].shop;
                deviceType = htmlObject[i].type;
                model = htmlObject[i].model;

                if (shopType === 'mediaMarkt') {

                    responseHtmlMediaMarkt(htmlObject[i].response, model, deviceType).then(response => {
                        return allData.push(response);
                    }).catch(err => { reject(err) });

                }

                if (shopType === 'mediaExpert') {

                    responseHtmlMediaExpert(htmlObject[i].response, model, deviceType).then(response => {
                        return allData.push(response);
                    }).catch(err => { reject(err) });

                }

                if (shopType === 'euroRtvAgd') {

                    responseHtmlEuroRtvAgd(htmlObject[i].response, model, deviceType).then(response => {
                        return allData.push(response);
                    }).catch(err => { reject(err) });

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