import mongoose from 'mongoose';
import FavoritesModel from '../models/favorites.js';


export default class FavoritesClass
{
    static addFavorites = async (productId,userId,date)=>
    {
        try{
            const query = {
                createdBy: mongoose.Types.ObjectId(userId),
                productId: mongoose.Types.ObjectId(productId),
                createdOn: date
            };
            const fav = new FavoritesModel(query);
            const result = await fav.save();
            if(result){
                return result;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Error occurred adding favorite item");
        }
    }

    static removeFavorites = async (userId,favoriteId)=>
    {
        
        try{
            const query = {
                createdBy: mongoose.Types.ObjectId(userId),
                _id:mongoose.Types.ObjectId(favoriteId)
            };
            const results = await FavoritesModel.deleteOne(query);
            if(results){
                return results;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Error occurred adding favorite item");
        }
    }

    static getAllFavorites = async (userId)=>
    {
        
        try{
            const query = {
                createdBy: mongoose.Types.ObjectId(userId)
            };
            const results = await FavoritesModel.find(query).lean();
            if(results){
                return results;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Error occurred getting favorite items");
        }
    }
}