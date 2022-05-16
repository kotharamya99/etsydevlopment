
import { uuid } from "uuidv4";
import _ from 'lodash';
import mongoose from 'mongoose';
import cartModel from '../../models/cart.js';
import productModel from '../../models/products.js';
import purchaseModel from '../../models/purchases.js';
import orderModel from '../../models/orders.js';


const getCart = async (req, res) => {
    try {
        console.log("Headers", req.headers);
        // let cartData = await query("SELECT * FROM cart WHERE createdBy = ?", req.params.userId );
        let cartData = await cartModel.find({ createdBy: req.params.userId }).lean();
        console.log("Cart Data ===>", cartData);
        let productData = [];
        for (const cartItem of cartData) {
            // productData = await query("SELECT * FROM products WHERE _id = ?", cartItem.productId);
            productData = await productModel.findOne({ _id: cartItem.productId}).lean();
            cartItem["product"] = productData;
        }
        res.status(200).json({ cartItems: cartData });
    } catch (err) {
        res.status(400).json({ msg: "Error in fetching cart data" });
            return;
    }
};

const createOrUpdateCart = async(req, res) => {
    let { productId, quantity, isGiftWrap, giftWrapDescription} = req.body;
    //  quantity = quantity === -15 ? 1 : quantity;
    // quantity = quantity ? quantity : 1;

    console.log("Quantity Log is ", quantity);
    // giftWrapDescription=giftWrapDescription || "";
    let userId = req.params.userId;
    try {
        
        // let userCartItem = await query(`select * from cart where productId='${productId}' AND createdBy='${userId}'`);
        let userCartItem = await cartModel.find({ productId:productId},{ createdBy: userId });
        userCartItem = _.get(userCartItem, '0')
        if(userCartItem) {
            let cartId = userCartItem._id;
            // let updateCartP = await query(`UPDATE cart SET quantity= quantity+${quantity} where  _id= '${cartId}'`);
            let setObj = {};
            if(typeof isGiftWrap === 'boolean') {
                setObj["isGift"] = isGiftWrap;
            }
            if(giftWrapDescription) {
                setObj["giftWrapDescription"] = giftWrapDescription;
            }

            if(Object.keys(setObj).length > 0) {
                let results = await cartModel.update(
                    { _id: cartId },
                    {
                         $set: setObj//{ isGift: isGiftWrap, giftWrapDescription: giftWrapDescription }
                          
                    }
                );
            }
            if(quantity) {
                if(quantity === -15){
                    let results = await cartModel.update(
                        { _id: cartId },
                        {
                             $inc: { quantity: 1 }
                              
                        }
                    );
                }else if(quantity === 0){
                    let result = await cartModel.deleteOne({_id : cartId});
                    console.log("Deleted in create or update result", result);
                }else{   
                    let results = await cartModel.update(
                    { _id: cartId },
                    {
                         $set: { quantity: quantity }
                          
                    }
                );
                }
            }else if(quantity === 0){
                let result = await cartModel.deleteOne({_id : cartId});
                console.log("Quantity Deleted in create or update result", result);
            }

        let cartData = await cartModel.find({ createdBy: req.params.userId }).lean();
        console.log("Cart Data ===>", cartData);
        let productData = [];
        for (const cartItem of cartData) {
            // productData = await query("SELECT * FROM products WHERE _id = ?", cartItem.productId);
            productData = await productModel.findOne({ _id: cartItem.productId}).lean();
            cartItem["product"] = productData;
        }
        res.status(200).json({ cartItems: cartData });
            // return res.status(200).json({
            //     _id: cartId,
            //     productId,
            //     createdBy: userId,
            //     msg: 'successfully added product to cart'
            // })
        } else {
            // const insertQuery = `INSERT INTO cart (_id, createdBy, productId, quantity) VALUES ('${cartId}', '${req.params.userId}', '${req.body.productId}', '${quantity}')`;
            const newCart = new cartModel({
                createdBy:req.params.userId,
                productId: req.body.productId,
                quantity: 1
              });
              
              newCart.save((error, data) => {
                        if (error) {
                            res.writeHead(500, {
                                'Content-Type': 'text/plain'
                            })
                            res.end();
                        }
                        else {
                            res.status(200).json({
                                _id: userCartItem._id,
                                createdBy: req.params.userId,
                                productId: req.body.productId,
                                quantity: quantity,
                            });
                        }
                    });
                
            
        }
    } catch (err) {
        console.log("err ===>", err);
        res.status(400).json({ msg: "Error in creating cart data" });
        return;
    }
};

