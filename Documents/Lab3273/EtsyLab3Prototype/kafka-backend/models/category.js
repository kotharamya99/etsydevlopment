import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    name:{
        type:String
    },
    shopId:{
        type:mongoose.Schema.Types.ObjectId, ref: 'shops'
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    isSystem:{
        type:Boolean
    }
},
{
    versionKey: false
})


const categoryModel = mongoose.model('category', categorySchema);
export default categoryModel;