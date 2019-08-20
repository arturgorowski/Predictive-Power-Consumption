const mongoose = require('mongoose')

const devicesSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String },
    type: { type: String },
    model: { type: String },
},
    {
        collection: 'devices'
    });
const DevicesModel = mongoose.model('devices', devicesSchema);

const newDevicesSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String },
    type: { type: String },
    model: { type: String },
},
    {
        collection: 'newDevices'
    });
const NewDevicesModel = mongoose.model('newDevices', newDevicesSchema);

async function getAllData() {
    const result = await NewDevicesModel.find({}); //DevicesModel
    {
        if (result) {
            return result;
        }
    } 
}

module.exports = {
    getAllData: getAllData,
    model: DevicesModel,
    model2: NewDevicesModel
}