const updateCart = async (req, res) => {
    try {
        let cartData = [req.body.quantity, req.params.cartId];
        let results = await cartModel.update(
            { _id: req.params.cartId },
            {
                $set: {
                 quantity: req.body.quantity
                }
            }
         )
        // let results = await query("UPDATE cart SET quantity= ? where _id = ?", cartData);
        res.status(200).json({
            _id: req.params.cartId,
            createdBy: req.params.userId,
            productId: req.body.productId,
            quantity: req.body.quantity,
        });
    } catch (err) {
        console.log("err ===>", err);
        res.status(400).json({ msg: "Error in updating cart data" });
        return;
    }
};

const deleteCart = async(req, res) => {
    try {
        let result = await cartModel.deleteOne({_id : req.params.cartId});

        // let results = await query(`DELETE FROM cart WHERE _id= '${req.params.cartId}';`);
        res.status(200).json({
            msg: "Deleted Successfully",
        });
    } catch (err) {
        console.log("err ===>", err);
        res.status(400).json({ msg: "Error in deleting cart data" });
        return;
    }
};

const checkoutCart = async(req, res) => {
    try {
        // let cartData = await query("SELECT * FROM cart WHERE createdBy = ?", req.params.userId);
        let cartData = await cartModel.find({createdBy : req.params.userId});
        console.log("cartData ===>", cartData);
        let productIds = _.map(cartData, 'productId');
        // let productData = await query(`SELECT * FROM products WHERE  _id IN ("${productIds.join('", "')}")`);
        let productData = await productModel.find({_id : {"$in" : productIds}});
        let productIdsMap = _.keyBy(productData, '_id');
        cartData = _.map(cartData, (item) => {
            item['product'] = productIdsMap[item.productId]
            return item;
        });
        const totalCartPrice = cartData.reduce(
            (totalPrice, cartItem) =>

            cartItem.product.price * cartItem.quantity + totalPrice,
            0
        );
        let purchaseId;
        // let purchaseId = `ps-${uuid()}`;
        // let purchaseData = [
        //     purchaseId,
        //     req.params.userId,
        //     new Date(),
        //     totalCartPrice,
        // ];

        const newPurchase = new purchaseModel({
            createdBy: req.params.userId,
            // productId: productId,
            createdOn:  new Date(),
            price: totalCartPrice
          }); 

        // let purchaseQueryResult = await query(
        //     `INSERT INTO purchases  VALUES (?,?,?,?)`,
        //     purchaseData
        // );

        newPurchase.save((error, data) => {
            if (error) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                })
                res.end();
            }
            console.log("Purchase Response is", data);
            purchaseId = data._id;
        });

        let orderId;
        let orderQuery = "",
            orderData = [];
        for (const cartRecord of cartData) {
            // orderData = [
            //     orderId,
            //     cartRecord.createdBy,
            //     cartRecord.productId,
            //     cartRecord.product.price * cartRecord.quantity,
            //     cartRecord.quantity,
            //     cartRecord.product.shopId,
            //     cartRecord.product.imageUrl,
            //     cartRecord.product.name,
            //     purchaseId,
            // ];
            // orderQuery = await query(`INSERT INTO orders VALUES (?,?,?,?,?,now(),?,?,?,?)`, orderData);
            console.log("Gift wrap ===>", cartRecord.giftWrapDescription);
            if(!cartRecord.isGift){
                cartRecord.giftWrapDescription = null;
            }
            const newOrder = new orderModel({
                createdBy: cartRecord.createdBy,
                productId: cartRecord.productId,
                createdOn:  new Date(),
                price: cartRecord.product.price * cartRecord.quantity,
                quantity: cartRecord.quantity,
                shopId: cartRecord.product.shopId,
                productImage: cartRecord.product.imageUrl,
                productName: cartRecord.product.name,
                purchaseId: purchaseId,
                giftWrapDescription: cartRecord.giftWrapDescription,
              }); 

              newOrder.save((error, data) => {
                if (error) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    })
                    res.end();
                }
                console.log("Order Response is", data);
            });

            // let updateSalesCount = await query(`UPDATE products SET salesCount = salesCount + ${cartRecord.quantity}, quantity = quantity - ${cartRecord.quantity}   where _id = '${cartRecord.productId}'`)
            let updateSalesCount = await productModel.update(
                { _id: cartRecord.productId},
                {
                    $inc: { salesCount: cartRecord.quantity, quantity: -cartRecord.quantity } 
                } 
             );
        }
        // let deleteQueryResult = await query(`DELETE FROM cart WHERE createdBy = '${req.params.userId}'`);
        let result = await cartModel.deleteMany({createdBy : req.params.userId});

        res.status(200).json({ message: "Checkout Successfully Completed" });
        return;
    } catch (err) {
        console.log("err ===>", err);
        res.status(400).json({ msg: "Error in checking out cart" });
        return;
    }
};

