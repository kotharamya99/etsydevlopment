import Header from "./Header";
import CartProduct from "./CartProduct";
import axios from "axios";
import React, { Component, useState, useEffect } from "react";
import { loadCart } from "../actions/index";
import { connect, useDispatch, useStore } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import Favourites from "./Favourites";
import Product from "./Product";
import { removeFromCart, addToCart } from "../actions/index";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faCartShopping,
  faHeart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

export default function Cart(props) {
  const a = "Etsy_logo.png";
  const dispatch = useDispatch();
  const [username, setName] = useState("Ron");
  const [email, setEmail] = useState(0);
  const [password, setPassword] = useState("");
  const [usertype, setUsertype] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [validUser, setUser] = useState(false);
  const [favouriteIDs, setFavouriteIDs] = useState([]);
  const [gotData, setGotData] = useState(false);
  const [cartProducts, setcartProducts] = useState(null);
  const [allProducts, setallProducts] = useState(null);
  // console.log(username, password, usertype);

  const store = useStore().getState();
  // console.log(store);
  const ownerid = store.currUser.email;

  useEffect(async () => {
    // console.log(store.cart.products);

    //   if(store.cart.length != 0){
    //     console.log("not loading");
    //     // console.log(store.cart);
    //     setcartProducts(store.cart)
    // // console.log(cartProducts);
    // setGotData(true)
    //   }

    // else{
    console.log("loading");

    await axios
      .get("http://localhost:4000/product/getAllProducts")
      .then((response) => {
        // console.log(response);
        let allProds = response.data;

        axios
          .post("http://localhost:4000/product/getCart", 
          { email: ownerid })
          .then((response) => {
            // console.log(response);
            let responseCart = response.data;
            let cart = [];
            responseCart.forEach((element) => {
              cart.push(element.productID);
              cart.push(element.CartQuantity);
              // console.log(element.productID);
            });

            // console.log("all favs");
            // console.log(allFavs);

            // setFavouriteIDs(allFavs);

            // console.log("fav IDs");
            // console.log(favouriteIDs);
            let cartProducts = allProds.filter((product) => {
              // console.log(cart.includes(product.idnew_table));
              // console.log(product.idnew_table);
              return cart.includes(product.idnew_table);
            });
            setcartProducts(cartProducts);
            dispatch(
              loadCart({
                products: cartProducts,
              })
            );
            setGotData(true);
          });
        // let img = await response.blob();
        // console.log(img);
        // let imgUrl = window.webkitURL.createObjectURL(img);
        // setPic(imgUrl);
      });

    // }
  }, []);

  const handleRemoveFromCart = (product) => {
    // e.preventDefault()
    // console.log(product);
    // setcartProducts(null)
    setGotData(false);
    axios
      .post("http://localhost:4000/product/removeFromCart", {
        productID: product.idnew_table,
        userID: ownerid,
      })
      .then((res) => {
        // console.log(res);
        dispatch(
          removeFromCart({
            productID: product.idnew_table,
          })
        );
        setcartProducts(
          cartProducts.filter((prod) => {
            return prod.idnew_table != product.idnew_table;
          })
        );
        setGotData(true);
        // console.log(cartProducts);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Header></Header>
      <div className="row" style={{ padding: "20px" }}>
        <div className="col-4"></div>
        <div className="col-4"></div>
        <div className="col-4 row justify-content-center">
          <button className="btn btn-primary">Checkout</button>
        </div>
      </div>
      {gotData && (
        <div className="container products-container">
          <div className="row">
            {cartProducts.map((product) => (
              <CartProduct
                key={product.idnew_table}
                product={product}
                onRemove={handleRemoveFromCart}
              ></CartProduct>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}