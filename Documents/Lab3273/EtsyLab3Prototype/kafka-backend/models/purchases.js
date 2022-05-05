import mongoose from 'mongoose';

const purchaseSchema = mongoose.Schema({
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    createdOn: {
        type: Date
    },
    price: {
        type: Number 
    }
    // price: {type: mongoose.Types.Decimal128 }
},
{
    versionKey: false
})


const purchaseModel = mongoose.model('purchases', purchaseSchema);
export default purchaseModel;