const mongoose = require('mongoose');

const getAllData = require('../DAO/devicesDAO').getAllData;
const NewDevicesModel = require('../DAO/devicesDAO').model2;
mongoose.connect('mongodb://localhost/predictivePowerConsumption', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

let allDevices = [];
let duplicateDevice = [];
let noDuplicateDevice = [];

function removeDuplicates(originalArray, prop) {
    let newArray = [];
    let lookupObject = {};

    for (let i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

getAllData().then((result) => {

    result.forEach(element => {
        allDevices.push({
            name: element.name,
            address: element.address,
            shop: element.shop,
            type: element.type,
            model: element.model 
        });
    });

    let uniqueArray = removeDuplicates(allDevices, "model");

    uniqueArray.forEach((element) => {
        let object = new NewDevicesModel({
            name: element.name,
            address: element.address,
            shop: element.shop,
            type: element.type,
            model: element.model
        })
        object.save();
    })
    console.log(uniqueArray);

}).catch(error => {
    console.log("ERR getAllData >>>", error)
    return error;
})


