import React,{useEffect,useContext,useState} from 'react';
import { GlobalContext } from "../context/Provider";
import config from "../utils/config.js";
import axiosInstance from "../utils/axios";
import{useNavigate,useParams} from 'react-router-dom';
import "../styles/UserShop.css";
import FavoriteItem from "./FavoriteItem";
import ShopProducts from './ShopProducts';
import ShopModal from './ShopModal';
import { Button } from "react-bootstrap";
import { useSelector } from 'react-redux';
function Shop() {

  const {user} = useSelector((state)=>state.user);
  const {id} = useParams();
  const navigate = useNavigate();
  const [shopDetails,setShopDetails] = useState({});
  const [userDetails,setUserDetails] = useState({});
  const [shopProducts,setShopProducts] = useState([]);
  //const { authState, authDispatch } = useContext(GlobalContext);
  
  const getShopDetails = async ()=>
  {
    console.log("SHOP ID"+id);
    try{
    const response = await axiosInstance().get(`/users/${user.userId}/shops/${id}`,{headers:{'Authorization':localStorage.getItem("token")}});
    if(response && response.data)
    {
      setShopDetails(response.data);
      console.log(response.data);
    }
    else
    {
      console.log("Error getting shop details from Shop API");
    }
    }catch(e)
    {
      console.log("Error getting shop details from Shop API"+e);
    }
  }

  const getShopProducts = async ()=>
  {
    try
    {
      if(id)
      {
      let bodyFormData = {
        priceRange: [],
        categoryIds: [],
        shopIds: [],
        excludeOutOfStock: false,
        search:"",
        excludeShopIds:[]
      }
      bodyFormData.shopIds.push(id);
      const response = await axiosInstance().post(`/users/${user.userId}/products`,bodyFormData,{headers:{'Authorization':localStorage.getItem("token")}});
      console.log(`/users/${user.userId}/shops/${shopDetails._id}/products`);
      if(response.data)
      {
        setShopProducts(response.data.products);
        console.log(response.data.products);
      }
      else
      {
        console.log("Error getting shop products from Shop API");
      }
    }
  }
    catch(e)
    {
      console.log("Error getting shop products from Shop API"+e);
    }

  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token){
        navigate("/login", {replace:true});
    }else{
      getShopDetails();
      getShopProducts();
    }
  },[]);

  useEffect(() => {
    
  },[shopProducts]);

  return (
    <div className='container'>
    <div className="row">
        <div className="col-md-8">
          <div className="card profile-header" style={{marginTop:"30px"}}>
                  <div className="body">
                      <div className="row">
                          <div className="col-lg-4 col-md-4 col-12">
                              <div className="profile-image float-md-right"> <img src={shopDetails?.imageUrl?shopDetails?.imageUrl:"https://washingtoniowa.gov/wp-content/plugins/yith-woocommerce-multi-vendor-premium/assets/images/shop-placeholder.jpg"} alt=""  width="100px" height="100px"/> </div>
                          </div>
                          <div className="col-lg-8 col-md-8 col-12">
                              <br />
                              <h2 className="m-t-0 m-b-0">{shopDetails?.name}</h2>
                              <span className="job_post">Total Sales Count {shopDetails?.totalSalesCount} | </span>
                              <span className="job_post">On Etsy since - {shopDetails?.createdOn?.slice(0,10)}</span>
                              <br /> <br />
                          </div>                
                      </div>
                  </div>                    
          </div>
        </div>
        <div className="col-md-4">
        <div className="card profile-header" style={{marginTop:"30px",height:"230px"}}>
                  <div className="body">
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                        <h6 className="small lead text-black-50 text-center">SHOP OWNER</h6>
                          <div className="profile-image float-md-right rounded-circle" style={{margin: "0px 110px"}}> <img className='' src={shopDetails?.ownerDetails?.imageUrl?shopDetails?.ownerDetails?.imageUrl:"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="" width="100px" height="100px"/> </div>
                              <br />
                              <p className="mt-1 m-b-0 text-center">{shopDetails?.ownerDetails?.username}</p>
                              <br /> <br />
                          </div>                
                    </div>
                  </div>                    
          </div>
      </div>
    </div>

    <div className="container">
      <div className="row">          
          {shopProducts && shopProducts.map((eachFavoriteItem)=>{
            return <ShopProducts key={eachFavoriteItem._id} item={eachFavoriteItem} shopOwner={shopDetails?.ownerDetails?._id} loggedUser={user?.userId}/>
          })} 
      </div>
    </div>
 </div>


  )
}

export default Shop