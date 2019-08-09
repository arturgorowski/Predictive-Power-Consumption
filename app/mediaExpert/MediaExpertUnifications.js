
/**
 * Unifikacja jednostek ze sklepu media expert
 */
class MediaExpertUnification {
    constructor() {

    }

    unificate(element) {
        console.log('unificate', element)
        return new Promise((resolve, reject) => {
            resolve(element)
        })
    }
}

module.exports = { MediaExpertUnification }