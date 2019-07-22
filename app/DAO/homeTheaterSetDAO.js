const mongoose = require('mongoose');

const homeTheaterSetSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String }
},
    {
        collection: 'homeTheaterSet'
    });

const HomeTheaterSetModel = mongoose.model('homeTheaterSet', homeTheaterSetSchema);

async function getAllData() {
    const result = await HomeTheaterSetModel.find({});
    {
        if (result) {
            //console.log(result)
            return result;
        }
    }
}

module.exports = {
    getAllData: getAllData,
    model: HomeTheaterSetModel
};