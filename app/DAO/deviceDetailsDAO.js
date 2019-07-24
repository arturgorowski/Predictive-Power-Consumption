const mongoose = require('mongoose')

const deviceDetailsSchema = new mongoose.Schema({
    referral: { type: String },
    deviceType: { type: String },
    productName: { type: String },
    energyClass: { type: String },
    powerConsumption: { type: String },
    powerConsumptionStandby: { type: String },
    annualEnergyConsumption: { type: String },
    noiseLevel: { type: String },
    producent: { type: String }
},
    {
        collection: 'deviceDetails'
    });

const DeviceDetailsSchema = mongoose.model('deviceDetails', deviceDetailsSchema);

async function getAllData(deviceType, productName){
    const result = await DeviceDetailsSchema.find({ shop: deviceType, name: { $regex: '/'+productName+'$/' } });
    {
        if (result){
            return result;
        }
    }
}

module.exports = {
    getAllData: getAllData,
    model: DeviceDetailsSchema
}