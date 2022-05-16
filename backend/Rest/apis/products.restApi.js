import _ from 'lodash';
import { uuid } from 'uuidv4';
import  ShopClass from '../../services/shop.js';
import  ProductClass from '../../services/products.js';
import mongoose from 'mongoose';
//import {make_request} from '../../kafka/client.js'

// /**deprecated  getShopProducts*/
async function getShopProducts(req, res) {
    let userId = req.params.userId; // verifiying userId in middleware
    let shopId = req.params.shopId;
    try {
        var products = await query(`select * from products where shopId = '${shopId}'`)
        var productsSalesCount = await query(`select sum(o.quantity) as salescount, productId from products p where p.shopId='${shopId}' inner join orders o on p._id=o.productId group by o.productId;`)
        var productsSalesCountMap = {};
        productsSalesCount.forEach(element => {
            productsSalesCountMap[element.productId] = element.salescount;
        });
        products = products.map((prod) => {
            let productId = prod._id;
            prod.salesCount = productsSalesCountMap[productId] || 0
            return prod;
        })
        res.status(200).json({
            products
        })
    } catch (err) {
        res.status(400).json({ msg: 'Error in fetching shop products' });
    }
}

async function createNewProduct(req, res) 
{

    // let msg = {};
    // msg.path = "create_product";
    // msg.body = req.body;
    // msg.params = req.params;
    // make_request('product_topic',msg, function(err,results){
    //     console.log('in result');
    //     console.log(results);
    //     if (err){
    //         console.log("Inside err"+err);
    //         res.json({
    //             status:"error",
    //             msg:"System Error, Try Again."
    //         })
    //     }else{
    //         console.log("Inside else");
    //             res.status(results.status).json(results.result);

    //             res.end();
    //         }
        
    // });

    
    let body = req.body;
    let { name, imageUrl, categoryId, description, price, quantity } = body
    let { userId, shopId } = req.params;
    try {

        let results = await ShopClass.getShopDetailsById(shopId);
        if(results && results.shopFound==false)
        {
            res.status(200).json({
                'msg': `Error creating product for user`
            })
            return;
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
         res.status(200).json(resultsPro);
    } catch (err) {
        res.status(400).json(err);
    }
}

async function getAllProducts(req, res) 
{


    // let msg = {};
    // msg.path = "getproducts";
    // msg.body = req.body;
    // msg.params = req.params;
    // make_request('product_topic',msg, function(err,results){
    //     console.log('in result');
    //     console.log(results);
    //     if (err){
    //         console.log("Inside err"+err);
    //         res.json({
    //             status:"error",
    //             msg:"System Error, Try Again."
    //         })
    //     }else{
    //         console.log("Inside else");
    //             res.status(results.status).json(results.result);
    //             res.end();
    //         }
        
    // });

    let { userId } = req.params; // verifiying userId in middleware
    let body = req.body;
    let {categoryIds, shopIds, excludeShopIds, search} = body;
    let selectQuery;
    let whereConditions = {};
    try {
        // let currentUserShopDetails = await query(`select * from shops where createdBy='${userId}'`);
        // currentUserShopDetails = _.get(currentUserShopDetails, '0')
        // if(currentUserShopDetails && currentUserShopDetails._id) {
        //     body.excludeShopIds = [currentUserShopDetails._id]
        // }

        if(search) {
            var regQuery = { $regex: search, $options: 'i' };
            whereConditions['name']=regQuery;
        }
        if (categoryIds && categoryIds.length > 0) {
            var catQuery = { $in: [] };
            for(let i=0;i<categoryIds.length;i++)
            {
                catQuery.$in.push(categoryIds[i]);
            }
            whereConditions['categoryId']=catQuery;
        }
        
        if (body.shopIds && body.shopIds.length>0) {
            var shopQuery = { $in: [] };
            for(let i=0;i<shopIds.length;i++)
            {
                shopQuery.$in.push(shopIds[i]);
            }
            whereConditions['shopId']=shopQuery;
        }
        if (body.excludeShopIds && body.excludeShopIds.length>0) {
            var shopExQuery = { $nin: [] };
            for(let i=0;i<excludeShopIds.length;i++)
            {
                shopExQuery.$nin.push(excludeShopIds[i]);
            }
            whereConditions['shopId']=shopExQuery;
        }
        if (body.priceRange && body.priceRange.length == 2) {
            let lowPrice = body.priceRange[0];
            let highPrice = body.priceRange[1];
            var priceQuery = { $gt: lowPrice, $lt: highPrice };
            whereConditions['price']=priceQuery;
        }
        if (body.excludeOutOfStock) {
            var qQuery = { $gt: 0 };
            whereConditions['quantity']=qQuery;
        }
        const products = await ProductClass.getProductsWithConditions(whereConditions);
        res.status(200).json({
            products,
            //salesCount: _.sumBy(results, 'salesCount')
        })
    } catch (err) {
        res.status(400).json(err);
    }
}

async function getProductById(req, res) 
{

    // let msg = {};
    // msg.path = "getproductbyid";
    // msg.params = req.params;
    // make_request('product_topic',msg, function(err,results){
    //     console.log('in result');
    //     console.log(results);
    //     if (err){
    //         console.log("Inside err"+err);
    //         res.json({
    //             status:"error",
    //             msg:"System Error, Try Again."
    //         })
    //     }else{
    //         console.log("Inside else");
    //             res.status(results.status).json(results.result);

    //             res.end();
    //         }
        
    // });


    try{
    let { userId, productId } = req.params; 
    const results = await ProductClass.getProductById(productId);
        if(results && results.prodFound==false)
        {
            res.status(200).json({
                'msg': `Shop doesn't exist for user`
            })
            return;
        }
        const p = results.prod;
        res.status(200).json(p);
    } catch (err) {
        res.status(400).json({
            msg: `Error fetching product ${productId}`
        });
    }
}

const updateProductById = async (req, res) => 
{

    // let msg = {};
    // msg.path = "updateproduct";
    // msg.params = req.params;
    // msg.body = req.body;
    // make_request('product_topic',msg, function(err,results){
    //     console.log('in result');
    //     console.log(results);
    //     if (err){
    //         console.log("Inside err"+err);
    //         res.json({
    //             status:"error",
    //             msg:"System Error, Try Again."
    //         })
    //     }else{
    //         console.log("Inside else");
    //             res.status(results.status).json(results.result);

    //             res.end();
    //         }
        
    // });

    let productId = req.params.productId;
    try {
        let productData = {
            name:req.body.name,
            imageUrl:req.body.imageUrl,
            description:req.body.description,
            price:req.body.price,
            quantity:req.body.quantity
        };
        let results = await ProductClass.updateProduct(productData,productId);
        if(results && results.prodEdited == true)
        {
            res.status(200).json({
                msg: 'Updated successfully'
            });
        }else
        {
            res.status(400).json({ msg: "could not update product details" });
        }
    } catch (err) {
        console.log("err ===>", err);
        res.status(400).json({ msg: "Error in updating products data" });
        return;
    }
};



//MY SQL conn
/**deprecated  getShopProducts*/
// async function getShopProducts(req, res) {
//     let userId = req.params.userId; // verifiying userId in middleware
//     let shopId = req.params.shopId;
//     try {
//         var products = await query(`select * from products where shopId = '${shopId}'`)
//         var productsSalesCount = await query(`select sum(o.quantity) as salescount, productId from products p where p.shopId='${shopId}' inner join orders o on p._id=o.productId group by o.productId;`)
//         var productsSalesCountMap = {};
//         productsSalesCount.forEach(element => {
//             productsSalesCountMap[element.productId] = element.salescount;
//         });
//         products = products.map((prod) => {
//             let productId = prod._id;
//             prod.salesCount = productsSalesCountMap[productId] || 0
//             return prod;
//         })
//         res.status(200).json({
//             products
//         })
//     } catch (err) {
//         res.status(400).json({ msg: 'Error in fetching shop products' });
//     }
// }

// async function createNewProduct(req, res) {
//     let body = req.body;
//     let { name, imageUrl, categoryId, description, price, quantity } = body
//     let { userId, shopId } = req.params; // verifiying userId in middleware
//     let newProductId = `p-${uuid()}`
//     try {
//         var shopDetails = await query(`select name from shops where _id = '${shopId}'`)
//         let shopName = shopDetails[0].name
//         let productDetails = [newProductId, name, imageUrl, categoryId, description, price, quantity, shopId, userId, new Date(), 0, shopName];

//         let results = query('INSERT INTO products VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', productDetails)
//         res.status(200).json(results)
//     } catch (err) {
//         res.status(400).json(err);
//     }
// }

// async function getAllProducts(req, res) {
//     let { userId } = req.params; // verifiying userId in middleware
//     let body = req.body;
//     let {categoryIds, shopIds, excludeShopIds, search} = body;
//     let selectQuery, whereConditions = [];
//     try {
//         // let currentUserShopDetails = await query(`select * from shops where createdBy='${userId}'`);
//         // currentUserShopDetails = _.get(currentUserShopDetails, '0')
//         // if(currentUserShopDetails && currentUserShopDetails._id) {
//         //     body.excludeShopIds = [currentUserShopDetails._id]
//         // }
//         if(search) {
//             whereConditions.push(`name REGEXP '${search}'`)
//         }
//         if (categoryIds && categoryIds.length > 0) {
//             whereConditions.push(`categoryId IN("${categoryIds.join('", "')}")`)
//         }
//         if (body.shopIds && body.shopIds.length) {
//             whereConditions.push(`shopId IN("${shopIds.join('", "')}")`)
//         }
//         if (body.excludeShopIds && body.excludeShopIds.length) {
//             whereConditions.push(`shopId NOT IN("${body.excludeShopIds.join('", "')}")`)
//         }
//         if (body.priceRange && body.priceRange.length == 2) {
//             let lowPrice = body.priceRange[0];
//             let highPrice = body.priceRange[1];
//             whereConditions.push(`price BETWEEN ${lowPrice} AND ${highPrice}`);
//         }
//         if (body.excludeOutOfStock) {
//             whereConditions.push(`quantity > 0`)
//         }
//         if (whereConditions.length) {
//             selectQuery = `select * from products where ${whereConditions.join(' AND ')}`
//         } else {
//             selectQuery = `select * from products`;
//         }
//         let products = await query(selectQuery);
//         // let joinConditionString = whereConditions.map((condition) => `p.${condition}`).join(' AND ');
//         // var productsSalesCount = await query(`select sum(o.quantity) as salescount, productId from products p where ${joinConditionString} inner join orders o on p._id=o.productId group by o.productId;`)
//         res.status(200).json({
//             products,
//             salesCount: _.sumBy(products, 'salesCount')
//         })
//     } catch (err) {
//         res.status(400).json(err);
//     }
// }

// async function getProductById(req, res) {
//     let { userId, productId } = req.params; // verifiying userId in middleware
//     let selectQuery, whereConditions = [];
//     try {
//         selectQuery = `select * from products where _id='${productId}'`;
//         let product = await query(selectQuery);
//         product = product[0];
//         res.status(200).json(product);
//     } catch (err) {
//         res.status(400).json({
//             msg: `Error fetching product ${productId}`
//         });
//     }
// }

// const updateProductById = async (req, res) => {
//     let productId = req.params.productId;
//     try {
//         let productData = [
//             req.body.name,
//             req.body.imageUrl,
//             req.body.description,
//             req.body.price,
//             req.body.quantity,
//             productId
//         ];
//         let results = await query("UPDATE products SET name= ?, imageUrl=?, description=?, price=?, quantity=? where _id = ?", productData);
//         res.status(200).json({
//            msg: 'Updated successfully'
//         });
//     } catch (err) {
//         console.log("err ===>", err);
//         res.status(400).json({ msg: "Error in updating products data" });
//         return;
//     }
// };


let endpoints = {
    '/users/:userId/shops/:shopId/products': [{
            method: 'POST',
            callbacks: [createNewProduct]
        },
        // {
        //     method: 'GET',
        //     callbacks: [getShopProducts]
        // }
    ],
    '/users/:userId/products': [{
        method: 'POST',
        callbacks: [getAllProducts]
    }],
    '/users/:userId/products/:productId': [{
        method: 'GET',
        callbacks: [getProductById]
    },
    {
        method: 'PUT',
        callbacks: [updateProductById]
    }]
}

export { endpoints }