const mongoose = require('mongoose')

const bluRaySchema = new mongoose.Schema({
    name: { type: String },
    address: { type: String },
    shop: { type: String }
},
    {
        collection: 'bluRay'
    });

const BluRayModel = mongoose.model('bluRay', bluRaySchema);

async function getAllData(){
    const result = await BluRayModel.find({});
    {
        if (result){
            return result;
        }
    }

}

module.exports = {
    getAllData: getAllData,
    model: BluRayModel
}