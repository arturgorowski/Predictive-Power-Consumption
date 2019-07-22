const mongoose = require('mongoose');

const soundbarSchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String }
},
    {
        collection: 'soundbar'
    });

const SoundbarModel = mongoose.model('soundbar', soundbarSchema);

async function getAllData() {
    const result = await SoundbarModel.find({});
    {
        if (result) {
            //console.log(result)
            return result;
        }
    }
}

module.exports = {
    getAllData: getAllData,
    model: SoundbarModel
};