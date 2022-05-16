import React, {useEffect,useContext,useState} from "react";
import { useSelector } from 'react-redux';
import {NavLink} from "react-router-dom";
import axiosInstance from "../utils/axios";
import axios from "axios";
import "../styles/FavoritesPage.css"
import { Input } from "semantic-ui-react";
import {useNavigate} from "react-router-dom";
import { GlobalContext } from "../context/Provider";
import FavoriteItem from "./FavoriteItem";
import config from "../utils/config.js";
import { putCartAction } from "../context/actions/cartAction";
import {
  favoritesAction,
  deleteFavoritesAction,
} from "../context/actions/favoritesAction";
const FavoritesPage = () => {

  const {user} = useSelector((state)=>state.user);
  const [favoriteItemsList, setFavoriteItemsList] = useState([]);
  const { globalDispatch, globalState } = useContext(GlobalContext);
  const { authState, authDispatch } = useContext(GlobalContext);
  const [query, setQuery] = useState("");
  const [userDetails, setUserDetails] = useState({
    username:"",
    imageUrl:"",
    dob:"",
    gender:"",
    address:"",
    city:"",
    state:"",
    country:"",
    about:"",
    email:"",
    phoneNo:""
  });
  
  const getUserDetails = async () =>
  {
    try{
    
      const response = await axiosInstance().get(`/users/${user.userId}/profile`,{headers:{'Authorization':localStorage.getItem("token")}});
      if(response && response.data){
        console.log("RES"+JSON.stringify(response));
        setUserDetails({
          username:response.data.username,
          imageUrl:response.data.imageUrl,
          dob:response.data.dob,
          gender:response.data.gender,
          address:response.data.address,
          city:response.data.city,
          state:response.data.state,
          country:response.data.country,
          about:response.data.about,
          email:response.data.email,
          phoneNo:response.data.phoneNo
        })
      }else{
        console.log("Error Getting Response from Favorite API");
      }

    }catch(e)
    {
      console.log("Error Getting Response from Favorite API"+e);
    }
  }
  const getFavorites = async () => {
    console.log("url sa "+`/users/${user.userId}/favorites`,{headers:{'Authorization':localStorage.getItem("token")}});
    try{
        const response = await axiosInstance().get(`/users/${user.userId}/favorites`,{headers:{'Authorization':localStorage.getItem("token")}});
        //console.log("API"+JSON.stringify(response));
        if(response && response.data){
          console.log(response.data.favorites);
          setFavoriteItemsList(response.data.favorites);
            console.log("items in auth"+JSON.stringify(favoriteItemsList));
        }else{
          console.log("Error Getting Response from Favorite API")
        }
    }catch(e){
        console.log(e);
    }
}
	const navigate = useNavigate();
	useEffect(() => {
        
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login", {replace:true});
        }else{
			   console.log("USER ID"+JSON.stringify(user.userId));
         getFavorites();
         getUserDetails();
        }
    },[]);

    useEffect(async() => 
    {
      const token = localStorage.getItem("token");
        if(!token){
            navigate("/login", {replace:true});
        }else{
      const response = await axiosInstance().get(`/users/${user.userId}/favorites?search=${query}`,{headers:{'Authorization':localStorage.getItem("token")}});
      if(response && response.data)
      {
        setFavoriteItemsList(response.data.favorites);
      }else
      {
        console.log("Search Failed");
      }
    }

    }, [query]);

  //   useEffect(() => {
  //     const token = localStorage.getItem("token");
  //     if(!token){
  //         navigate("/login", {replace:true});
  //     }else{
  //      console.log("USER ID"+JSON.stringify(authState.auth.data.data.userId));
  //      getFavorites();
  //      getUserDetails();
  //     }
  // },[favoriteItemsList]);

    

    const handleDeleteFav = async (id) => 
    {

      let favId = "";
      for(let i=0;i<favoriteItemsList.length;i++)
      { 
        if(favoriteItemsList[i].productId==id)
        {
          favId = favoriteItemsList[i]._id;
        }
      }
      const response = await axiosInstance().delete(`/users/${user.userId}/favorites/${favId}`,{headers:{'Authorization':localStorage.getItem("token")}});
      if(response && response.data)
      {
        console.log("DEL"+JSON.stringify(response.data));
        getFavorites();
      }
    };

    const addToCart = (productId) => {
      const token = localStorage.getItem("token");
        if (token) {
          console.log(productId);
        console.log(user.userId);
          putCartAction(user.userId, productId)(globalDispatch);
          //console.log("HI put cart action dispatch");
        }
      };


    const productsDiv = favoriteItemsList.map((item, index) => {
      console.log(item);
      let pageLink = `/product/${item.product._id}`;
      let favProductId = item.product._id;
      return (
        
        <>
        <div class="col-4" style={{width:"250px",height:"500px"}}>
        <div className="product">
            <div className="product-img">
                <img src={item.product.imageUrl}  style={{width:"240px",height:"200px"}} alt=""></img>
                <div className="product-label">
                    <span className="sale">-30%</span>
                    <span className="new">NEW</span>
                </div>
            </div>
            <div className="product-body">
                <h3 className="product-name"> <NavLink to={pageLink}><a href="" > {item.product.name}</a></NavLink> </h3>
                <h4 className="product-price">$ {item.product.price}<del className="product-old-price">{item.product.price-(30/100)*item.product.price}</del></h4>
                <div className="product-rating">
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                    <i className="fa fa-star"></i>
                </div>
                <h4 className="product-description">{item.description}</h4>
                {item.product.quantity==0 && <h4 className="product-description" style={{color:"red"}}>OUT OF STOCK!</h4>}
                <div className="product-btns">
                    <button className="add-to-wishlist" onClick={() => handleDeleteFav(item.product._id)}>  {/* */}
                        <i className="fa fa-heart-o" style={{color:"red"}}></i>
                        <span className="tooltipp">Remove from wishlist</span>
                    </button>
                    <button className="add-to-compare"><i className="fa fa-exchange"></i><span className="tooltipp">add to compare</span></button>
                    <button className="quick-view"><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
                </div>
            </div>
            <div className="add-to-cart">
                <button className="add-to-cart-btn" onClick={() => addToCart(item._id)}><i className="fa fa-shopping-cart"></i> add to cart</button>
            </div>
            </div>
            </div>
        </>
               
              
      );
    });


  return (
    
       <>
    <div class='row' >
        <div class='col-xl-6 col-lg-7 col-md-12' >
          <div class='card profile-header' style={{marginTop:"30px", marginLeft:"330px"}}>
            <div class='body'>
              <div class='row'>
                <div class='col-lg-4 col-md-4 col-12'>
                  <div class='profile-image float-md-right'>
                    {" "}
                    <img
                      src={userDetails?.imageUrl?userDetails?.imageUrl:"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                      alt='Profile Image Not Available'
                      width = "100px"
                      height = "100px"
                    />{" "}
                  </div>
                </div>
                <div class='col-lg-8 col-md-8 col-12'>
                  <br />
                  <h4 class='m-t-0 m-b-0'>{user?.username}</h4>
                  <br />
                  <div>
                    <NavLink to="/profileEdit"><button class="editProfile-btn">
                      Edit Profile <i className='fa fa-pencil'></i>{" "}
                    </button></NavLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div class='row'>

    <div className="container">
        <div className="row flex-lg-nowrap">
        <div className="col-12 col-lg-auto mb-3" style={{width: "200px"}}>
        </div>

           <div className="col">
            <div className="row">
            <div className="col mb-3">
                <div className="card" style={{
                      width: "80%",
                      float:"left",
                      margin: "0 auto"
                      }}>
                <div className="card-body" >
                    <div className="e-profile">
                    
                    <ul className="nav nav-tabs">
                        <li className="nav-item"><a href="" className="active nav-link">Details</a></li>
                    </ul>
                    <div className="tab-content pt-3">
                        <div className="tab-pane active">
                        <form className="form" noValidate="">
                            <div className="row">
                            <div className="col">
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>Full Name</label>
                                    <p>{userDetails?.username}</p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                    <label>Date of Birth</label>
                                    <p>{userDetails?.dob?.slice(0,10)}</p>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <p>{userDetails?.gender}</p>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>Email</label>
                                    <p>{userDetails?.email}</p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                    <label>Phone Number</label>
                                    <p>{userDetails?.phoneNo}</p>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col mb-3">
                                    <div className="form-group">
                                    <label>About</label>
                                    <p>{userDetails?.about}</p>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>Address</label>
                                    <p>{userDetails?.address}</p>
                                    </div>
                                </div>

                                </div>
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>City</label>
                                    <p>{userDetails?.city}</p>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                    <label>State</label>
                                    <p>{userDetails?.state}</p>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>Country</label>
                                    <p>{userDetails?.country}</p>
                                    </div>
                                </div>
                                </div>

                            </div>
                            </div>
                        </form>

                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>

        </div>
        </div>
        </div>

      </div>

  <div class="container">
    <br/>
    <div class="row justify-content-center">
   <div class="col-12 col-md-10 col-lg-8">
      <form class="card card-sm" onSubmit={(e)=>e.preventDefault()}>
         <div class="card-body row no-gutters align-items-center">
            <div class="col-auto">
            </div>
            <div class="col">
               <input onChange={(e) => setQuery(e.target.value)} class="form-control form-control-lg form-control-borderless" type="search" placeholder="Search in favorites"></input>
            </div>
            <div class="col-auto">
               <button class="btn btn-lg btn-success" class="search-btn">Search</button>
            </div>
         </div>
      </form>
   </div>
</div>

</div>

    {/*<div class="container">
      <div class="row">          
        {favoriteItemsList && favoriteItemsList.map((eachFavoriteItem)=>{
           return <FavoriteItem key={eachFavoriteItem._id} item={eachFavoriteItem}/>
         })}
          
      </div>
        </div>*/}
        <div className="row">{productsDiv}</div>
       </>                            
  )
}

export default FavoritesPage;
