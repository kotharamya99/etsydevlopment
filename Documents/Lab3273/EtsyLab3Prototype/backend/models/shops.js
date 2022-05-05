import mongoose from 'mongoose';

const shopSchema = mongoose.Schema({
    name:{
        type:String
    },
    imageUrl:{
        type:String
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    createdOn:{
        type:Date
    }
},
{
    versionKey: false
})


const shopModel = mongoose.model('shops', shopSchema);
export default shopModel;