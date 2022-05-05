import  UserClass from '../mongoservices/user.js';
import  FavoritesClass from '../mongoservices/favorites.js';
import  ProductsClass from '../mongoservices/products.js';
import _ from 'lodash';

async function createNewFavarite(msg, callback) {
    try
    {
        let productId = msg.body.productId;
        let userId  = msg.params.userId; 
        let date = new Date();
        const results = await FavoritesClass.addFavorites(productId,userId,date);
        //res.status(200).json(results);
        let response = {}
         response.status = 200;
         response.result = results;
         callback(null, response);
    }
    catch(err) 
    {
        //res.status(400).json(err);
        let response = {}
         response.status = 400;
         response.result = err;
         callback(null, response);
    }
    
}

async function removeFavorite(msg, callback) {
    let userId = msg.params.userId;
    let favoriteId = msg.params.favoriteId;
    try {
        const result = await FavoritesClass.removeFavorites(userId,favoriteId);
        //res.status(200).json(result);
        let response = {}
         response.status = 200;
         response.result = result;
         callback(null, response);
    } catch (err) {
        console.log(err)
        //res.status(400).json(err);
        let response = {}
         response.status = 400;
         response.result = err;
         callback(null, response);
    }
}


async function getAllFavorites(msg, callback) {
    let userId = msg.params.userId;
    let searchWord = msg.query.search;
    try {
        let favoriteItems = await FavoritesClass.getAllFavorites(userId);
        let productIds = favoriteItems.map((item) => item.productId);
        let products = [];
        if (searchWord) 
        {
            products = await ProductsClass.getAllFavProductsWithSearch(searchWord,productIds);
        
        } else 
        {
            products = await ProductsClass.getAllFavProducts(productIds);
            
        }
        //console.log(products);
        let productIdsMap = _.keyBy(products, '_id')
        favoriteItems = _.filter(favoriteItems, (item) => productIdsMap[item.productId]);
        // res.json({
        //     favorites: _.map(favoriteItems, (item) => {
        //         item.product = productIdsMap[item.productId]
        //         return item;
        //     })
        // })

        let response = {}
         response.status = 200;
         response.result = {
            favorites: _.map(favoriteItems, (item) => {
                item.product = productIdsMap[item.productId]
                return item;
            })
        }
         callback(null, response);
    } catch (err) {
        console.log("Error : ", err)
        //res.status(400).json(err);
        let response = {}
         response.status = 400;
         response.result = err;
         callback(null, response);
        
    }
}



async function handle_request_Favorite(msg, callback)
{
    if (msg.path === "create_favorite") {
        createNewFavarite(msg, callback);
      }else if (msg.path === "remove_favorite") 
      {
        removeFavorite(msg, callback);
      }
      else if (msg.path === "get_favorite") 
      {
        getAllFavorites(msg, callback);
      }
      
        
};

export {handle_request_Favorite};