let endpoints = {
    "/users/:userId/cart/": [{
            method: "GET",
            callbacks: [getCart],
        },
        {
            method: "PUT",
            callbacks: [createOrUpdateCart],
        },
    ],
    "/users/:userId/cart/:cartId": [{
            method: "PUT",
            callbacks: [updateCart],
        },
        {
            method: "DELETE",
            callbacks: [deleteCart],
        },
    ],
    "/users/:userId/cart/checkout": [{
        method: "POST",
        callbacks: [checkoutCart],
    }, ],
};

export { endpoints };



























// import { uuid } from "uuidv4";
// import _ from 'lodash';
// import mongoose from 'mongoose';
// import cartModel from '../../models/cart.js';
// import productModel from '../../models/products.js';
// import purchaseModel from '../../models/purchases.js';
// import orderModel from '../../models/orders.js';


// const getCart = async (req, res) => {
//     try {
//         // let cartData = await query("SELECT * FROM cart WHERE createdBy = ?", req.params.userId );
//         let cartData = await cartModel.find({ createdBy: req.params.userId }).lean();
//         //console.log("Cart Data ===>", cartData);
//         let productData = [];
//         for (const cartItem of cartData) {
//             // productData = await query("SELECT * FROM products WHERE _id = ?", cartItem.productId);
//             productData = await productModel.findOne({ _id: cartItem.productId}).lean();
//             cartItem["product"] = productData;
//         }
//         res.status(200).json({ cartItems: cartData });
//     } catch (err) {
//         res.status(400).json({ msg: "Error in fetching cart data" });
//             return;
//     }
// };

// const createOrUpdateCart = async(req, res) => {
//     let { productId, quantity,          isGiftWrap, giftWrapDescription} = req.body;
//     quantity = quantity ? quantity : 1;
//     console.log("Quantity Log is ", quantity);
//     giftWrapDescription=giftWrapDescription || "";
//     let userId = req.params.userId;
//     try {
//         // let userCartItem = await query(`select * from cart where productId='${productId}' AND createdBy='${userId}'`);
//         let userCartItem = await cartModel.find({ productId:productId},{ createdBy: userId });
//         userCartItem = _.get(userCartItem, '0')
//         if(userCartItem) {
//             let cartId = userCartItem._id;
//             // let updateCartP = await query(`UPDATE cart SET quantity= quantity+${quantity} where  _id= '${cartId}'`);
//             if(giftWrapDescription !== "") {
//             let results = await cartModel.update(
//                 { _id: cartId },
//                 {
//                      $inc: { quantity: 1 },
//                      $set: { isGift: isGiftWrap, giftWrapDescription: giftWrapDescription }
                      
//                 }
//              )}else if(giftWrapDescription !== "" && quantity !== 1) {
//                 let results = await cartModel.update(
//                     { _id: cartId },
//                     {
//                          $set: { isGift: isGiftWrap, giftWrapDescription: giftWrapDescription, quantity: quantity }
                          
//                     }
//                  )}else if( isGiftWrap !== null) {
//                     let results = await cartModel.update(
//                         { _id: cartId },
//                         {
//                             $set: { isGift: isGiftWrap}
                              
//                         }
//                      )}else if( quantity !== 1) {
//                     let results = await cartModel.update(
//                         { _id: cartId },
//                         {
//                              $set: {  quantity: quantity }
                              
//                         }
//                      )}else{
//                 let results = await cartModel.update(
//                     { _id: cartId },
//                     {
//                          $inc: { quantity: 1 },
                          
