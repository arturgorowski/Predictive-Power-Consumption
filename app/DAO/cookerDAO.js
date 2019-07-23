const mongoose = require('mongoose')

const cookerSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String }
},
    {
        collection: 'cooker'
    });

const CookerModel = mongoose.model('cooker', cookerSchema);

async function getAllData() {
    const result = await CookerModel.find({});
    {
        if (result) {
            return result;
        }
    }

}

module.exports = {
    getAllData: getAllData,
    model: CookerModel
}