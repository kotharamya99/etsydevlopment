import React, {useContext,useEffect,useState} from 'react'
import { GlobalContext } from "../context/Provider";
import {NavLink} from "react-router-dom";
import axiosInstance from "../utils/axios";
import {useNavigate} from "react-router-dom";
import config from "../utils/config.js";
import logout from "../context/actions/logout"
import { productsAction } from "../context/actions/productsAction";
import {getproducts} from "../Redux/Actions/product.js";
//import { useHistory } from "react-router-dom"
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

function Header() {
	const dispatch = useDispatch();
	const {user} = useSelector((state)=>state.user);
	// const {
	// 	authState: { auth: data },
	// 	globalDispatch,
	// 	globalState
	//   } = useContext(GlobalContext);
	
	// const { user, cart } = globalState;
	// const cartItems = cart?.data ? cart.data.cartItems : [];
	 const navigate = useNavigate();
	// //const history = useHistory()
	// const { authState, authDispatch } = useContext(GlobalContext);
    
	
	 // const userId = user?.userId;
	
	//   console.log("user from globalState | Header", user);
	
	   const [query, setQuery] = useState("");
	  useEffect(() => {
		console.log("Search Items are", query);
		console.log("products Search action dispatch");
		dispatch(getproducts(user?.userId,query));
	  }, [query]);

	  const handleLogout = () => {
		  console.log("Asas");
		localStorage.removeItem("token")
		//localStorage.removeItem("userDetails")
		dispatch({
			type: "LogoutUser",
		})
		navigate("/", {replace:true});
	  }
	  const handleProfile = ()=>{
		const token = localStorage.getItem("token");
        if(!token){
            navigate("/login", {replace:true});
        }else
		{
			navigate("/profile", {replace:true});
		}
	  }

	  const handlePurchase = ()=>{
		navigate("/purchases", {replace:true});
	  }
	const shopView = async (e)=>
	{
		e.preventDefault();
		const token = localStorage.getItem("token");
		if(!token){
			navigate("/login", {replace:true});
		}
		else
		{
			try{
				console.log(`/users/${user.userId}/shops`);
				const response = await axiosInstance().get(`/users/${user.userId}/shops`,{headers:{'Authorization':localStorage.getItem("token")}});
				console.log(`/users/${user.userId}/shops`);
				console.log(response);
				if(response.data)
				{
					if(response.data.hasOwnProperty("msg"))
					{
						navigate("/newshop", {replace:true});
					}else
					{
						navigate("/usershop", {replace:true});
					}
				}else
				{
					console.log("Error Getting Response from Shops API")
				}

			}catch(e)
			{
				console.log(e);
			}
		}
	}
   


  return (
    <header>
			{/*<!-- MAIN HEADER -->*/}
			<div id="header">
				{/*<!-- container -->*/}
				<div className="container">
					{/*<!-- row -->*/}
					<div className="row">
						{/*<!-- LOGO -->*/}
						<div className="col-md-2">
							<div className="header-logo">
								
							<NavLink to="/" style={{textDecoration:"none"}}><h1 style={{color: "white", fontSize:"50px" }}>ETSY</h1> </NavLink>
								
							</div>
						</div>
						{/*<!-- /LOGO -->*/}

						{/*<!-- SEARCH BAR -->*/}
						<div className="col-md-4">
							<div className="header-search">
								<form onSubmit={(e)=>{e.preventDefault()}}>
									<input className="input" placeholder="Search here" onChange={(e) => setQuery(e.target.value)}></input>
									<button className="search-btn">Search</button>
								</form>
							</div>
						</div>
						{/*<!-- /SEARCH BAR -->*/}

						{/*<!-- ACCOUNT -->*/}
						<div className="col-md-6 clearfix">
							<div className="header-ctn">
								{/*<!-- Wishlist -->*/}
								<div className="dropdown">
									<a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true" style={{textDecoration:"none"}}>
										<i className="fa fa-heart-o" aria-hidden="true"></i>
										<span>Your Wishlist</span>
									</a>
									<div className="cart-dropdown">
										<div className="cart-list">
											<div className="product-widget">
												<div className="product-body">
													<h3 className="product-name"><NavLink to="/profile" ><p>View your Profile</p></NavLink></h3>
												</div>
											</div>
										</div>
									</div>
								</div>
								{/*<!-- /Wishlist -->*/}

								{/*<!-- Cart -->*/}
								<div className="dropdown">
									<a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true" style={{textDecoration:"none"}}>
										<i className="fa fa-shopping-cart"></i>
										<span>Your Cart</span>
										{/* {cartItems!=0 && <div className="qty">{cartItems?.length}</div>} */}
									</a>
									<div className="cart-dropdown">
										<div className="cart-list">
											<div className="product-widget">
												<div className="product-body">
													<h3 className="product-name"><NavLink to="/cart"><p >View your Cart</p></NavLink></h3>
												</div>
											</div>
										</div>
									</div>
								</div>
			
								{/*<!-- /Cart -->*/}

								<div className="dropdown">
									<a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true" style={{textDecoration:"none"}}>
										<i className="fa fa-user-circle" aria-hidden="true"></i>
										<span>Profile</span>
									</a>
									<div className="cart-dropdown" style={{height:"70px",width:"340px"}}>
										<div className="cart-list">
											<div className="product-widget">
												<div className="product-body">
													<h3 className="product-name" style={{color:"#0e6efd",textDecoration:"underline"}}><a onClick={handleProfile}>View your Profile</a></h3>
													<h3 className="product-name" style={{color:"#0e6efd",textDecoration:"underline"}}><a onClick={handlePurchase}>View your Purchases</a></h3>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="dropdown">
									<a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="true" style={{textDecoration:"none"}}>
									<i className="fa fa-shopping-bag" aria-hidden="true"></i>
										<span>Shop</span>
									</a>
									<div className="cart-dropdown">
										<div className="cart-list">
											<div className="product-widget">
												<div className="product-body">
													<h3 className="product-name"><a href="" onClick={(e)=>{
														 shopView(e)
														}}> View My Shop</a></h3>
												</div>
											</div>
										</div>
									</div>
								</div>
								
								{ !localStorage.getItem("token") &&<div className="loginbutton">
								<NavLink to="/login"><button className="login-btn">Login</button></NavLink>
								</div> }
								{ localStorage.getItem("token") &&
								<div className="loginbutton">
								<button className="login-btn" onClick={
									handleLogout
									}>Logout</button>
								</div>
								}								

								{/*<!-- Menu Toogle -->*/}
								<div className="menu-toggle">
									<a href="#">
										<i className="fa fa-bars"></i>
										<span>Menu</span>
									</a>
								</div>
								{/*<!-- /Menu Toogle -->*/}
							</div>
						</div>
						{/*<!-- /ACCOUNT -->*/}
					</div>
					{/*<!-- row -->*/}
				</div>
				{/*<!-- container -->*/}
			</div>
			{/*<!-- /MAIN HEADER -->*/}
		</header>
  )
}

export default Header