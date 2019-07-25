const mongoose = require('mongoose')

const devicesPowerInformationSchema = new mongoose.Schema({
    referral: { type: String },
    deviceType: { type: String },
    productName: { type: String },
    energyClass: { type: String },
    powerConsumption: { type: String },
    powerConsumptionStandby: { type: String },
    annualEnergyConsumption: { type: String },
    noiseLevel: { type: String },
    producent: { type: String },
    model: { type: String }
},
    {
        collection: 'devicesPowerInformation'
    });

const DevicesPowerInformationModel = mongoose.model('devicesPowerInformation', devicesPowerInformationSchema);

async function getAllData() {
    const result = await DevicesPowerInformationModel.find({});
    {
        if (result) {
            return result;
        }
    }
}

module.exports = {
    getAllData: getAllData,
    model: DevicesPowerInformationModel
}