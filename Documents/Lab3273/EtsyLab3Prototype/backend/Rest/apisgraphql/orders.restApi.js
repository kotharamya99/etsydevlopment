import _ from "lodash";
import OrdersClass from "../../services/orders.js";


async function getOrders(args) {
  try {
    let orderData = await OrdersClass.getOrders(args.userId);
    let productIds = _.map(orderData, 'productId');
    let productData = await OrdersClass.getOrderProducts(productIds);
    let productIdsMap = _.keyBy(productData, '_id');
    orderData = _.map(orderData, (orderItem) => {
      let productId = orderItem.productId;
      orderItem.product = productIdsMap[productId];
      return orderItem;
    })
    console.log(orderData);
    return orderData;
  } catch (err) {
    log("err ===>", err);
    return { msg: "Error in fetching orders" };
  }
};

export { getOrders };
