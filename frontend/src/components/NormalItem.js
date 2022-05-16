import React from 'react';
import {useNavigate} from "react-router-dom";
import {NavLink} from "react-router-dom";
import axiosInstance from "../utils/axios";
function NormalItem({key,item}) {

    const navigate = useNavigate();
    const viewItemOverview = (item)=>{
        if(item.product._id) {
             navigate("/productpage/"+item.product._id);
        }
    }

  return (
    <>
    <div class="col-4">
    <div className="product">
        <div className="product-img">
            <img src={item.product.imageUrl} alt=""></img>
            <div className="product-label">
                <span className="sale">-30%</span>
                <span className="new">NEW</span>
            </div>
        </div>
        <div className="product-body">
            <h3 className="product-name"><a href="" onClick={()=>{viewItemOverview(item)}}> {item.product.name}</a></h3>
            <h4 className="product-price">{item.product.price}<del className="product-old-price">{item.product.price-(30/100)*item.product.price}</del></h4>
            <div className="product-rating">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
            </div>
            <h4 className="product-description">{item.product.description}</h4>
            <div className="product-btns">
                <button className="add-to-wishlist">
                    <i className="fa fa-heart-o" style={{color:"red"}}></i>
                    <span className="tooltipp">add to wishlist</span>
                </button>
                <button className="add-to-compare"><i className="fa fa-exchange"></i><span className="tooltipp">add to compare</span></button>
                <button className="quick-view"><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
            </div>
        </div>
        <div className="add-to-cart">
            <button className="add-to-cart-btn"><i className="fa fa-shopping-cart"></i> add to cart</button>
        </div>
        </div>
        </div>
    </>
  )
}

export default NormalItem