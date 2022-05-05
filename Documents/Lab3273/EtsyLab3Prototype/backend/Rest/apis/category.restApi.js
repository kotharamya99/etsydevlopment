import {uuid} from 'uuidv4';
import  CategoryClass from '../../services/category.js';
//import {make_request} from '../../kafka/client.js'


async function createNewCat(req, res) 
{
//kafka
//   let msg={};
//     msg.params = req.params;
//     msg.body = req.body;
//     msg.path = "create_category";

//     make_request('category_topic',msg, function(err,results){
//         console.log('in result');
//         console.log(results);
//         if (err){
//             console.log("Inside err"+err);
//             res.json({
//                 status:"error",
//                 msg:"System Error, Try Again."
//             })
//         }else{
//             console.log("Inside else");
//             res.status(results.status).json(results.result);

//                 res.end();
//             }
        
//     });

    if (!req.params || (req.params && (!req.params.shopId || !req.params.userId))) 
    {
        return res.status(400).send({ message: "Invalid Request"});
    } 
    else 
    {
        let result = await CategoryClass.createNewCat(req.body.name, req.params.shopId, req.params.userId, false);
        if(result)
        {
          res.status(200).json({
            name: req.body.name,
            shopId: req.params.shopId,
            createdBy: req.params.userId,
        });
        }else{
          res.status(400).json({
            msg:"Error creating categories"
        });
        }
    }
}

async function getAllCategories(req, res) 
{

    // msg.path = "get_categories";

    // make_request('category_topic',msg, function(err,results){
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
    //         res.status(results.status).json(results.result);

    //             res.end();
    //         }
        
    // });


  try {
    let categories = await CategoryClass.getCategories();
    res.status(200).json({
      categories
    })
  } catch(err) {
    console.log("Error", err)
    res.status(400).json({
      msg: 'Error fetching categories'
    })
  }
}

async function getShopCategories(req, res) 
{



//   let msg={};
//     msg.params = req.params;
//     msg.path = "get_shopcategories";

//     make_request('category_topic',msg, function(err,results){
//         console.log('in result');
//         console.log(results);
//         if (err){
//             console.log("Inside err"+err);
//             res.json({
//                 status:"error",
//                 msg:"System Error, Try Again."
//             })
//         }else{
//             console.log("Inside else");
//             res.status(results.status).json(results.result);

//                 res.end();
//             }
        
//     });
    if ( !req.params || (req.params && (!req.params.shopId || !req.params.userId))) 
    {
      return res.status(400).send({
        message: "Invalid Request",
      });
    } 
    else 
    {
      let categoriesRes = await CategoryClass.getShopCategories(req.params.shopId);
      if(categoriesRes)
      {
        res.status(200).json({
          categories: categoriesRes
         });
      }else
      {
        res.status(400).json({
          msg: 'Error fetching categories'
        })
      }
    }
}


//MY SQL Connection
// function createNewFavoriteItem(req, res) {
//   if (!req.params || (req.params && (!req.params.shopId || !req.params.userId))) {
//       return res.status(400).send({ message: "Invalid Request"});
//   } else {
//       const categoryId = `ct-${uuid()}`;
//       const insertQuery = `INSERT INTO category (_id, name, shopId, createdBy, isSystem) VALUES ('${categoryId}', '${req.body.name}', '${req.params.shopId}', '${req.params.userId}', ${false})`;
//       connection.query(insertQuery, function (err, result) {
//       if (err) throw err;
//       console.log("Data Created");
//       return res.send({
//           name: req.body.name,
//           shopId: req.params.shopId,
//           createdBy: req.params.userId,
//       });
//       });
//   }
// }

// async function getAllCategories(erq, res) {
// try {
//   let categories = await query(`select * from category`);
//   res.status(200).json({
//     categories
//   })
// } catch(err) {
//   console.log("====Err : ", err)
//   res.status(400).json({
//     msg: 'Error fetching categories'
//   })
// }
// }

// function getShopCategories(req, res) {
//   if (
//     !req.params ||
//     (req.params && (!req.params.shopId || !req.params.userId))
//   ) {
//     return res.status(400).send({
//       message: "Invalid Request",
//     });
//   } else {
//     connection.query(
//       `SELECT * FROM category WHERE shopId = ? OR isSystem = True`,
//       req.params.shopId,
//       (err, results) => {
//         if (err) throw err;
//         console.log("Data Found");
//         res.send({
//             categories: results
//         });
//       }
//     );
//   }
// }


let endpoints = {
  '/users/:userId/categories': [
    {
        method: 'GET',
        callbacks: [getAllCategories]
    }
],
    '/users/:userId/shops/:shopId/categories': [
        {
            method: 'GET',
            callbacks: [getShopCategories]
        },
        {
            method: 'POST',
            callbacks: [createNewCat]
        }
    ]
}

export {endpoints}