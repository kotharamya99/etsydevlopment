import mongoose from 'mongoose';
import OrdersModel from '../models/orders.js';
import ProductsModel from '../models/products.js';


export default class OrdersClass
{
    static getOrders = async (userId)=>
    {
        
        try{
            const query = {
                createdBy: mongoose.Types.ObjectId(userId),
                $orderby: { createdOn : -1 }
            };
            const results = await OrdersModel.find(query);
            if(results){
                return results;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Error occurred getting orders");
        }
    }

    static getOrderProducts = async (productIds)=>
    {
        
        try{
             const results = await ProductsModel.find( { _id: { $in: productIds} }).sort( { createdOn: -1 } )
             console.log(results);
            if(results){
                return results;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Error occurred getting ordered items");
        }
    }
}