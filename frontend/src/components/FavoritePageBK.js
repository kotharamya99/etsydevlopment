// import React, {useEffect,useContext,useState} from "react";
// import {NavLink} from "react-router-dom";
// import axiosInstance from "../utils/axios";
// import "../styles/FavoritesPage.css"
// import { Input } from "semantic-ui-react";
// import {useNavigate} from "react-router-dom";
// import { GlobalContext } from "../context/Provider";
// import FavoriteItem from "./FavoriteItem";
// import config from "../utils/config.js";
// import {
//   favoritesAction,
//   deleteFavoritesAction,
// } from "../context/actions/favoritesAction";
// const FavoritesPage = () => {
//   const [favoriteItemsList, setFavoriteItemsList] = useState([]);
//   	const { authState, authDispatch } = useContext(GlobalContext);
//   const [query, setQuery] = useState("");
//   const [userDetails, setUserDetails] = useState({
//     username:"",
//     imageUrl:"",
//     dob:"",
//     gender:"",
//     address:"",
//     city:"",
//     state:"",
//     country:"",
//     about:"",
//     email:"",
//     phoneNo:""
//   });
//   const { globalDispatch, globalState } = useContext(GlobalContext);
//   const getUserDetails = async () =>
//   {
//     try{
//     console.log("State"+JSON.stringify(globalState));
<<<<<<< HEAD
//       const response = await axiosInstance().get(`/users/${authState.auth.data.data.userId}/profile`,{headers:{'Authorization':localStorage.getItem("token")}});
=======
//       const response = await axiosInstance().get(`${config.baseUrl}/users/${authState.auth.data.data.userId}/profile`,{headers:{'Authorization':localStorage.getItem("token")}});
>>>>>>> b8ae70d35a253ff0a93fc4277d8dc193ab40b46b
//       if(response && response.data){
//         console.log("RES"+response);
//         setUserDetails({
//           username:response.data.username,
//           imageUrl:response.data.imageUrl,
//           dob:response.data.dob,
//           gender:response.data.gender,
//           address:response.data.address,
//           city:response.data.city,
//           state:response.data.state,
//           country:response.data.country,
//           about:response.data.about,
//           email:response.data.email,
//           phoneNo:response.data.phoneNo
//         })
//       }else{
//         console.log("Error Getting Response from Favorite API");
//       }

//     }catch(e)
//     {
//       console.log("Error Getting Response from Favorite API"+e);
//     }
//   }
//   const getFavorites = async () => {
<<<<<<< HEAD
//     console.log("url sa "+`/users/${authState.auth.data.data.userId}/favorites`,{headers:{'Authorization':localStorage.getItem("token")}});
//     try{
//         const response = await axiosInstance().get(`/users/${authState.auth.data.data.userId}/favorites`,{headers:{'Authorization':localStorage.getItem("token")}});
=======
//     console.log("url sa "+`${config.baseUrl}/users/${authState.auth.data.data.userId}/favorites`,{headers:{'Authorization':localStorage.getItem("token")}});
//     try{
//         const response = await axiosInstance().get(`${config.baseUrl}/users/${authState.auth.data.data.userId}/favorites`,{headers:{'Authorization':localStorage.getItem("token")}});
>>>>>>> b8ae70d35a253ff0a93fc4277d8dc193ab40b46b
//         //console.log("API"+JSON.stringify(response));
//         if(response && response.data){
//           setFavoriteItemsList(response.data.favorites);
//             console.log("items in auth"+JSON.stringify(favoriteItemsList));
//         }else{
//           console.log("Error Getting Response from Favorite API")
//         }
//     }catch(e){
//         console.log(e);
//     }
// }




// 	const navigate = useNavigate();
// 	useEffect(() => {
//         const token = localStorage.getItem("token");
//         if(!token){
//             navigate("/login", {replace:true});
//         }else{
// 			   console.log("USER ID"+JSON.stringify(authState.auth.data.data.userId));
//          getFavorites();
//          getUserDetails();
//         }
//     },[]);




//     // Search Logic End
//   var {
//     user,
//     favorites: { data },
//   } = globalState;
//   console.log("user from globalState", user?.userId);
//   const userId = user?.userId;
//   console.log("favorites page", data);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//     console.log("UUUUU"+userId);
//     favoritesAction(userId)(globalDispatch);
//   }, [userId]);

//   useEffect(() => {
//     favoritesAction(userId, query)(globalDispatch);
//   }, [query]);

//   // useEffect(() => {
//   //   favoritesAction(userId, query)(globalDispatch);
//   // }, [data]);

//   const handleDeleteFav = (id) => {
//     console.log("delete id", id);
//     deleteFavoritesAction(userId, id)(globalDispatch);
//     // favoritesAction(userId)(globalDispatch);
//   };

//   const productsDiv = data?.favorites.map((item, index) => {
//     let pageLink = `/product/${item._id}`;
//     let favProductId = item._id;
//     return (
      
