import React, { useState,useContext,useEffect } from 'react';
import {useNavigate, useParams, NavLink} from 'react-router-dom';
import "../css/style.css";
import "../css/font-awesome.min.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalContext } from "../context/Provider"
import axiosInstance from "../utils/axios";
import { Dimmer, Loader } from "semantic-ui-react"
import config from "../utils/config.js";
import { putCartAction } from "../context/actions/cartAction";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
function ProductPage() {

	const dispatch = useDispatch();
	const {user} = useSelector((state)=>state.user);
	const {id} = useParams();
	//const { authState, authDispatch } = useContext(GlobalContext);
	const navigate = useNavigate();
	const [product, setProduct] = useState({})
	const [pagelink, setPagelink] = useState("/shop/")
	const [productQuantity, setProductQuantity] = useState(0)
	const [loading, setLoading] = useState(false)
	const { globalDispatch, globalState } = useContext(GlobalContext)
	const [msg,setMsg] = useState(false);
	const [msg2,setMsg2] = useState(false);
	const [giftWrap,setGiftWrap] = useState(false);

	const giftWrapHandle =(e)=>{
		const checked = e.target.checked;
		if(checked)
		{
			setGiftWrap(true);
		}else
		{
			setGiftWrap(false);
		}
	}
	// const {
	// 	user,
	// 	products: { data },
	//   } = globalState
	//   const userId = user?.userId

	  useEffect(() => {
		const token = localStorage.getItem("token");
		if(!token)
		{
			navigate("/login", {replace:true});
		}else
		{
		setLoading(true)
		console.log("product page");
		console.log(user.userId);
		axiosInstance()
		  .get(`/users/${user?.userId}/products/${id}`)
		  .then((response) => {
			console.log("response.data", response.data)
			setProduct(response.data)
			setLoading(false)
			setPagelink(pagelink+response.data.shopId);
		  })
		  .catch((err) => {
			setLoading(false)
			console.log(err)
		  })
		// data?.products.map((product) => {
		//   if (product._id === id) {
		//     setProduct(product)
		//     // Display max 20 items in the select box.
		product?.quantity >= 20
		  ? setProductQuantity(20)
		  : setProductQuantity(product.quantity)
		//   }
		// })
	  }
	}, [])
	
	  let handleQuantityChange = (e) => {
		setProductQuantity(e.target.value)
	  }
	  const shopPageOpen = ()=>{
		  if(product.shopId) {
			   navigate("/shop/"+product.shopId);
		  }
	  }


	  const addToCart = (productId) => {
		const token = localStorage.getItem("token");
		if (token) {
		  console.log(productId);
		  console.log(user.userId);
		  dispatch(putCartAction(user?.userId, productId));
		  //console.log("HI put cart action dispatch");
		  setMsg2(true);
			setTimeout(() => {setMsg2(false)}, 2000);
		}
	  };

	  const handleFavProduct = async (productId) => 
	{
		// if (userId) {
		//   console.log("productId from handleFavProduct", productId);
		//   postFavoritesAction(productId, userId)(globalDispatch);
		//   console.log("global state after postFavoritesAction", globalState);
		// }
		const token = localStorage.getItem("token");
		if(token){        
		const response = await axiosInstance().post(`/users/${user.userId}/favorites`,{ productId },{headers:{'Authorization':localStorage.getItem("token")}});
		if(response && response.data)
		{
			console.log("Item Added To Favorites Successfully");
			setMsg(true);
			setTimeout(() => {setMsg(false)}, 2000);
		}else{
			console.log("Error adding favorites");
		}
	}
	};


	
  return (
    <>
		{
		loading ? (
			<div className='container' style={{ marginTop: "250px" }}>
			  <Dimmer active inverted>
				<Loader inverted>Loading</Loader>
			  </Dimmer>
			</div>
		  ) :(
			  product && <div className="container" style={{marginTop:"70px"}}>
			  <div className="card">
				  <div className="container-fliud">
					  <div className="wrapper row">
						  <div className="preview col-md-6" >
						  <div className="preview-pic tab-content" style={{justifyContent:"center", alignItems: "center", alignContent:"center", padding:"30px"}}>
						  <div className="tab-pane active" id="pic-1"><img src={product.imageUrl} style={{width:"300px", height:"300px"}} /></div>
	
						</div>
							  {/* <div className="preview-pic tab-content">
								<div className="tab-pane active" id="pic-1"></div>
								<img src={product.imageUrl}></img>
							   </div> */}
						  </div>
						  <div className="details col-md-6" style={{padding: "30px"}}>
							  <h1 className="product-title">{product.name}</h1>
							  <h4 >Shop Name :<NavLink to={pagelink}><a href=""> {product.shopName} </a></NavLink></h4>
							  <div className="rating">
								  <div className="stars">
									  <span className="fa fa-star checked"></span>
									  <span className="fa fa-star checked"></span>
									  <span className="fa fa-star checked"></span>
									  <span className="fa fa-star"></span>
									  <span className="fa fa-star"></span>
								  </div>
								  <span className="review-no">41 reviews</span>
							  </div>
							  <p className="product-description">{product.description}</p>
							  <h2 className="price" style={{color:"red"}}>Current Price: $ {product.price}</h2>
							  {/* <div class="form-check">
								<input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onClick={(e) => {
                                giftWrapHandle(e);
                           			 }}></input>
								<label class="form-check-label" for="flexCheckDefault">
									Gift Wrap this product
								</label>
							  </div> */}
							  {/* {giftWrap ==true &&<div class="form-group">
								<label for="exampleFormControlTextarea1">Personal Message for Gift Wrap</label>
								<textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
							  </div>} */}
							  {product.quantity==0 && <h3 className="price" style={{color:"red"}}>( OUT OF STOCK! )</h3>}
							  <div className="action">
								  <button className="login-btn" type="button" onClick={() => addToCart(id)}>Add to cart</button>
								  <button className="login-btn" type="button" style={{width:"150px", margin:"10px"}} onClick={() => handleFavProduct(id)} >Add to Favorites</button>
							  </div>
						  </div>
					  </div>
				  </div>
			  </div>
			  {msg &&
				<div class='alert alert-success' role='alert'>
				Item added to Favorites Successfully!
				</div>
      		  } 
			{msg2 &&
				<div class='alert alert-success' role='alert'>
				Item added to cart Successfully!
				</div>
      		  } 
		  </div>
		  )
	  }
	</>
  );
}

export default ProductPage;