//                     }
//                  )
//              }
//              let cartData = await cartModel.find({ createdBy: req.params.userId }).lean();
//         console.log("Cart Data ===>", cartData);
//         let productData = [];
//         for (const cartItem of cartData) {
//             // productData = await query("SELECT * FROM products WHERE _id = ?", cartItem.productId);
//             productData = await productModel.findOne({ _id: cartItem.productId}).lean();
//             cartItem["product"] = productData;
//         }
//         res.status(200).json({ cartItems: cartData });
//             // return res.status(200).json({
//             //     _id: cartId,
//             //     productId,
//             //     createdBy: userId,
//             //     msg: 'successfully added product to cart'
//             // })
//         } else {
//             // const insertQuery = `INSERT INTO cart (_id, createdBy, productId, quantity) VALUES ('${cartId}', '${req.params.userId}', '${req.body.productId}', '${quantity}')`;
//             const newCart = new cartModel({
//                 createdBy:req.params.userId,
//                 productId: req.body.productId,
//                 quantity: quantity
//               });
              
//               newCart.save((error, data) => {
//                         if (error) {
//                             res.writeHead(500, {
//                                 'Content-Type': 'text/plain'
//                             })
//                             res.end();
//                         }
//                         else {
//                             res.status(200).json({
//                                 _id: userCartItem._id,
//                                 createdBy: req.params.userId,
//                                 productId: req.body.productId,
//                                 quantity: quantity,
//                             });
//                         }
//                     });
                
            
//         }
//     } catch (err) {
//         console.log("err ===>", err);
//         res.status(400).json({ msg: "Error in creating cart data" });
//         return;
//     }
// };

// const updateCart = async (req, res) => {
//     try {
//         let cartData = [req.body.quantity, req.params.cartId];
//         let results = await cartModel.update(
//             { _id: req.params.cartId },
//             {
//                 $set: {
//                  quantity: req.body.quantity
//                 }
//             }
//          )
//         // let results = await query("UPDATE cart SET quantity= ? where _id = ?", cartData);
//         res.status(200).json({
//             _id: req.params.cartId,
//             createdBy: req.params.userId,
//             productId: req.body.productId,
//             quantity: req.body.quantity,
//         });
//     } catch (err) {
//         console.log("err ===>", err);
//         res.status(400).json({ msg: "Error in updating cart data" });
//         return;
//     }
// };

// const deleteCart = async(req, res) => {
//     try {
//         let result = await cartModel.deleteOne({_id : req.params.cartId});

//         // let results = await query(`DELETE FROM cart WHERE _id= '${req.params.cartId}';`);
//         res.status(200).json({
//             msg: "Deleted Successfully",
//         });
//     } catch (err) {
//         console.log("err ===>", err);
//         res.status(400).json({ msg: "Error in deleting cart data" });
//         return;
//     }
// };

// const checkoutCart = async(req, res) => {
//     try {
//         // let cartData = await query("SELECT * FROM cart WHERE createdBy = ?", req.params.userId);
//         let cartData = await cartModel.find({createdBy : req.params.userId});
//         console.log("cartData ===>", cartData);
//         let productIds = _.map(cartData, 'productId');
//         // let productData = await query(`SELECT * FROM products WHERE  _id IN ("${productIds.join('", "')}")`);
//         let productData = await productModel.find({_id : {"$in" : productIds}});
//         let productIdsMap = _.keyBy(productData, '_id');
//         cartData = _.map(cartData, (item) => {
//             item['product'] = productIdsMap[item.productId]
//             return item;
//         });
//         const totalCartPrice = cartData.reduce(
//             (totalPrice, cartItem) =>

//             cartItem.product.price * cartItem.quantity + totalPrice,
//             0
//         );
//         let purchaseId;
//         // let purchaseId = `ps-${uuid()}`;
//         // let purchaseData = [
//         //     purchaseId,
//         //     req.params.userId,
//         //     new Date(),
//         //     totalCartPrice,
//         // ];

//         const newPurchase = new purchaseModel({
//             createdBy: req.params.userId,
//             // productId: productId,
//             createdOn:  new Date(),
//             price: totalCartPrice
//           }); 

//         // let purchaseQueryResult = await query(
//         //     `INSERT INTO purchases  VALUES (?,?,?,?)`,
//         //     purchaseData
//         // );

