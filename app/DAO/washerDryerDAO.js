const mongoose = require('mongoose')

const washerDryerSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String }
},
    {
        collection: 'washerDryer'
    });

const WasherDryerModel = mongoose.model('washerDryer', washerDryerSchema);

async function getAllData(){
    const result = await WasherDryerModel.find({});
    {
        if (result){
            return result;
        }
    }

}

module.exports = {
    getAllData: getAllData,
    model: WasherDryerModel
}