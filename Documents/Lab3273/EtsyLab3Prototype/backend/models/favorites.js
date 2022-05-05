import mongoose from 'mongoose';

const favoritesSchema = mongoose.Schema({
    createdBy:{
        type:mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId, ref: 'products'
    },
    createdOn:{
        type:Date
    }
},
{
    versionKey: false
})


const favoritesModel = mongoose.model('favorites', favoritesSchema);
export default favoritesModel;