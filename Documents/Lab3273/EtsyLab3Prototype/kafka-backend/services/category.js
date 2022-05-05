import _ from 'lodash';
import  CategoryClass from '../mongoservices/category.js';

async function createNewCat(msg, callback) 
{
    if (!msg.params || (msg.params && (!msg.params.shopId || !msg.params.userId))) 
    {
        //return res.status(400).send({ message: "Invalid Request"});
        let response = {}
         response.status = 400;
         response.result = { message: "Invalid Request"};
         callback(null, response);
    } 
    else 
    {
        let result = await CategoryClass.createNewCat(msg.body.name, msg.params.shopId, msg.params.userId, false);
        if(result)
        {
        //   res.status(200).json({
        //     name: req.body.name,
        //     shopId: req.params.shopId,
        //     createdBy: req.params.userId,
        // });

        let response = {}
         response.status = 200;
         response.result = {
            name: msg.body.name,
            shopId: msg.params.shopId,
            createdBy: msg.params.userId,
        }
         callback(null, response);
        }else{
        //   res.status(400).json({
        //     msg:"Error creating categories"
        // });
        let response = {}
         response.status = 200;
         response.result = {
            msg:"Error creating categories"
        }
         callback(null, response);
        }
    }
}

async function getAllCategories(msg, callback) {
  try {
    let categories = await CategoryClass.getCategories();
    // res.status(200).json({
    //   categories
    // })

        let response = {}
         response.status = 200;
         response.result = {
            categories
          }
        callback(null, response);
  } catch(err) {
    console.log("Error", err)
    // res.status(400).json({
    //   msg: 'Error fetching categories'
    // })

         let response = {}
         response.status = 400;
         response.result = {
            msg: 'Error fetching categories'
          }
          callback(null, response);
  }
}

async function getShopCategories(msg, callback) {
    if ( !msg.params || (msg.params && (!msg.params.shopId || !msg.params.userId))) 
    {
    //   return res.status(400).send({
    //     message: "Invalid Request",
    //   });
      let response = {}
         response.status = 400;
         response.result = {
            message: "Invalid Request",
          }
         callback(null, response);
    } 
    else 
    {
      let categoriesRes = await CategoryClass.getShopCategories(msg.params.shopId);
      if(categoriesRes)
      {
        // res.status(200).json({
        //   categories: categoriesRes
        //  });
         let response = {}
         response.status = 200;
         response.result = {
            categories: categoriesRes
           }
         callback(null, response);
      }else
      {
        // res.status(400).json({
        //   msg: 'Error fetching categories'
        // })

        let response = {}
         response.status = 400;
         response.result = {
            msg: 'Error fetching categories'
          }
         callback(null, response);
      }
    }
}



async function handle_request_Category(msg, callback)
{
    if (msg.path === "create_category") {
        createNewCat(msg, callback);
      }else if (msg.path === "get_categories") 
      {
        getAllCategories(msg, callback);
      }
      else if (msg.path === "get_shopcategories") 
      {
        getShopCategories(msg, callback);
      }
      
        
};

export {handle_request_Category};


