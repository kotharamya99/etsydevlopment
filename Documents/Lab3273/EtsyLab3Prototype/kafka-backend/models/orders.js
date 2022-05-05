import mongoose from 'mongoose';

const ordersSchema = mongoose.Schema({
    productImage:{
        type:String
    },
    productName:{
        type:String
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId, ref: 'products'
    },
    quantity:{
        type:Number
    },
    price:{
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
    giftWrapDescription: {type: String}
},
{
    versionKey: false
})


const ordersModel = mongoose.model('orders', ordersSchema);
export default ordersModel;