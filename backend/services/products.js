import mongoose from 'mongoose';
import ProductsModel from '../models/products.js';

export default class ProductClass
{
    static getAllFavProducts = async (productIds)=>
    {
        
        try{
             const results = await ProductsModel.find( { _id: { $in: productIds} }).lean();
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

    static getAllFavProductsWithSearch = async (searchWord,productIds)=>
    {
        
        try{
            const results = await ProductsModel.find( { _id: { $in: productIds},name:{$regex:searchWord, $options: 'i'} }).lean();
           if(results){
               return results;
           }else{
               return {};
           }
       }catch(err){
           console.log(err);
           throw new Error("Error occurred getting favorite items with search");
       }
    }

    static createNewProduct = async (productDetails)=>
    {
        try{
            const product = new ProductsModel(productDetails);
            const result = await product.save();
            if(result){
                return result;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("Error occurred creating new product");
        }
    }

    static updateProduct = async (productData,productId)=>
    {   
        try{

            const findCondition = {
                _id:mongoose.Types.ObjectId(productId)
            }; 
            const updateValues = {$set: {imageUrl: productData.imageUrl, name:productData.name, description:productData.description, price:productData.price, quantity:productData.quantity}}
            const result = await ProductsModel.updateOne(findCondition,updateValues);
            const prodObj = {};
            if(result.acknowledged == true){
                prodObj.prodEdited = true;
            }else{
                prodObj.prodEdited = false; 
            }
            return prodObj;
        }catch(err){
            console.log(err);
            throw new Error("Error occurred updating product details");
        }
    }

    static getProductById = async (productId)=>
    {   
        try{
            const result = await ProductsModel.findById(productId);
            const prodObj = {};
            if(result){
                prodObj.prodFound = true;
                prodObj.prod = result;
            }else{
                prodObj.prodFound = false; 
            }
            return prodObj;
        }catch(err){
            console.log(err);
            throw new Error("error occurred getting product details");
        }
    }

    static getProductsWithConditions = async (whereConditions)=>
    {   
        try{
            const result = await ProductsModel.find(whereConditions);
            if(result){
                return result;
            }else{
                return {};
            }
        }catch(err){
            console.log(err);
            throw new Error("error occurred getting products list");
        }
    }

}