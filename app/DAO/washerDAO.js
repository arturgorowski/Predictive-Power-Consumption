const mongoose = require('mongoose')

const washerSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String }
},
    {
        collection: 'washer'
    });

const WasherModel = mongoose.model('washer', washerSchema);

async function getAllData(){
    const result = await WasherModel.find({});
    {
        if (result){
            return result;
        }
    }

}

module.exports = {
    getAllData: getAllData,
    model: WasherModel
}