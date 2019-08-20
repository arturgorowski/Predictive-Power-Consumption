const popingDevice = require('./popingDevice').popingDevice

const mongoose = require('mongoose');
const CookerModel = require('../DAO/cookerDAO').model;
mongoose.connect('mongodb://localhost/predictivePowerConsumption', { useNewUrlParser: true });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

// const url1 = 'https://mediamarkt.pl/agd/kuchnie/kuchnie-z-plyta-indukcyjna?limit=100&page=';
// const url2 = 'https://mediamarkt.pl/agd/kuchnie/kuchnie-elektryczne?limit=100&page='; 
// const url3 = 'https://mediamarkt.pl/agd/kuchnie/kuchnie-gazowe?limit=100&page='; 

const url1 = 'https://mediamarkt.pl/agd/kuchnie/kuchnie-gazowo-elektryczne?limit=100&page='; //66
const url2 = 'https://www.mediaexpert.pl/kuchnie-wolnostojace?per_page=50&start='; //217
const url3 = 'https://www.euro.com.pl/kuchnie.bhtml?link=mainnavi'; //158

/**
 * 
 * zapis nazw i adresów URL do bazy danych
 */
popingDevice(url1, url2, url3).then(response => {

    console.log(response)

    response.forEach((item) => {
        let object = new CookerModel({ name: item.name, address: item.address, shop: item.shop })
        object.save();
    })

    console.log("adding data succesful");
}).catch(err => {
    throw err
})