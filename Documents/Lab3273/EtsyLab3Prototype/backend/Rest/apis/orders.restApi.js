import _ from "lodash";
import OrdersClass from "../../services/orders.js";


async function getOrders(req, res) {
  try {
    let orderData = await OrdersClass.getOrders(req.params.userId);
    let productIds = _.map(orderData, 'productId');
    let productData = await OrdersClass.getOrderProducts(productIds);
    let productIdsMap = _.keyBy(productData, '_id');
    orderData = _.map(orderData, (orderItem) => {
      let productId = orderItem.productId;
      orderItem.product = productIdsMap[productId];
      return orderItem;
    })
    res.status(200).json(orderData);
  } catch (err) {
    log("err ===>", err);
    res.status(400).json({ msg: "Error in fetching orders" });
    return;
  }
};
//MY SQL
// async function getOrders(req, res) {
//   try {
//     let orderData = await query("SELECT * FROM orders WHERE createdBy = ? ORDER BY createdOn DESC;", req.params.userId);
//     let productIds = _.map(orderData, 'productId');
//     let productData = await query(`SELECT * FROM products WHERE  _id IN ("${productIds.join('", "')}") ORDER BY createdOn DESC`);
//     let productIdsMap = _.keyBy(productData, '_id');
//     orderData = _.map(orderData, (orderItem) => {
//       let productId = orderItem.productId;
//       orderItem.product = productIdsMap[productId];
//       return orderItem;
//     })
//     res.status(200).json(orderData);
//   } catch (err) {
//     log("err ===>", err);
//     res.status(400).json({ msg: "Error in fetching orders" });
//     return;
//   }
// };


let endpoints = {
  "/users/:userId/orders": [
    {
      method: "GET",
      callbacks: [getOrders]
    }
  ]
};

export { endpoints };
