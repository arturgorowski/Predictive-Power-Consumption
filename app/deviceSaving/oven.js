const popingDevice = require('./popingDevice').popingDevice

const mongoose = require('mongoose');
const OvenModel = require('../DAO/ovenDAO').model;
mongoose.connect('mongodb://localhost/predictivePowerConsumption', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

const url1 = 'https://mediamarkt.pl/agd-do-zabudowy/piekarniki-do-zabudowy/piekarniki?limit=100&page='; //201
const url2 = 'https://www.mediaexpert.pl/piekarniki-do-zabudowy?per_page=50&start='; //392
const url3 = 'https://www.euro.com.pl/piekarniki-do-zabudowy.bhtml?link=mainnavi'; //274

/**
 * 
 * zapis nazw i adresów URL do bazy danych
 */
popingDevice(url1, url2, url3).then(response => {

    console.log(response)

    response.forEach((item) => {
        let object = new OvenModel({ name: item.name, address: item.address, shop: item.shop })
        object.save();
    })

    console.log("adding data succesful");
}).catch(err => {
    throw err
})