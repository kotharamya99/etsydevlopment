import mongoose from 'mongoose';
import ShopModel from '../models/shops.js';


export default class ShopClass
{
    static getUserShopDetails = async (userId)=>
    {   
        try{
            const query = {
                createdBy: mongoose.Types.ObjectId(userId)
            };
            const result = await ShopModel.findOne(query);
            const userObj = {};
            if(result){
                userObj.userFound = true;
                userObj.user = result;
            }else{
                userObj.userFound = false; 
            }
            return userObj;
        }catch(err){
            console.log(err);
            throw new Error("Some unexpected error occurred checking exists");
        }
    }

    static createShop = async (data)=>
    {   
        try{
            const query = {
                name:data.shopname,
                imageUrl:data.imageUrl, 
                createdBy: mongoose.Types.ObjectId(data.userId),
                createdOn:data.date
            };
            const shop = new ShopModel(query);
            const result = await shop.save();
            const resultObj = {};
            if(result){
                resultObj.shopCreated = true;
                resultObj.shop = result;
            }else{
                resultObj.shopCreated = false; 
            }
            return resultObj;
        }catch(err){
            console.log(err);
            throw new Error("Error occurred creating shop for the user");
        }
    }

    static checkShopNameAvailability = async (shopname)=>
    {   
        try{
            const query = {
                name: shopname
            };
            const result = await ShopModel.findOne(query);
            const shopObj = {};
            if(result){
                shopObj.shopFound = true;
                shopObj.shop = result;
            }else{
                shopObj.shopFound = false; 
            }
            return shopObj;
        }catch(err){
            console.log(err);
            throw new Error("error occurred checking shopname");
        }
    }

    static getShopDetailsById = async (shopId)=>
    {   
        try{
            const result = await ShopModel.findById(shopId);
            const shopObj = {};
            if(result){
                shopObj.shopFound = true;
                shopObj.shop = result;
            }else{
                shopObj.shopFound = false; 
            }
            return shopObj;
        }catch(err){
            console.log(err);
            throw new Error("error occurred getting shop details");
        }
    }

    static editShop = async (shopId,shopImageUrl)=>
    {   
        try{

            const findCondition = {
                _id:mongoose.Types.ObjectId(shopId)
            }; 
            const updateValues = {$set: {imageUrl: shopImageUrl}};
            const result = await ShopModel.updateOne(findCondition,updateValues);
            const shopObj = {};
            if(result.acknowledged == true){
                shopObj.shopEdited = true;
            }else{
                shopObj.shopEdited = false; 
            }
            return shopObj;
        }catch(err){
            console.log(err);
            throw new Error("Error occurred updating shop details");
        }
    }
}