//         newPurchase.save((error, data) => {
//             if (error) {
//                 res.writeHead(500, {
//                     'Content-Type': 'text/plain'
//                 })
//                 res.end();
//             }
//             console.log("Purchase Response is", data);
//             purchaseId = data._id;
//         });

//         let orderId;
//         let orderQuery = "",
//             orderData = [];
//         for (const cartRecord of cartData) {
//             // orderData = [
//             //     orderId,
//             //     cartRecord.createdBy,
//             //     cartRecord.productId,
//             //     cartRecord.product.price * cartRecord.quantity,
//             //     cartRecord.quantity,
//             //     cartRecord.product.shopId,
//             //     cartRecord.product.imageUrl,
//             //     cartRecord.product.name,
//             //     purchaseId,
//             // ];
//             // orderQuery = await query(`INSERT INTO orders VALUES (?,?,?,?,?,now(),?,?,?,?)`, orderData);
//             console.log("Gift wrap ===>", cartRecord.giftWrapDescription);
//             if(!cartRecord.isGift){
//                 cartRecord.giftWrapDescription = null;
//             }
//             const newOrder = new orderModel({
//                 createdBy: cartRecord.createdBy,
//                 productId: cartRecord.productId,
//                 createdOn:  new Date(),
//                 price: cartRecord.product.price * cartRecord.quantity,
//                 quantity: cartRecord.quantity,
//                 shopId: cartRecord.product.shopId,
//                 productImage: cartRecord.product.imageUrl,
//                 productName: cartRecord.product.name,
//                 purchaseId: purchaseId,
//                 giftWrapDescription: cartRecord.giftWrapDescription,
//               }); 

//               newOrder.save((error, data) => {
//                 if (error) {
//                     res.writeHead(500, {
//                         'Content-Type': 'text/plain'
//                     })
//                     res.end();
//                 }
//                 console.log("Order Response is", data);
//             });

//             // let updateSalesCount = await query(`UPDATE products SET salesCount = salesCount + ${cartRecord.quantity}, quantity = quantity - ${cartRecord.quantity}   where _id = '${cartRecord.productId}'`)
//             let updateSalesCount = await productModel.update(
//                 { _id: cartRecord.productId},
//                 {
//                     $inc: { salesCount: cartRecord.quantity, quantity: -cartRecord.quantity } 
//                 } 
//              );
//         }
//         // let deleteQueryResult = await query(`DELETE FROM cart WHERE createdBy = '${req.params.userId}'`);
//         let result = await cartModel.deleteMany({createdBy : req.params.userId});

//         res.status(200).json({ message: "Checkout Successfully Completed" });
//         return;
//     } catch (err) {
//         console.log("err ===>", err);
//         res.status(400).json({ msg: "Error in checking out cart" });
//         return;
//     }
// };








// //MY SQL Connection
// // const getCart = async (req, res) => {
// //     try {
// //         let cartData = await query("SELECT * FROM cart WHERE createdBy = ?", req.params.userId );
// //         let productData = [];
// //         for (const cartItem of cartData) {
// //             productData = await query("SELECT * FROM products WHERE _id = ?", cartItem.productId);
// //             cartItem["product"] = productData[0];
// //         }
// //         res.status(200).json({ cartItems: cartData });
// //     } catch (err) {
// //         res.status(400).json({ msg: "Error in fetching cart data" });
// //         return;
// //     }
// // };

// // const createOrUpdateCart = async(req, res) => {
// //     let { productId, quantity} = req.body;
// //     quantity=quantity || 1;
// //     let userId = req.params.userId;
// //     try {
// //         let userCartItem = await query(`select * from cart where productId='${productId}' AND createdBy='${userId}'`);
// //         userCartItem = _.get(userCartItem, '0')
// //         if(userCartItem) {
// //             let cartId = userCartItem._id;
// //             let updateCartP = await query(`UPDATE cart SET quantity= quantity+${quantity} where  _id= '${cartId}'`);
// //             return res.status(200).json({
// //                 _id: cartId,
// //                 productId,
// //                 createdBy: userId,
// //                 msg: 'successfully added product to cart'
// //             })
// //         } else {
// //             const cartId = `c-${uuid()}`;
// //             const insertQuery = `INSERT INTO cart (_id, createdBy, productId, quantity) VALUES ('${cartId}', '${req.params.userId}', '${req.body.productId}', '${quantity}')`;
// //             let results = await query(insertQuery);
// //             res.status(200).json({
// //                 _id: cartId,
// //                 createdBy: req.params.userId,
// //                 productId: req.body.productId,
// //                 quantity: quantity,
// //             });
// //         }
// //     } catch (err) {
// //         res.status(400).json({ msg: "Error in creating cart data" });
// //         return;
// //     }
// // };

