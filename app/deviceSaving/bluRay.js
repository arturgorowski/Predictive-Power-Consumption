const popingDevice = require('./popingDevice').popingDevice

const mongoose = require('mongoose');
const BluRayModel = require('../DAO/bluRayDAO').model;
mongoose.connect('mongodb://localhost/predictivePowerConsumption', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

const url1 = 'https://mediamarkt.pl/rtv-i-telewizory/kino-domowe/odtwarzacze-blu-ray?limit=100&page=';
const url2 = 'https://www.mediaexpert.pl/zestawy-kina-domowego?per_page=50&start=';
const url3 = 'https://www.euro.com.pl/odtwarzacze-blu-ray.bhtml?link=mainnavi';

/**
 * 
 * zapis nazw i adresów URL do bazy danych
 */
popingDevice(url1, url2, url3).then(response => {

    console.log(response)

    response.forEach((item) => {
        let object = new BluRayModel({ name: item.name, address: item.address, shop: item.shop })
        object.save();
    })

    console.log("adding data succesful");
}).catch(err => {
    throw err
})