const mongoose = require('mongoose')

const ovenSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String }
},
    {
        collection: 'oven'
    });

const OvenModel = mongoose.model('oven', ovenSchema);

async function getAllData() {
    const result = await OvenModel.find({});
    {
        if (result) {
            return result;
        }
    }

}

module.exports = {
    getAllData: getAllData,
    model: OvenModel
}