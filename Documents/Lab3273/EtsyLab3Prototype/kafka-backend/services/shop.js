import  ShopClass from '../mongoservices/shop.js';
import  UserClass from '../mongoservices/user.js';
async function checkShopNameAvailability(msg, callback)
{
    try
    {
    let shopname = msg.shopname;
    const results = await ShopClass.checkShopNameAvailability(shopname);
    if(results && results.shopFound==false)
    {
        callback(null, { available: true });
    }else
    {
        callback(null, { available: false });
    }
    }
    catch(err)
    {
        console.log(err);
        callback(null, {
            'msg': err
        });
    }
}

async function createShop(msg, callback)
{
    let data = msg.data;
    //to-do check if shop exists with same userId
    try {
        const exists = await ShopClass.getUserShopDetails(msg.data.userId);
        if(exists && exists.userFound==false)
        {
            const results = await ShopClass.createShop(data);
            if(results.shopCreated==true)
            {
                callback(null, {
                    "shopId": results.shop._id,
                    "shopName": results.shop.name
                });


            }else
            {
                callback(null, {
                    'msg': "Could not create shop for the user"
                });
            }
        }else
        {
            callback(null, {
                'msg': "Shop already exists for the User"
            });
        }
    } catch (err) {
        res.status(400).json({
            'msg': err
        })
    }
}

async function getShopByUserId(msg, callback) 
{
    let userId = msg.userId; 
    try {
        const results = await ShopClass.getUserShopDetails(userId);
        if(results && results.userFound==false)
        {            
            callback(null, {
                'msg': `Shop doesn't exist for user`
            });
        }
        else
        {
            let shopId = results && results.user && results.user._id;
            callback(null, results.user);
        }
        
        // let shopSalesCount = await query(`select SUM(quantity) as totalSalesCount from orders where shopId='${shopId}'`)
        // shopDetails = shopDetails[0];
        // shopDetails.totalSalesCount = (shopSalesCount && shopSalesCount[0] && shopSalesCount[0].totalSalesCount) || 0;
        // res.status(200).json(shopDetails);

    } catch (err) {
        console.log("err", err);
        callback(null, {
            'msg': 'Error in fetching owner shops'
        });
    }
}

async function getShopById(msg, callback) {
    
    var shopId = msg.shopId; // verifiying userId in middleware
    try {
        const results = await ShopClass.getShopDetailsById(shopId);
        if(results && results.shopFound==false)
        {
            callback(null, {
                'msg': `Shop doesn't exist for user`
            });
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
        callback(null, shopDetails);

    } catch (err) {
        console.log("err ===>", err);
        callback(null, { msg: 'Error in fetching owner shops' });
    }
}


async function updateShopById(msg, callback) 
{

    try {
        let body = msg.body;
        let shopId = msg.shopId;
        let shopImageUrl = msg.shopImageUrl;
        let results = await ShopClass.editShop(shopId,shopImageUrl);
        if(results && results.shopEdited == true)
        {
            const results = await ShopClass.getShopDetailsById(shopId);
            let shopDetails = results.shop;
            callback(null,shopDetails);
        }else
        {
            callback(null, { msg: "could not update shop details" });
        }
    } catch (err) {
        console.log("err ===>", err);
        callback(null, { msg: "Error updating shop details" });
    }
}



async function handle_request_Shop(msg, callback)
{
    if (msg.path === "checkshopname") 
    {
        checkShopNameAvailability(msg, callback);
    }else if (msg.path === "createshop")
    {
        createShop(msg, callback);
    }
    else if (msg.path === "getshopbyuserid")
    {
        getShopByUserId(msg, callback);
    }
    else if (msg.path === "getshopbyid")
    {
        getShopById(msg, callback);
    }
    else if (msg.path === "updateshopbyid")
    {
        updateShopById(msg, callback);
    }
        
};

export {handle_request_Shop};


