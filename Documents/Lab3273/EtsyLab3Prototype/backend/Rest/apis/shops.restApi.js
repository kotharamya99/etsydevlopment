import { uuid } from 'uuidv4';
import _ from 'lodash';
import  ShopClass from '../../services/shop.js';
import  UserClass from '../../services/user.js';
//import {make_request} from '../../kafka/client.js'

async function checkShopNameAvailability(req, res) 
{

    // const msg = {};
    // msg.shopname = req.query.shopname;
    // msg.path = "checkshopname";
    // make_request('shop_topic',msg, function(err,results){
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
    //             res.json(results);
    //             res.end();
    //         }
        
    // });

    try
    {
    let shopname = req.query.shopname;
    const results = await ShopClass.checkShopNameAvailability(shopname);
    if(results && results.shopFound==false)
    {
        res.status(200).json({ available: true });
    }else
    {
        res.status(200).json({ available: false });
    }
    }
    catch(err)
    {
        console.log(err);
        res.status(400).json({
            'msg': err
        })
    }
}

async function createShop(req, res) 
{
    // let msg={};
    // let shopname = req.body.name;
    // let userId = req.params.userId;
    // let imageUrl = req.body.imageUrl;
    // let date = new Date();
    // let data = {
    //     shopname:shopname,
    //     userId:userId,
    //     imageUrl:imageUrl,
    //     date:date
    // }
    // msg.data = data;
    // msg.path = "createshop";
    // make_request('shop_topic',msg, function(err,results){
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
    //             res.json(results);
    //             res.end();
    //         }
        
    // });

    
    let shopname = req.body.name;
    let userId = req.params.userId;
    let imageUrl = req.body.imageUrl;
    let date = new Date();
    let data = {
        shopname:shopname,
        userId:userId,
        imageUrl:imageUrl,
        date:date
    }
    //to-do check if shop exists with same userId
    try {
        const exists = await ShopClass.getUserShopDetails(userId);
        if(exists && exists.userFound==false)
        {
            const results = await ShopClass.createShop(data);
            if(results.shopCreated==true)
            {
                res.status(200).json({
                    "shopId": results.shop._id,
                    "shopName": results.shop.name
                })
            }else
            {
                res.status(400).json({
                    'msg': "Could not create shop for the user"
                })
            }
        }else
        {
            res.status(400).json({
                'msg': "Shop already exists for the User"
            })
        }
    } catch (err) {
        res.status(400).json({
            'msg': err
        })
    }
}

async function getShopByUserId(req, res) 
{


    // let userId = req.params.userId; 
    // const msg = {};
    // msg.userId = userId
    // msg.path = "getshopbyuserid";
    // make_request('shop_topic',msg, function(err,results){
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
    //             res.json(results);
    //             res.end();
    //         }
        
    // });



    let userId = req.params.userId; 
    try {
        const results = await ShopClass.getUserShopDetails(userId);
        if(results && results.userFound==false)
        {
            res.status(200).json({
                'msg': `Shop doesn't exist for user`
            })
            return;
        }
        else
        {
            let shopId = results && results.user && results.user._id;
            res.status(200).json(results.user);
        }
        
        // let shopSalesCount = await query(`select SUM(quantity) as totalSalesCount from orders where shopId='${shopId}'`)
        // shopDetails = shopDetails[0];
        // shopDetails.totalSalesCount = (shopSalesCount && shopSalesCount[0] && shopSalesCount[0].totalSalesCount) || 0;
        // res.status(200).json(shopDetails);

    } catch (err) {
        console.log("err", err);
        res.status(400).json({ msg: 'Error in fetching owner shops' });
        return;
    }
}

async function getShopById(req, res) 
{

    // let shopId = req.params.shopId;
    // const msg = {};
    // msg.shopId = shopId
    // msg.path = "getshopbyid";
    // make_request('shop_topic',msg, function(err,results){
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
    //             res.json(results);
    //             res.end();
    //         }
        
    // });
    
    var shopId = req.params.shopId; // verifiying userId in middleware
    try {
        const results = await ShopClass.getShopDetailsById(shopId);
        if(results && results.shopFound==false)
        {
            res.status(200).json({
                'msg': `Shop doesn't exist for user`
            })
            return;
        }
        let shopDetails = results.shop;
        //console.log(shopDetails);
        //let shopSalesCount = await query(`select SUM(quantity) as totalSalesCount from orders where shopId='${shopId}'`)
        // shopDetails = shopDetails[0];
         let shopOwnerId = results.shop.createdBy;
         let userResults = await UserClass.getUserProfile(shopOwnerId);
         userResults.user.password = undefined;
         let shopOwnerDetails = userResults.user;
         shopDetails.ownerDetails = shopOwnerDetails;
        // let shopOwnerDetails = await query(`select * from users where _id='${shopOwnerId}'`); 
        // shopOwnerDetails = shopOwnerDetails[0];
        // delete shopOwnerDetails.password;
        // shopDetails.totalSalesCount = (shopSalesCount && shopSalesCount[0] && shopSalesCount[0].totalSalesCount) || 0;
        // shopDetails.ownerDetails = shopOwnerDetails;
        res.status(200).json(shopDetails);

    } catch (err) {
        console.log("err ===>", err);
        res.status(400).json({ msg: 'Error in fetching owner shops' });
        return;
    }
}

