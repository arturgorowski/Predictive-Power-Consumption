const popingDevice = require('./popingDevice').popingDevice

const mongoose = require('mongoose');
const WasherModel = require('../DAO//washerDAO').model;
mongoose.connect('mongodb://localhost/predictivePowerConsumption', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

const url1 = 'https://mediamarkt.pl/agd-do-zabudowy/zmywarki-do-zabudowy/zmywarki-do-zabudowy?limit=100&page=';
const url2 = 'https://www.mediaexpert.pl/zmywarki-do-zabudowy?per_page=50&start=';
const url3 = 'https://www.euro.com.pl/zmywarki-do-zabudowy.bhtml?link=mainnavi';

/**
 * 
 * zapis nazw i adresów URL do bazy danych
 */
popingDevice(url1, url2, url3).then(response => {

    console.log(response)

    response.forEach((item) => {
        let object = new WasherModel({ name: item.name, address: item.address, shop: item.shop })
        object.save();
    })

    console.log("adding data succesful");
}).catch(err => {
    throw err
})