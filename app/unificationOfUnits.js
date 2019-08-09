const MediaMarktUnification = require('../app/mediaMarkt/MediaMarktUnification').MediaMarktUnification;
const MediaExpertUnification = require('../app/mediaExpert/MediaExpertUnification').MediaExpertUnification;
const EuroRtvAgdUnification = require('../app/euroRtvAgd/EuroRtvAgdUnification').EuroRtvAgdUnification;

/**
 * 
 * Ujednolicenie jednostek elektrycznych urządzeń parsowanych z media marktu etc...
 */
class UnificationOfUnits {

    constructor(devices) {
        this.devices = devices;
    }

    // TODO :
    // sparsowana tablica => detekcja urzadzenia => detekcja jednostki energii => zwrócenie jednostki w kWh

    getUnificateData(devices) {
        console.log(devices)

        let tableAfterUnification = []

        return new Promise((resolve, reject) => {

            devices.forEach(element => {

                return UnificationOfUnits.choiceShop(element[0].referral).unificate(element).then(result => {
                    tableAfterUnification.push(result)
                }).catch(err => { reject(err) })

            })
            resolve(tableAfterUnification)

        }).catch(err => { return err })
    }
}

/**
 * wybór klasy do unifikacji danych
 */
UnificationOfUnits.choiceShop = (referral) => {
    switch (referral) {
        case 'mediaMarkt':
            return new MediaMarktUnification();
        case 'mediaExpert':
            return new MediaExpertUnification();
        case 'euroRtvAgd':
            return new EuroRtvAgdUnification();
    }
}



module.exports = { UnificationOfUnits }