async function updateShopById(req, res) 
{


    // const msg = {};
    // msg.body = req.body;
    // msg.shopId = req.params.shopId;
    // msg.shopImageUrl = req.body.imageUrl; 
    // msg.path = "updateshopbyid";
    // make_request('shop_topic',msg, function(err,results){
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
    //             res.json(results);
    //             res.end();
    //         }
        
    // });


    try {
        let body = req.body;
        let shopId = req.params.shopId;
        let shopImageUrl = body.imageUrl; 
        let results = await ShopClass.editShop(shopId,shopImageUrl);
        if(results && results.shopEdited == true)
        {
            const results = await ShopClass.getShopDetailsById(shopId);
            let shopDetails = results.shop;
            res.status(200).json(shopDetails);
        }else
        {
            res.status(400).json({ msg: "could not update shop details" });
        }
    } catch (err) {
        console.log("err ===>", err);
        res.status(400).json({ msg: "Error updating shop details" });
        return;
    }
}

//My SQL Connection
// function checkShopNameAvailability(req, res) {
//     let shopname = req.query.shopname;
//     connection.query(`select * from shops where name = '${shopname}'`, (err, results, fields) => {
//         if (err) {
//             res.status(400).json({ msg: 'Error in fetching' });
//             return;
//         }
//         if (results && results.length > 0) {
//             res.status(200).json({ available: false });
//         } else {
//             res.status(200).json({ available: true });
//         }
//     })

// }

// async function createShop(req, res) {
//     let body = req.body;
//     let shopname = body.name;
//     let userId = req.params.userId; // verifiying userId in middleware
//     let newShopId = `sh-${uuid()}`
//     let data = [newShopId, shopname, body.imageUrl, userId, new Date()];
//     //to-do check if shop exists with same userId
//     try {
//         let results = await query('INSERT INTO shops VALUES (?,?,?,?,?)', data);
//         res.status(200).json({
//             shopId: newShopId,
//             shopName: shopname
//         })
//         return;
//     } catch (err) {
//         res.status(400).json({
//             'msg': err
//         })
//     }
// }

// async function getShopByUserId(req, res) {
//     let userId = req.params.userId; // verifiying userId in middleware
//     try {
//         let shopDetails = await query(`select * from shops where createdBy = '${userId}';`);
//         if (shopDetails && shopDetails.length == 0) {
//             res.status(200).json({
//                 'msg': `Shop doesn't exist for user`
//             })
//             return;
//         }
//         let shopId = shopDetails && shopDetails[0] && shopDetails[0]._id;
//         let shopSalesCount = await query(`select SUM(quantity) as totalSalesCount from orders where shopId='${shopId}'`)
//         shopDetails = shopDetails[0];
//         shopDetails.totalSalesCount = (shopSalesCount && shopSalesCount[0] && shopSalesCount[0].totalSalesCount) || 0;
//         res.status(200).json(shopDetails);

//     } catch (err) {
//         console.log("err ===>", err);
//         res.status(400).json({ msg: 'Error in fetching owner shops' });
//         return;
//     }
// }

// async function getShopById(req, res) {
//     var shopId = req.params.shopId; // verifiying userId in middleware
//     try {
//         let shopDetails = await query(`select * from shops where _id = '${shopId}';`);
//         if (shopDetails && shopDetails.length == 0) {
//             res.status(400).json({
//                 'msg': `Shop doesn't exist`
//             })
//             return;
//         }
//         let shopSalesCount = await query(`select SUM(quantity) as totalSalesCount from orders where shopId='${shopId}'`)
//         shopDetails = shopDetails[0];
//         let shopOwnerId = shopDetails.createdBy;
//         let shopOwnerDetails = await query(`select * from users where _id='${shopOwnerId}'`); 
//         shopOwnerDetails = shopOwnerDetails[0];
//         delete shopOwnerDetails.password;
//         shopDetails.totalSalesCount = (shopSalesCount && shopSalesCount[0] && shopSalesCount[0].totalSalesCount) || 0;
//         shopDetails.ownerDetails = shopOwnerDetails;
//         res.status(200).json(shopDetails);

//     } catch (err) {
//         console.log("err ===>", err);
//         res.status(400).json({ msg: 'Error in fetching owner shops' });
//         return;
//     }
// }

// async function updateShopById(req, res) {
//     try {
//         let body = req.body;
//         let shopId = req.params.shopId;
//         let shopImageUrl = body.imageUrl; 
//         let results = await query("UPDATE shops SET imageUrl=?  where _id = ?", [shopImageUrl, shopId]);
//         let shopDetails = await query("Select * from shops where _id = ?", [shopId]);
//         shopDetails = shopDetails[0]
//         res.status(200).json(shopDetails);
//     } catch (err) {
//         console.log("err ===>", err);
//         res.status(400).json({ msg: "Error in updating cart data" });
//         return;
//     }
// }


let endpoints = {
    '/users/:userId/shop/checkavailability': [{
        method: 'GET',
        callbacks: [checkShopNameAvailability]
    }],
    '/users/:userId/shops': [{
            method: 'POST',
            callbacks: [createShop]
        },
        {
            method: 'GET',
            callbacks: [getShopByUserId]
        }
    ],
    '/users/:userId/shops/:shopId': [
        {
            method: 'GET',
            callbacks: [getShopById]
        },
        {
            method: 'PUT',
            callbacks: [updateShopById]
        }
    ]
}


export { endpoints }