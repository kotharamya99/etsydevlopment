import { uuid } from 'uuidv4';
import _ from 'lodash';
import  ShopClass from '../../services/shop.js';
import  UserClass from '../../services/user.js';
//import {make_request} from '../../kafka/client.js'

async function checkShopNameAvailability(args) 
{
    try
    {
    let shopname = args.shopname;
    const results = await ShopClass.checkShopNameAvailability(shopname);
    if(results && results.shopFound==false)
    {
        return { available: true };
    }else
    {
        return { available: false };
    }
    }
    catch(err)
    {
        console.log(err);
        return {
            'msg': err
        }
    }
}

async function createShop(args) 
{
    
    let shopname = args.name;
    let userId = args.userId;
    let imageUrl = args.imageUrl;
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
                return {
                    "shopId": results.shop._id,
                    "shopName": results.shop.name
                }
            }else
            {
                return {
                    'msg': "Could not create shop for the user"
                }
            }
        }else
        {
            return {
                'msg': "Shop already exists for the User"
            } 
        }
    } catch (err) {
        return {
            'msg': err
        }
    }
}

async function getShopByUserId(args) 
{

    let userId = args.userId; 
    try {
        const results = await ShopClass.getUserShopDetails(userId);
        if(results && results.userFound==false)
        {
            return {
                'msg': `Shop doesn't exist for user`
            }
        }
        else
        {
            let shopId = results && results.user && results.user._id;
            return results.user;
        }
        
        // let shopSalesCount = await query(`select SUM(quantity) as totalSalesCount from orders where shopId='${shopId}'`)
        // shopDetails = shopDetails[0];
        // shopDetails.totalSalesCount = (shopSalesCount && shopSalesCount[0] && shopSalesCount[0].totalSalesCount) || 0;
        // res.status(200).json(shopDetails);

    } catch (err) {
        console.log("err", err);
        return { msg: 'Error in fetching owner shops' };
    }
}

async function getShopById(args) 
{
    
    var shopId = args.shopId; // verifiying userId in middleware
    try {
        const results = await ShopClass.getShopDetailsById(shopId);
        if(results && results.shopFound==false)
        {
            return {
                'msg': `Shop doesn't exist for user`
            }
            
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
        return shopDetails;

    } catch (err) {
        console.log("err ===>", err);
        return { msg: 'Error in fetching owner shops' };
    }
}

async function updateShopById(args) 
{

    try {
        let shopId = args.shopId;
        let shopImageUrl = args.imageUrl; 
        let results = await ShopClass.editShop(shopId,shopImageUrl);
        if(results && results.shopEdited == true)
        {
            const results = await ShopClass.getShopDetailsById(shopId);
            let shopDetails = results.shop;
            return shopDetails;
        }else
        {
            return { msg: "could not update shop details" };
        }
    } catch (err) {
        console.log("err ===>", err);
        return { msg: "Error updating shop details" };
    }
}




export { checkShopNameAvailability,  createShop, getShopByUserId, getShopById, updateShopById}