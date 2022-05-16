import React, { useState,useContext,useEffect } from 'react';
import {useNavigate, useParams, NavLink} from 'react-router-dom';
import "../css/style.css";
import config from "../utils/config.js";
import "../css/font-awesome.min.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { GlobalContext } from "../context/Provider"
import axiosInstance from "../utils/axios";
import { useSelector } from 'react-redux';

function ProductEdit() {

    const {user} = useSelector((state)=>state.user);
    const {id} = useParams();  
    const [selectedFileProduct, setSelectedFileProduct] = useState(null);
    const [categories, setCategories] = useState([])
    //const { authState, authDispatch } = useContext(GlobalContext);
	const navigate = useNavigate();
    const [product, setProduct] = useState({})
    const [loading, setLoading] = useState(false)
    const [productQuantity, setProductQuantity] = useState(0)


    useEffect(() => {
		const token = localStorage.getItem("token");
		if(!token)
		{
			navigate("/login", {replace:true});
		}else
		{
        //    setLoading(true)
        //    await axiosInstance()
		//   .get(`/users/${user?.userId}/products/${id}`)
		//   .then((response) => {
		// 	console.log("response.data", response.data)
		// 	setProduct(response.data)
		// 	setLoading(false)
		//   })
		//   .catch((err) => {
		// 	setLoading(false)
		//   })
          getProdDetails();  
          product?.quantity >= 20
		  ? setProductQuantity(20)
		  : setProductQuantity(product.quantity)
          //getCategories();
        }
        
	}, [])

    useEffect(() => {
        if(product?.shopId)
        {
            getCategories();
        }
        
	}, [product])


    const getProdDetails = async ()=>
    {
        setLoading(true)
          const response = await axiosInstance().get(`/users/${user?.userId}/products/${id}`,{headers:{'Authorization':localStorage.getItem("token")}});
          
              if(response && response.data)
              {
                console.log("response.data", response.data)
                setProduct(response.data)
			    setLoading(false)
              }else{
                setLoading(false)
              }
        
    }

    const getCategories = async ()=>{
        try
            {
            console.log("EEE"+JSON.stringify(product));
            const response = await axiosInstance().get(`/users/${user.userId}/shops/${product.shopId}/categories`,{headers:{'Authorization':localStorage.getItem("token")}});
            if(response.data && response)
            {
                console.log(response.data);
                setCategories(response.data.categories);
            }else{
                console.log("Error getting categories from AOI");
            }
            }catch(e)
            {
            console.log("Error getting categories from AOI"+e);
            }
    }
    const handleChange = (e)=>
    {
        setProduct({
            ...product,
            [e.target.name]: e.target.value,
          })
    }

    const handleFileInputProd = (e)=>{
        setSelectedFileProduct(e.target.files[0]);
    }

    const handleUploadProd = async ()=>{
    //     var bodyFormData = new FormData();
    //   bodyFormData.append('myImage',selectedFileProduct);
    //   const response = await axiosInstance().post(`/upload`,bodyFormData,{headers:{'Authorization':localStorage.getItem("token")}});
    //   const iUrl = response.data.imageUrl;
    //   console.log(iUrl);
    //   setProduct({
    //       ...product,
    //       imageUrl: iUrl,
    //     })

    
    const response = await axiosInstance().get(`/s3url`);
        if(response && response.data)
        {
            const url = response.data.uploadURL;
            console.log(url);
            await fetch(url, {
                method: "PUT",
                headers: {
                  "Content-Type": "multipart/form-data"
                },
                body: selectedFileProduct
              })

              const imageUrl = url.split('?')[0]
              console.log(imageUrl);
              setProduct({
          ...product,
          imageUrl: imageUrl,
        })
        }


    }

    const postProdData = async ()=>
    {
        try{

            const response = await axiosInstance().put(`/users/${user.userId}/products/${id}`,product,{headers:{'Authorization':localStorage.getItem("token"),'Content-Type':"application/json"}});
            if(response && response.data)
            {
                console.log("product updated successfully");
                navigate("/usershop", {replace:true});
            }else{
                console.log("error posting data to API");
            }



        }catch(e)
        {

        }

    }
  return (
    <>

    <div>
        <div className="container">
        <div className="row flex-lg-nowrap">
        <div className="col-12 col-lg-auto mb-3" style={{width: "200px"}}>
        </div>

        <div className="col">
            <div className="row">
            <div className="col mb-3">
                <div className="card">
                <div className="card-body">
                    <div className="e-profile">
                    <ul className="nav nav-tabs">
                        <li className="nav-item"><a href="" className="active nav-link">Edit Product Details</a></li>
                    </ul>
                    <div className="tab-content pt-3">
                        <div className="tab-pane active">
                        <form className="form" onSubmit={(e)=>{e.preventDefault()}}>
                            <div className="row">
                            <div className="col">
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>Name of the Product</label>
                                    <input className="form-control" type="text" name="name" value={product?.name} onChange={handleChange}></input>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                    <label>Category</label>
                                        <select
                                    id='category'
                                    class='form-control'
                                    name='categoryId'
                                    onChange={handleChange}
                                  >
                                    <option disabled selected>
                                      Choose Category
                                    </option>
                                    {categories &&
                                      categories.map((category) => {
                                        return (
                                          <option value={category._id}>
                                            {category.name}
                                          </option>
                                        )
                                      })}
                                  </select>
                                    </div>
                                </div>
                                </div>

                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>Quantity Available</label>
                                    <input className="form-control" type="text" name="quantity" value={product?.quantity} onChange={handleChange}></input>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                    <label>Price USD</label>
                                    <input className="form-control" type="text" name="price" value={product?.price} onChange={handleChange}></input>
                                    </div>
                                </div>
                                </div>
                                
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>Description</label>
                                    <input className="form-control" type="text" name="description" value={product?.description} onChange={handleChange}></input>
                                    </div>
                                </div>
                                </div>

                                <div className="row">
                                <div className="col">
                                <div>
                                    <div>Upload Product Photo</div>
                                    <input type="file" onChange={handleFileInputProd} style={{margin:"5px"}} name="imageUrl"/>
                                    
                                    <button style={{margin:"5px"}} onClick={handleUploadProd} >Upload Product Image</button>
                          
                                 </div>
                                </div>
                                </div>


                            
                            </div>
                            </div>
                            <div className="row">
                            <div className="col d-flex justify-content-end">
                            <br/>
                            <div>
                                <NavLink to="/usershop"><button className="saveChanges-btn"type="submit" style={{margin:"5px"}}>Cancel</button></NavLink>
                            </div>
                            <div>
                                <button onClick={postProdData}className="saveChanges-btn" style={{margin:"5px"}}>Edit Product</button>
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

    </>
  )
}

export default ProductEdit