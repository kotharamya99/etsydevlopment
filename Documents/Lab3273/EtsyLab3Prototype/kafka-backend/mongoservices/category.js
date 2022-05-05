import mongoose from 'mongoose';
import CategoryModel from '../models/category.js';


export default class CategoryClass
{
    static getCategories = async ()=>
    {
        
        try{
            const cat = await CategoryModel.find({ });
            if(cat){
                return cat;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Error occurred getting categories");
        }
    }

    static createNewCat = async (name, shopId, userId, isSystem)=>
    {
        
        try{
            const query = {
                name:name,
                createdBy: mongoose.Types.ObjectId(userId),
                shopId: mongoose.Types.ObjectId(shopId),
                isSystem: isSystem
            }
            const cat = new CategoryModel(query);
            const result = await cat.save();
            if(result){
                return result;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Error occurred creating category");
        }
    }

    static getShopCategories = async (shopId)=>
    {
        
        try{
            const cat = await CategoryModel.find({ $or: [ {shopId: mongoose.Types.ObjectId(shopId)}, {isSystem: true} ] });
            if(cat){
                return cat;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Error occurred getting shop categories");
        }
    }
}