import React,{useEffect,useContext,useState} from 'react';
import { GlobalContext } from "../context/Provider";
import config from "../utils/config.js";
import axiosInstance from "../utils/axios";
import{useNavigate} from 'react-router-dom';
import "../styles/UserShop.css";
import FavoriteItem from "./FavoriteItem";
import ShopProducts from './ShopProducts';
import ShopModal from './ShopModal';
import { Button } from "react-bootstrap";
import { useSelector } from 'react-redux';
function UserShop() {

  const {user} = useSelector((state)=>state.user);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSuccess, setImageSuccess] = useState(false);
  const [userProfileImage, setUserProfileImage] = useState("");
  const [categories, setCategories] = useState([])
  const [selectedFileProduct, setSelectedFileProduct] = useState(null);
  const [editShopImage, setEditShopImage] = useState(false);
  const [addProdBtn, setAddProdBtn] = useState(false);
  const [shopDetails,setShopDetails] = useState({});
  const [shopUp,setShopUp] = useState(false);
  const [shopProducts,setShopProducts] = useState([]);
  //const { authState, authDispatch } = useContext(GlobalContext);
  const [addItemData, setAddItemData] = useState({
  });
  const [newCatShow,setNewCatShow] = useState(false);
  const [newCatValue,setNewCatValue] = useState("");
  const getShopDetails = async ()=>
  {
    try{
    const response = await axiosInstance().get(`/users/${user.userId}/shops`,{headers:{'Authorization':localStorage.getItem("token")}});
    if(response.data)
    {
      setShopDetails(response.data);
      
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

  const getUserProfileImage = async ()=>
  {
    const response = await axiosInstance().get(`/users/${user.userId}/profile`,{headers:{'Authorization':localStorage.getItem("token")}});
    if(response && response.data)
    {
      setUserProfileImage(response.data.imageUrl);
    }
  }

  const getShopProducts = async ()=>
  {
    try
    {
      if(shopDetails._id)
      {
      console.log("SPD"+JSON.stringify(shopDetails));
      let bodyFormData = {
        priceRange: [],
        categoryIds: [],
        shopIds: [],
        excludeOutOfStock: false,
        search:"",
        excludeShopIds:[]
      }
      bodyFormData.shopIds.push(shopDetails._id);
      const response = await axiosInstance().post(`/users/${user.userId}/products`,bodyFormData,{headers:{'Authorization':localStorage.getItem("token")}});
      //console.log(`/users/${user.userId}/shops/${shopDetails._id}/products`);
      if(response.data)
      {
        setShopProducts(response.data.products);
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
      getUserProfileImage();
    }
  },[]);

  useEffect(() => {
    getShopProducts();
  },[shopDetails]);

  useEffect(() => {
    
  },[shopProducts]);




  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);

  }
  const handleFileUpload = async (file)=>
    {
       
        // var bodyFormData = new FormData();
        // bodyFormData.append('myImage',selectedFile);
        // const response = await axiosInstance().post(`/upload`,bodyFormData,{headers:{'Authorization':localStorage.getItem("token")}});
        // const iUrl = response.data.imageUrl;

        const response = await axiosInstance().get(`/s3url`);
        if(response && response.data)
        {
            const url = response.data.uploadURL;
            await fetch(url, {
                method: "PUT",
                headers: {
                  "Content-Type": "multipart/form-data"
                },
                body: selectedFile
              })

              let imageUrl = url.split('?')[0]
              const bd= {
                "imageUrl":imageUrl
              }
      
            const res = await axiosInstance().put(`/users/${user.userId}/shops/${shopDetails._id}`,bd,{headers:{'Authorization':localStorage.getItem("token")}});
            if(res && res.data)
            {
              setImageSuccess(true);
              getShopDetails();
              handleHideUpload();
            }else{
              console.log("Error Uploading Image");
            }
        }

    }

    const handleShowUpload =  ()=>
    {
        setEditShopImage(true);
    }
    const handleShowAddProd = async()=>{
      
      try
      {
      setAddProdBtn(true);
      const response = await axiosInstance().get(`/users/${user.userId}/shops/${shopDetails._id}/categories`,{headers:{'Authorization':localStorage.getItem("token")}});
      if(response.data && response)
      {
        setCategories(response.data.categories);
      }else{
        console.log("Error getting categories from AOI");
      }
    }catch(e)
    {
      console.log("Error getting categories from AOI"+e);
    }

    }

    const handleHideAddProd = ()=>{
      
      setAddProdBtn(false);
    }

    const handleHideUpload =  ()=>
    {
        setEditShopImage(false);
    }

    const handleAddItemInputChange = (e) => {
      setAddItemData({
        ...addItemData,
        [e.target.name]: e.target.value,
      })
    }

    const handleFileInputProd = (e) => {
      setSelectedFileProduct(e.target.files[0]);
  
  }
  const handleUploadProd = async (file)=>
  {
     
      // var bodyFormData = new FormData();
      // bodyFormData.append('myImage',selectedFileProduct);
      // const response = await axiosInstance().post(`/upload`,bodyFormData,{headers:{'Authorization':localStorage.getItem("token")}});
      // const iUrl = response.data.imageUrl;
      // console.log(iUrl);
      // setAddItemData({
      //     ...addItemData,
      //     imageUrl: iUrl,
      //   })


      const response = await axiosInstance().get(`/s3url`);
        if(response && response.data)
        {
            const url = response.data.uploadURL;
            await fetch(url, {
                method: "PUT",
                headers: {
                  "Content-Type": "multipart/form-data"
                },
                body: selectedFileProduct
              })

              const imageUrl = url.split('?')[0]
              //console.log(imageUrl);
              setAddItemData({
            ...addItemData,
            imageUrl: imageUrl,
            })
        }

  }
    const postProdData = async ()=>{
     
      console.log("form data"+JSON.stringify(addItemData));
      try{
        const response = await axiosInstance().post(`/users/${user.userId}/shops/${shopDetails._id}/products`,addItemData,{headers:{'Authorization':localStorage.getItem("token"),'Content-Type':"application/json"}});
        console.log(JSON.stringify(response));
        if(response && response.data)
        {
            console.log("added product successfully");
            
            navigate("/usershop", {replace:true});
            setAddItemData({
              name: "",
              description: "",
              price: "",
              imageUrl: "",
              quantity: "",
              categoryId: "",
            })
            getShopProducts();
            setAddProdBtn(false);
        }else{
            console.log("error posting data to API");
        }
      }catch(e)
      {
        console.log("Error posting product data"+e);
      }
    }

    const showNewCatInput = ()=>
    {
      setNewCatShow(true);
    }

    const hideNewCatInput = ()=>
    {
      setNewCatShow(false);
    }

    const handleNewCat = (e)=>
    {
        setNewCatValue(e.target.value);
    }
    const newCat = {
      "name":newCatValue
    }
    const postNewCatData = async()=>
    {
      const response = await axiosInstance().post(`/users/${user.userId}/shops/${shopDetails._id}/categories`,newCat, {headers:{'Authorization':localStorage.getItem("token")}});
      if(response && response.data)
      {
        const response = await axiosInstance().get(`/users/${user.userId}/shops/${shopDetails._id}/categories`,{headers:{'Authorization':localStorage.getItem("token")}});
        if(response.data && response)
        {
          setCategories(response.data.categories);
        }else{
          console.log("Error adding new categories");
        }
        hideNewCatInput();
      }else{
        console.log("Error Adding New Category");
      }
    }
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
                              <h2 className="m-t-0 m-b-0">{shopDetails.name}</h2>
                              <span className="job_post">{shopDetails.totalSalesCount} | </span>
                              <span className="job_post">On Etsy since - {shopDetails.createdOn?.slice(0,10)}</span>
                              <br /> <br />
                              <div>
                                  <button className="editShop-btn" onClick={handleShowUpload}><i className='fa fa-pencil'></i> Edit Shop Image</button>
                                  <br/>
                                  {editShopImage && <div>
                                    <div>Upload Shop Image</div>
                                    <input type="file" onChange={handleFileInput} style={{margin:"5px"}} name="imageUrl"/>
                                    
                                    <button style={{margin:"5px"}} onClick={handleFileUpload}>Upload Shop Image</button>
                                    <button onClick={handleHideUpload}>Cancel</button>
                                 </div>}
                                  <br/>
                                  <button className="addProductShop-btn" onClick={handleShowAddProd}><i className='fa fa-plus'></i> Add Product To Shop</button>
                              </div>
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
                          <div className="profile-image rounded-circle" style={{margin: "0px 110px"}}> <img className='' src={userProfileImage?userProfileImage:"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="" width="100px" height="100px"/> </div>
                              <br />
                              <p className="mt-1 m-b-0 text-center">{user.username}</p>
                              <br /> <br />
                          </div>                
                    </div>
                  </div>                    
          </div>
      </div>
    </div>




    {addProdBtn &&     <div>
        <div className="container" style={{marginLeft:"0px"}}>
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
                        <li className="nav-item"><a href="" className="active nav-link">Details</a></li>
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
                                    <input className="form-control" type="text" name="name" onChange={handleAddItemInputChange}></input>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                    <label>Description</label>
                                    <input className="form-control" type="text" name="description" onChange={handleAddItemInputChange}></input>
                                    </div>
                                </div>
                                </div>
                                
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                        <label>Category</label>
                                            <select
                                        id='category'
                                        class='form-control'
                                        name='categoryId'
                                        onChange={handleAddItemInputChange}
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
                                        <button onClick={showNewCatInput}>Create New Category</button>
                                        <br></br>
                                        <br></br>
                                        {/* {newCatShow && <input placeholder="Enter New Category" className="form-control" type="text" name="newcat" value={newCatValue} onChange={handleNewCat}></input>} */}
                                    </div>
                                    <div className='row'>
<div className='col'>
  {newCatShow && <input placeholder="Enter New Category" className="form-control" type="text" name="newcat" value={newCatValue} onChange={handleNewCat}></input>}
</div>
                                   
                                    <div className="col">
                                      {/* <br></br>
                                      <br></br> */}
                                      {newCatShow &&
                                      <button onClick={postNewCatData}>Save</button> }
                                      {newCatShow && <button onClick={hideNewCatInput}>Cancel</button> }
                                    </div>
                                    </div>
                                </div>


                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>Quantity Available</label>
                                    <input className="form-control" type="text" name="quantity" onChange={handleAddItemInputChange}></input>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                    <label>Price USD</label>
                                    <input className="form-control" type="text" name="price" onChange={handleAddItemInputChange}></input>
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
                                <button onClick ={handleHideAddProd}className="saveChanges-btn"type="submit" style={{margin:"5px"}}>Cancel</button>
                            </div>
                            <div>
                                <button onClick={postProdData}className="saveChanges-btn" style={{margin:"5px"}}>Create Product</button>
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
    </div>}




    <div className="container">
      <div className="row">          
          {shopProducts && shopProducts.map((eachFavoriteItem)=>{
            return <ShopProducts key={eachFavoriteItem._id} item={eachFavoriteItem}/>
          })} 
      </div>
    </div>


</div>



  )
}

export default UserShop