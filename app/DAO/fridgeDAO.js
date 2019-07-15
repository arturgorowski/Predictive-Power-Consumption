const mongoose = require('mongoose');

const fridgeSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String }
},
    {
        collection: 'fridge'
    });

const FridgeModel = mongoose.model('fridge', fridgeSchema);

async function getAllData() {
    const result = await FridgeModel.find({});
    {
        if (result) {
            //console.log(result)
            return result;
        }
    }
}

module.exports = {
    getAllData: getAllData,
    model: FridgeModel
};