// // const updateCart = async (req, res) => {
// //     try {
// //         let cartData = [req.body.quantity, req.params.cartId];
// //         let results = await query("UPDATE cart SET quantity= ? where _id = ?", cartData);
// //         res.status(200).json({
// //             _id: req.params.cartId,
// //             createdBy: req.params.userId,
// //             productId: req.body.productId,
// //             quantity: req.body.quantity,
// //         });
// //     } catch (err) {
// //         console.log("err ===>", err);
// //         res.status(400).json({ msg: "Error in updating cart data" });
// //         return;
// //     }
// // };

// // const deleteCart = async(req, res) => {
// //     try {
// //         let results = await query(`DELETE FROM cart WHERE _id= '${req.params.cartId}';`);
// //         res.status(200).json({
// //             msg: "Deleted Successfully",
// //         });
// //     } catch (err) {
// //         console.log("err ===>", err);
// //         res.status(400).json({ msg: "Error in deletinc cart data" });
// //         return;
// //     }
// // };

// // const checkoutCart = async(req, res) => {
// //     try {
// //         let cartData = await query("SELECT * FROM cart WHERE createdBy = ?", req.params.userId);
// //         let productIds = _.map(cartData, 'productId');
// //         let productData = await query(`SELECT * FROM products WHERE  _id IN ("${productIds.join('", "')}")`);
// //         let productIdsMap = _.keyBy(productData, '_id');
// //         cartData = _.map(cartData, (item) => {
// //             item['product'] = productIdsMap[item.productId]
// //             return item;
// //         });
// //         const totalCartPrice = cartData.reduce(
// //             (totalPrice, cartItem) =>

// //             cartItem.product.price * cartItem.quantity + totalPrice,
// //             0
// //         );
// //         let purchaseId = `ps-${uuid()}`;
// //         let purchaseData = [
// //             purchaseId,
// //             req.params.userId,
// //             new Date(),
// //             totalCartPrice,
// //         ];

// //         let purchaseQueryResult = await query(
// //             `INSERT INTO purchases  VALUES (?,?,?,?)`,
// //             purchaseData
// //         );
// //         let orderId;
// //         let orderQuery = "",
// //             orderData = [];
// //         for (const cartRecord of cartData) {
// //             orderId = `o-${uuid()}`;
// //             orderData = [
// //                 orderId,
// //                 cartRecord.createdBy,
// //                 cartRecord.productId,
// //                 cartRecord.product.price * cartRecord.quantity,
// //                 cartRecord.quantity,
// //                 cartRecord.product.shopId,
// //                 cartRecord.product.imageUrl,
// //                 cartRecord.product.name,
// //                 purchaseId,
// //             ];
// //             orderQuery = await query(`INSERT INTO orders VALUES (?,?,?,?,?,now(),?,?,?,?)`, orderData);
// //             let updateSalesCount = await query(`UPDATE products SET salesCount = salesCount + ${cartRecord.quantity}, quantity = quantity - ${cartRecord.quantity}   where _id = '${cartRecord.productId}'`)

// //         }
// //         let deleteQueryResult = await query(`DELETE FROM cart WHERE createdBy = '${req.params.userId}'`);
// //         res.status(200).json({ message: "Checkout Successfully Completed" });
// //     } catch (err) {
// //         console.log("err ===>", err);
// //         res.status(400).json({ msg: "Error in checking out cart" });
// //         return;
// //     }
// // };

// let endpoints = {
//     "/users/:userId/cart/": [{
//             method: "GET",
//             callbacks: [getCart],
//         },
//         {
//             method: "PUT",
//             callbacks: [createOrUpdateCart],
//         },
//     ],
//     "/users/:userId/cart/:cartId": [{
//             method: "PUT",
//             callbacks: [updateCart],
//         },
//         {
//             method: "DELETE",
//             callbacks: [deleteCart],
//         },
//     ],
//     "/users/:userId/cart/checkout": [{
//         method: "POST",
//         callbacks: [checkoutCart],
//     }, ],
// };

// export { endpoints };