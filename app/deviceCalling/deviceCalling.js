const DeviceListParser = require('../app').DeviceListParser;
const mongoose = require('mongoose');

const getAllData = require('../DAO/devicesDAO').getAllData;
mongoose.connect('mongodb://localhost/predictivePowerConsumption', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

let bluRayParserMediaMarkt = require('../mediaMarkt/parsers/bluRay').parseResponseHtml;
let bluRayParserMediaExpert = require('../mediaExpert/parsers/bluRay').parseResponseHtml;
let bluRayParserEuroRtvAgd = require('../euroRtvAgd/parsers/bluRay').parseResponseHtml;

let cookerParserMediaMarkt = require('../mediaMarkt/parsers/cooker').parseResponseHtml;
let cookerParserMediaExpert = require('../mediaExpert/parsers/cooker').parseResponseHtml;
let cookerParserEuroRtvAgd = require('../euroRtvAgd/parsers/cooker').parseResponseHtml;

let dryerParserMediaMarkt = require('../mediaMarkt/parsers/dryer').parseResponseHtml;
let dryerParserMediaExpert = require('../mediaExpert/parsers/dryer').parseResponseHtml;
let dryerParserEuroRtvAgd = require('../euroRtvAgd/parsers/dryer').parseResponseHtml;

let fridgeParserMediaMarkt = require('../mediaMarkt/parsers/fridge').parseResponseHtml;
let fridgeParserMediaExpert = require('../mediaExpert/parsers/fridge').parseResponseHtml;
let fridgeParserEuroRtvAgd = require('../euroRtvAgd/parsers/fridge').parseResponseHtml;

let homeTheaterSetParserMediaMarkt = require('../mediaMarkt/parsers/homeTheaterSet').parseResponseHtml;
let homeTheaterSetParserMediaExpert = require('../mediaExpert/parsers/homeTheaterSet').parseResponseHtml;
let homeTheaterSetParserEuroRtvAgd = require('../euroRtvAgd/parsers/homeTheaterSet').parseResponseHtml;

let ovenParserMediaMarkt = require('../mediaMarkt/parsers/oven').parseResponseHtml;
let ovenParserMediaExpert = require('../mediaExpert/parsers/oven').parseResponseHtml;
let ovenParserEuroRtvAgd = require('../euroRtvAgd/parsers/oven').parseResponseHtml;

let soundbarParserMediaMarkt = require('../mediaMarkt/parsers/soundbar').parseResponseHtml;
let soundbarParserMediaExpert = require('../mediaExpert/parsers/soundbar').parseResponseHtml;
let soundbarParserEuroRtvAgd = require('../euroRtvAgd/parsers/soundbar').parseResponseHtml;

let tvParserMediaMarkt = require('../mediaMarkt/parsers/tv').parseResponseHtml;
let tvParserMediaExpert = require('../mediaExpert/parsers/tv').parseResponseHtml;
let tvParserEuroRtvAgd = require('../euroRtvAgd/parsers/tv').parseResponseHtml;

let washerParserMediaMarkt = require('../mediaMarkt/parsers/washer').parseResponseHtml;
let washerParserMediaExpert = require('../mediaExpert/parsers/washer').parseResponseHtml;
let washerParserEuroRtvAgd = require('../euroRtvAgd/parsers/washer').parseResponseHtml;

let washerDryerParserMediaMarkt = require('../mediaMarkt/parsers/washerDryer').parseResponseHtml;
let washerDryerParserMediaExpert = require('../mediaExpert/parsers/washerDryer').parseResponseHtml;
let washerDryerParserEuroRtvAgd = require('../euroRtvAgd/parsers/washerDryer').parseResponseHtml;

let washingMachineParserMediaMarkt = require('../mediaMarkt/parsers/washingMachine').parseResponseHtml;
let washingMachineParserMediaExpert = require('../mediaExpert/parsers/washingMachine').parseResponseHtml;
let washingMachineParserEuroRtvAgd = require('../euroRtvAgd/parsers/washingMachine').parseResponseHtml;

const DevicesPowerInformationModel = require('../DAO/devicesDetailsDAO').model;
const listScrapper = new DeviceListParser();
let allUrlData = [];
let allData = [];
//let allData = require('./allUrlData');

getAllData().then((result) => {
    //console.log("result >>>", result);

    result.forEach(element => {
        allUrlData.push({ name: element.name, address: element.address, type: element.type, shop: element.shop, model: element.model });
    });

    let objects = []
    for (let i = 0; i < allUrlData.length; i += 35) {
        let sliced = allUrlData.slice(i, i + 35)
        objects.push(sliced)
    }

    console.log(">>>>", objects.length)

    //6, 8 nie poszło
    callingData(objects[9]).then((response) => {
        console.log("just right now >>>", response)

        //unification.UnificationOfUnits(response).then(result => {


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


        //})

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
            //console.log(htmlObject)
            let len = (htmlObject.length) / 2;
            let shopType;
            let parserType;
            for (let i = len; i < htmlObject.length; i++) {

                shopType = htmlObject[i].shop;
                parserType = htmlObject[i].type;
                model = htmlObject[i].model;

                if (shopType === "mediaMarkt") {
                    switch (parserType) {

                        case 'bluRay':
                            bluRayParserMediaMarkt(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'cooker':
                            cookerParserMediaMarkt(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'dryer':
                            dryerParserMediaMarkt(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'fridge':
                            fridgeParserMediaMarkt(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'homeTheaterSet':
                            homeTheaterSetParserMediaMarkt(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'oven':
                            ovenParserMediaMarkt(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'soundbar':
                            soundbarParserMediaMarkt(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'tv':
                            tvParserMediaMarkt(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'washer':
                            washerParserMediaMarkt(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'washerDryer':
                            washerDryerParserMediaMarkt(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'washingMachine':
                            washingMachineParserMediaMarkt(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;
                    }
                }


                if (shopType === "mediaExpert") {
                    switch (parserType) {

                        case 'bluRay':
                            bluRayParserMediaExpert(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'cooker':
                            cookerParserMediaExpert(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'dryer':
                            dryerParserMediaExpert(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'fridge':
                            fridgeParserMediaExpert(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'homeTheaterSet':
                            homeTheaterSetParserMediaExpert(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'oven':
                            ovenParserMediaExpert(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'soundbar':
                            soundbarParserMediaExpert(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'tv':
                            tvParserMediaExpert(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'washer':
                            washerParserMediaExpert(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'washerDryer':
                            washerDryerParserMediaExpert(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'washingMachine':
                            washingMachineParserMediaExpert(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;
                    }
                }



                if (shopType === "euroRtvAgd") {
                    switch (parserType) {

                        case 'bluRay':
                            bluRayParserEuroRtvAgd(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'cooker':
                            cookerParserEuroRtvAgd(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'dryer':
                            dryerParserEuroRtvAgd(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'fridge':
                            fridgeParserEuroRtvAgd(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'homeTheaterSet':
                            homeTheaterSetParserEuroRtvAgd(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'oven':
                            ovenParserEuroRtvAgd(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'soundbar':
                            soundbarParserEuroRtvAgd(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'tv':
                            tvParserEuroRtvAgd(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'washer':
                            washerParserEuroRtvAgd(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'washerDryer':
                            washerDryerParserEuroRtvAgd(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;

                        case 'washingMachine':
                            washingMachineParserEuroRtvAgd(htmlObject[i].response, model).then(response => {
                                return allData.push(response);
                                //return response
                            }).catch(err => { reject(err) });
                            break;
                    }
                }


            }
            //  TODO Unification
            // return unification.unification(allData).then(result => {
            //     resolve(result);
            // })
            resolve(allData);
            //console.log("all data >>>", allData)
            console.log("END >>>")
        }).catch(error => {
            return error
        })
    })
}