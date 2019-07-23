const mongoose = require('mongoose')

const dryerSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String }
},
    {
        collection: 'dryer'
    });

const DryerModel = mongoose.model('dryer', dryerSchema);

async function getAllData(){
    const result = await DryerModel.find({});
    {
        if (result){
            return result;
        }
    }

}

module.exports = {
    getAllData: getAllData,
    model: DryerModel
}