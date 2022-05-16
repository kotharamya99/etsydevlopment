import { useContext, useEffect, useState, useCallback } from "react";
import { GlobalContext } from "../context/Provider";
//import { cartAction, deleteCartAction } from "../context/actions/cartAction";
import { NavLink,useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
//import {UPDATE_CART_ITEM_SUCCESS} from "../context/actions/actionTypes";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {cartAction} from "../Redux/Actions/cart.js";
import {postCartAction} from "../Redux/Actions/cart.js";
import {putCartAction} from "../Redux/Actions/cart.js";
import {deleteCartAction} from "../Redux/Actions/cart.js";
import { Form } from "react-bootstrap";
import { Add, Remove } from "@material-ui/icons";
const Cart = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  //const { globalDispatch, globalState } = useContext(GlobalContext);
  //const { authState, authDispatch } = useContext(GlobalContext);
  const {user} = useSelector((state)=>state.user);
  const {cart} = useSelector((state)=>state.cart);
  //const { user, cart } = globalState;
  const userId = user?.userId;
  const [msg,setMsg] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token)
    {
      navigate("/login");
    }else{
      dispatch(cartAction(user?.userId));
      //cartAction(user?.userId)(globalDispatch);
    }

  }, []);

  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  //console.log("Global Cart State is", globalState);
  //console.log("Cart is ", cart);

  const cartItems = cart?.cartItems ? cart.cartItems : [];

  useEffect(() => {
    console.log("cart total is", cartTotal);
    setCartCount(
      cartItems.reduce(
        (totalItems, cartItem) => (totalItems += cartItem.quantity),
        0
      )
    );
    setCartTotal(
      cartItems
        .reduce(
          (totalPrice, cartItem) => (totalPrice += cartItem?.product?.price * cartItem.quantity),
          0
        )
        .toFixed(2)
    );
  }, [cartItems,msg]);

  // const deleteCartItem = useCallback((cartId) => {
  //   console.log("I'm delete cart");
  //   dispatch(deleteCartAction(user?.userId, cartId));
  //   //deleteCartAction(user?.userId, cartId)(globalDispatch);
  //   // cartAction(userId)(globalDispatch);
  // }, []);


  const deleteCartItem = ((cartId) => {
    console.log("I'm delete cart");
    dispatch(deleteCartAction(userId, cartId));
    // dispatch(cartAction(userId));
    // cartAction(userId)(globalDispatch);
  });



  const checkOutCartItems = async ()=>
  {
    console.log(cartItems);

    
    axiosInstance()
		  .post(`/users/${user.userId}/cart/checkout`)
		  .then((response) => {
			console.log("response.data", response.data)
      setMsg(true);
      setTimeout(() => {setMsg(false) 
        navigate("/purchases")}, 2000);
      dispatch({ type: "UPDATE_CART_ITEM_SUCCESS", payload:[] })
      //navigate("/purchases");
			//setProduct(response.data)
			//setLoading(false)
		  })
		  .catch((err) => {
			//setLoading(false)
			console.log(err)
		  })
  }


  const updateCartItem = ((cartId, productId, quantity, isGiftWrap, giftWrapDescription) => {
    console.log("I'm update cart", quantity, isGiftWrap);
    dispatch(putCartAction(userId, productId, quantity, isGiftWrap, giftWrapDescription));
    // cartAction(userId)(globalDispatch);
  });

  
  let cartsDiv = cartItems.map((cartItem) => {
    return (
      <tr>
        <td data-th="Product">
          <div className="row">
            <div className="col-md-3 text-left">
              <img
                src={cartItem?.product?.imageUrl}
                alt=""
                className="img-fluid d-none d-md-block rounded mb-2 shadow "
              />
            </div>
            <div key={`default-checkbox`} className="mb-3">
            <Form.Check 
              type={"checkbox"}
              id={`default-checkbox`}
              label={`Add Gift Wrap`}
              onChange = {()=> updateCartItem(cartItem?._id,cartItem?.product?._id, null, !(cartItem?.isGift))}
              defaultChecked={cartItem?.isGift}
            />
            {console.log("Debug value is", cartItem?.isGift)}
            {cartItem?.isGift
            && <Form.Control type="text" placeholder="Gift Message" onChange={(e) => updateCartItem(cartItem?._id,cartItem?.product?._id, null, cartItem?.isGift, e.target.value)}/>
            }
          </div>
            <div className="col-md-9 text-left mt-sm-2">
              <h4>{cartItem?.product?.name}</h4>
              <p className="font-weight-light">{cartItem?.product?.shopName}</p>
            </div>
          </div>
        </td>
        <td data-th="Price">
          ${(cartItem?.product?.price * cartItem?.quantity).toFixed(2)}
        </td>
        <td data-th="Quantity">
          {/* <input
            type="number"
            value={cartItem?.quantity}
            className="form-control form-control-lg text-center"
          />
          {cartItem?.quantity.toString} */}

          <div style={{ padding: "10px 10px" }}>
                      <Remove style = {{cursor: "pointer"}} onClick={() => updateCartItem(cartItem?._id,cartItem?.product?._id, cartItem?.quantity - 1 )}  />
                          {cartItem?.quantity}
                        <Add style = {{cursor: "pointer"}} onClick={() => updateCartItem(cartItem?._id,cartItem?.product?._id, cartItem?.quantity + 1 )} />
              </div>
        </td>
        <td className="actions" data-th="">
          <div className="text-right">
            <button
              className="btn btn-white border-secondary bg-white btn-md mb-2"
              onClick={() => deleteCartItem(cartItem?._id)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    );
  });

  return (
    <div className="container px-2 px-lg-2 my-5">
      <div className="row w-100">
        <div className="col-lg-12 col-md-12 col-12">
          <h3 className="display-5 mb-2 text-left" style={{color:"red"}}>Shopping Cart</h3>
          <br></br>
          <p className="mb-5 text-left" style={{color:"red"}}>
             {cartCount}  items in
            your cart
          </p>
          { cartItems.length!=0 && <table
            id="shoppingCart"
            className="table table-condensed table-responsive"
          >
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{cartsDiv}</tbody>
          </table> }
          { cartItems.length!=0 && <div className="float-right text-right">
            <h4>Subtotal:</h4>
            <h4>${cartTotal}</h4>
          </div> }
        </div>
      </div>
      <div className="row mt-2 d-flex align-items-center">
        { cartItems.length!=0 &&<div className="col-sm-6 order-md-2 text-right">
        <button style={{
            height: "40px",
            width: "100px",
            background: "#D10024",
            color: "#FFF",
            fontWeight: "700",
            border: "none"
          
        }} onClick={checkOutCartItems}>Checkout</button>
        </div> }
        <div className="col-sm-6 mb-3 mb-m-1 order-md-1 text-md-left">
        <NavLink to="/"><button style={{
          height: "40px",
          width: "100px",
          background: "#D10024",
          color: "#FFF",
          fontWeight: "700",
          border: "none",
          width:"150px"
      }}>Continue Shopping</button></NavLink>
        </div>
      </div>
      {msg &&
        <div class='alert alert-success' role='alert'>
           Order Placed Successfully !
        </div>
      }     
    </div>
  );
};

export default Cart;