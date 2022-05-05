import mongoose from 'mongoose';

const productsSchema = mongoose.Schema({
    name:{
        type:String
    },
    imageUrl:{
        type:String
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId, ref: 'category'
    },
    description:{
        type:String
    },
    price:{
        type:Number
    },
    quantity:{
        type:Number
    },
    shopId:{
        type:mongoose.Schema.Types.ObjectId, ref: 'shops'
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId, ref: 'users'
    },
    createdOn:{
        type:Date
    },
    salesCount:{
        type:Number
    },
    shopName:{
        type:String
    }
},
{
    versionKey: false
})


const productsModel = mongoose.model('products', productsSchema);
export default productsModel;