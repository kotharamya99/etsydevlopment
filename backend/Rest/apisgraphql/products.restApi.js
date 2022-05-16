import _ from 'lodash';
import { uuid } from 'uuidv4';
import  ShopClass from '../../services/shop.js';
import  ProductClass from '../../services/products.js';
import mongoose from 'mongoose';
//import {make_request} from '../../kafka/client.js'



async function createNewProduct(args) 
{

    let body = args;
    let { name, imageUrl, categoryId, description, price, quantity } = body;
    let userId = args.userId;
    let shopId = args.shopId;
    try {

        let results = await ShopClass.getShopDetailsById(shopId);
        if(results && results.shopFound==false)
        {
            return {
                'msg': `Error creating product for user`
            }
        }
         let shopDetails = results.shop;
         let shopName = shopDetails.name;
        let productDetails = {
            name:name, 
            imageUrl:imageUrl,
            categoryId: mongoose.Types.ObjectId(categoryId), 
            description:description, 
            price:price, 
            quantity:quantity, 
            shopId: mongoose.Types.ObjectId(shopId), 
            createdBy: mongoose.Types.ObjectId(userId), 
            date:new Date(), 
            salesCount:0, 
            shopName:shopName
        };
         const resultsPro = await ProductClass.createNewProduct(productDetails);
    
         return resultsPro;
    } catch (err) {
        return err;
    }
}


async function getProductById(args) 
{

    try{
    let { userId, productId } = args; 
    const results = await ProductClass.getProductById(productId);
        if(results && results.prodFound==false)
        {
            return {
                'msg': `Shop doesn't exist for user`
            }
        }
        const p = results.prod;
        return p;
    } catch (err) {
        return{
            msg: `Error fetching product ${productId}`
        };
    }
}

const updateProductById = async (args) => 
{

    let productId = args.productId;
    try {
        let productData = {
            name:args.name,
            imageUrl:args.imageUrl,
            description:args.description,
            price:args.price,
            quantity:args.quantity
        };
        let results = await ProductClass.updateProduct(productData,productId);
        if(results && results.prodEdited == true)
        {
            return {
                msg: 'Updated successfully'
            };
        }else
        {
            return { msg: "could not update product details" };
        }
    } catch (err) {
        console.log("err ===>", err);
        return { msg: "Error in updating products data" };
    }
};


export { createNewProduct,  getProductById, updateProductById}