//       <>
//       <div class="col-4">
//       <div className="product">
//           <div className="product-img">
//               <img src={item.imageUrl} alt=""></img>
//               <div className="product-label">
//                   <span className="sale">-30%</span>
//                   <span className="new">NEW</span>
//               </div>
//           </div>
//           <div className="product-body">
//               <h3 className="product-name"><a href="" > {item.name}</a></h3>{/* onClick={()=>{viewItemOverview(item)}} */}
//               <h4 className="product-price">{item.price}<del className="product-old-price">{item.price-(30/100)*item.price}</del></h4>
//               <div className="product-rating">
//                   <i className="fa fa-star"></i>
//                   <i className="fa fa-star"></i>
//                   <i className="fa fa-star"></i>
//                   <i className="fa fa-star"></i>
//                   <i className="fa fa-star"></i>
//               </div>
//               <h4 className="product-description">{item.description}</h4>
//               <div className="product-btns">
//                   <button className="add-to-wishlist" onClick={() => handleDeleteFav(item._id)}>
//                       <i className="fa fa-heart-o" style={{color:"red"}}></i>
//                       <span className="tooltipp">add to wishlist</span>
//                   </button>
//                   <button className="add-to-compare"><i className="fa fa-exchange"></i><span className="tooltipp">add to compare</span></button>
//                   <button className="quick-view"><i className="fa fa-eye"></i><span className="tooltipp">quick view</span></button>
//               </div>
//           </div>
//           <div className="add-to-cart">
//               <button className="add-to-cart-btn"><i className="fa fa-shopping-cart"></i> add to cart</button>
//           </div>
//           </div>
//           </div>
//       </>
             
            
//     );
//   });









//   return (
    
//        <>
//     <div class='row' >
//         <div class='col-xl-6 col-lg-7 col-md-12' >
//           <div class='card profile-header' >
//             <div class='body'>
//               <div class='row'>
//                 <div class='col-lg-4 col-md-4 col-12'>
//                   <div class='profile-image float-md-right'>
//                     {" "}
//                     <img
//                       src={userDetails.imageUrl}
//                       alt='Profile Image Not Available'
//                       width = "100px"
//                       height = "100px"
//                     />{" "}
//                   </div>
//                 </div>
//                 <div class='col-lg-8 col-md-8 col-12'>
//                   <br />
//                   <h4 class='m-t-0 m-b-0'>{authState.auth.data.data.username}</h4>
//                   <br />
//                   <div>
//                     <NavLink to="/profileEdit"><button class="editProfile-btn">
//                       Edit Profile <i className='fa fa-pencil'></i>{" "}
//                     </button></NavLink>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     <div class='row'>

//     <div className="container">
//         <div className="row flex-lg-nowrap">
//         <div className="col-12 col-lg-auto mb-3" style={{width: "200px"}}>
//         </div>

//            <div className="col">
//             <div className="row">
//             <div className="col mb-3">
//                 <div className="card" style={{
//                       width: "80%",
//                       float:"left",
//                       margin: "0 auto"
//                       }}>
//                 <div className="card-body" >
//                     <div className="e-profile">
                    
//                     <ul className="nav nav-tabs">
//                         <li className="nav-item"><a href="" className="active nav-link">Details</a></li>
//                     </ul>
//                     <div className="tab-content pt-3">
//                         <div className="tab-pane active">
//                         <form className="form" noValidate="">
//                             <div className="row">
//                             <div className="col">
//                                 <div className="row">
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>Full Name</label>
//                                     <p>{userDetails.username}</p>
//                                     </div>
//                                 </div>
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>Date of Birth</label>
//                                     <p>{userDetails.dob.slice(0,10)}</p>
//                                     </div>
//                                 </div>
//                                 </div>
//                                 <div className="row">
//                                 <div className="col">
//                                     <div className="form-group">
//                                         <label>Gender</label>
//                                         <p>{userDetails.gender}</p>
//                                     </div>
//                                 </div>
//                                 </div>
//                                 <div className="row">
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>Email</label>
//                                     <p>{userDetails.email}</p>
//                                     </div>
//                                 </div>
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>Phone Number</label>
//                                     <p>{userDetails.phoneNo}</p>
//                                     </div>
//                                 </div>
//                                 </div>
//                                 <div className="row">
//                                 <div className="col mb-3">
//                                     <div className="form-group">
//                                     <label>About</label>
//                                     <p>{userDetails.about}</p>
//                                     </div>
//                                 </div>
//                                 </div>
//                                 <div className="row">
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>Address</label>
//                                     <p>{userDetails.address}</p>
//                                     </div>
//                                 </div>

//                                 </div>
//                                 <div className="row">
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>City</label>
//                                     <p>{userDetails.city}</p>
//                                     </div>
//                                 </div>
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>State</label>
//                                     <p>{userDetails.state}</p>
//                                     </div>
//                                 </div>
//                                 </div>
//                                 <div className="row">
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>Country</label>
//                                     <p>{userDetails.country}</p>
//                                     </div>
//                                 </div>
//                                 </div>

//                             </div>
//                             </div>
//                         </form>

//                         </div>
//                     </div>
//                     </div>
//                 </div>
//                 </div>
//             </div>
//             </div>

//         </div>
//         </div>
//         </div>












//         <div class='col-xl-6 col-lg-6 col-md-6'>
//           <h4 class='m-t-0 m-b-0'>Favourites</h4>
//         </div>
//         <div class='col-xl-6 col-lg-6 col-md-6'>
//           <div class='input-group rounded'>
//             <Input
//               icon={{ name: "search", link: true }}
//               placeholder='Search...'
//               style={{ width: "370px" }}
//             />
//             {/* <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" /> */}
//             {/* <span class="input-group-text border-0" id="search-addon">
//                             <i class="fa fa-search fa-2x"></i>
//                         </span> */}
//           </div>
//         </div>
//       </div>

//     {/*<div class="container">
//       <div class="row">          
//         {favoriteItemsList && favoriteItemsList.map((eachFavoriteItem)=>{
//            return <FavoriteItem key={eachFavoriteItem._id} item={eachFavoriteItem}/>
//          })}
          
//       </div>
//         </div>*/}
//         <div className="row">{productsDiv}</div>
//        </>                            
//   )
// }

// export default FavoritesPage;
