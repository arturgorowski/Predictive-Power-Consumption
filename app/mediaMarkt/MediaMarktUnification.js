
/**
 * Unifikacja jednostek ze sklepu media markt
 */
class MediaMarktUnification {
    constructor() {

    }

    unificate(element) {
        console.log('unificate', element)

        return new Promise((resolve, reject) => {

            switch (element.devicType) {

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
            
            resolve(element)
        })
    }

}

module.exports = { MediaMarktUnification }