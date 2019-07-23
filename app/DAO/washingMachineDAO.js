const mongoose = require('mongoose');

const washingMachineSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String }
},
    {
        collection: 'washingMachine'
    });

const WashingMachineModel = mongoose.model('washingMachine', washingMachineSchema);

async function getAllData() {
    const result = await WashingMachineModel.find({});
    {
        if (result) {
            //console.log(result)
            return result;
        }
    }
}

module.exports = {
    getAllData: getAllData,
    model: WashingMachineModel
};