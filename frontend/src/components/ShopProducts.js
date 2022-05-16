import React from 'react';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import axiosInstance from "../utils/axios";

function ShopProducts({item,handleEdit,shopOwner,loggedUser}) {
    const navigate = useNavigate();
    let pageLink = `/product/${item._id}`;
    let pageLinkEdit = `/productedit/${item._id}`;
    



  return (
    <>
 <div className="col-4" style={{width:"250px",height:"500px"}}>
    <div className="product">
        <div className="product-img">
            <img src={item.imageUrl} style={{width:"240px",height:"200px"}} alt=""></img>
            <div className="product-label">
                <span className="sale">-30%</span>
                <span className="new">NEW</span>
            </div>
        </div>
        <div className="product-body">
            <h3 className="product-name"><NavLink to={pageLink}><a href="" > {item.name}</a></NavLink></h3>
            <h4 className="product-price">$ {item.price}<del className="product-old-price">{item.price-(30/100)*item.price}</del></h4>
            <div className="product-rating">
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
                <i className="fa fa-star"></i>
            </div>
            <h4 className="product-description">{item.description}</h4>
            {item.quantity==0 && <h4 className="product-description" style={{color:"red"}}>OUT OF STOCK!</h4>}
            <div className="product-btns">
                {/* <button className="add-to-wishlist"><i className="fa fa-heart-o" style={{color:"red"}}></i><span className="tooltipp">add to wishlist</span></button> */}
                {shopOwner == loggedUser && <NavLink to={pageLinkEdit}> <button className="add-to-compare"><i className="fa fa-pencil"></i><span className="tooltipp">Edit Product</span></button></NavLink>}
                {/* <button className="quick-view"><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button> */}
            </div>
        </div>
        {/* <div className="add-to-cart">
            <button className="add-to-cart-btn"><i className="fa fa-shopping-cart"></i> add to cart</button>
        </div> */}
        </div>
        </div>
    </>
  )
}

export default ShopProducts