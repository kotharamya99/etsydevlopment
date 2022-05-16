import React,{useState,useContext} from 'react';
import { GlobalContext } from "../context/Provider";
import "../styles/NewShop.css";
import axiosInstance from "../utils/axios";
import config from "../utils/config.js";
import {useNavigate} from "react-router-dom";
import { useSelector } from 'react-redux';
function NewShop() {

  const [shopName, setShopName] = useState("");
  const [shopAvailable, setShopAvailable] = useState("3");
  const navigate = useNavigate();
  //const { authState, authDispatch } = useContext(GlobalContext);
  const {user} = useSelector((state)=>state.user);
  const createShop = async ()=>
  {
  
    if(shopName)
    {
      const reqBody = {};
      reqBody.name = shopName;
      const response = await axiosInstance().post(`/users/${user.userId}/shops`,reqBody,{headers:{'Authorization':localStorage.getItem("token")}});
      if(response)
      {
        navigate("/usershop");

      }else
      {
        console.log("SHOP creation unsuccessfull");
      }


    }
  }
  const checkAvailability = async ()=>
  {
    if(shopName)
    {
      const response = await axiosInstance().get(`/users/${user.userId}/shop/checkavailability?shopname=${shopName}`,{headers:{'Authorization':localStorage.getItem("token")}});
      if(response && response.data)
      {
        if(response.data.available==true)
        {
          setShopAvailable("1");
        }else
        {
          setShopAvailable("2");
        }
      }else{
          console.log("Error Response from Shop API");
        }
    }
  }
  return (
    <div className="container" style={{marginTop:"70px", marginLeft:"200px"}}>
            <div className="row" style={{marginLeft:"15px"}}>
                <div className="col-xl-12 col-lg-12 col-md-12">
                    <h4 className="m-t-0 m-b-0">Name your Shop</h4>
                </div>
            </div>
         <div>
            <div className="col-xl-6 col-lg-6 col-md-6">
                <div className="input-group rounded">
                    <input type="search" className="form-control rounded" placeholder="Enter Shop Name" aria-label="Search" aria-describedby="search-addon" onChange={(e)=>{setShopName(e.target.value)}}/>
                    {/* <span className="input-group-text border-0" id="search-addon">
                        <i className="fa fa-search fa-2x"></i>
                    </span> */}
                    <button className='checkAvail-btn' onClick={checkAvailability}>Check Availability</button>
                </div>
            </div>
            {shopAvailable == "1" &&
            <div className="create-shop-avl">
              <div className="shopcreate-success">Available!</div>
              <button className="createShop-btn" onClick={createShop} variant="outline-secondary" id="button-addon2">Create Shop</button>
            </div>
            }
            {shopAvailable == "2" &&
              <div className="create-shop-notavl">
                <div className="shopcreate-error">Shop Name Already taken! Please choose a different name to continue</div>
              </div>
            }
        </div>
    </div>
  )
}

export default NewShop