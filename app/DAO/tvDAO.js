const mongoose = require('mongoose');

const tvSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String }
},
    {
        collection: 'tv'
    });

const TvModel = mongoose.model('tv', tvSchema);

// function createNew(data) {
//     return Promise.resolve().then(() => {
//         return new TvModel(data).save().then(result => {
//             return result;
//         });
//     });
// }

async function getAllData() {
    const result = await TvModel.find({});
    {
        if (result) {
            //console.log(result)
            return result;
        }
    }
}

module.exports = {
    getAllData: getAllData,
    model: TvModel
};