import { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axios";
import { GlobalContext } from "../context/Provider";
import {useNavigate} from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Pagination from './Pagination';
function PurchasesPage() {

    const [purchaseDeatils, setPurchaseDetails] = useState([]);
    const [postsPerPage, setPostsPerPage] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    

    const navigate = useNavigate();
    //const { authState, authDispatch } = useContext(GlobalContext);
    const {user} = useSelector((state)=>state.user);
    const getAllPurchases = async () =>
    {
        axiosInstance()
        .get(`/users/${user.userId}/orders`)
        .then((response) => {
          console.log("response.data", response.data)  
          setPurchaseDetails(response.data);  
        }).catch((err) => {
            
            console.log(err)
         })

    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token)
        {
          navigate("/login");
        }else{
          getAllPurchases();
        }
    
      }, []);
      // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = purchaseDeatils.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = pageNumber => setCurrentPage(pageNumber);
  return (

    <div>
        <br></br>
       {purchaseDeatils.length !=0 &&<div class="container">
        <h1 style={{color:"black"}} >My Orders</h1>
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            {postsPerPage}
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
            <button class="dropdown-item" type="button" onClick={() => setPostsPerPage(2)}>2</button>
            <button class="dropdown-item" type="button" onClick={() => setPostsPerPage(5)}>5</button>
            <button class="dropdown-item" type="button" onClick={() => setPostsPerPage(10)}>10</button>
        </div>
        <br></br>
        <br></br>
        <div class="row">
            <div class="col-12">
                <table class="table table-image">
                <thead>
                    <tr>
                    <th scope="col" style={{color:"red"}}>Date</th>
                    <th scope="col" style={{color:"red"}}>Product</th>
                    <th scope="col" style={{color:"red"}}>Product Name</th>
                    <th scope="col" style={{color:"red"}}>Price</th>
                    <th scope="col" style={{color:"red"}}>Quantity</th>
                    <th scope="col" style={{color:"red"}}>Order ID</th>
                    <th scope="col" style={{color:"red"}}>Gift Wrap Message</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        currentPosts.map((singlePurchase)=>{

                            return (
                                <tr>
                                    <th scope="row">{singlePurchase?.createdOn?.slice(0,10)}</th>
                                    <td class="w-25">
                                        <img src={singlePurchase.productImage} class="img-fluid img-thumbnail" alt="Sheep"></img>
                                    </td>
                                    <td>{singlePurchase.productName}</td>
                                    <td>{singlePurchase.price}</td>
                                    <td>{singlePurchase.quantity}</td>
                                    <td>{singlePurchase._id}</td>
                                    <td>{singlePurchase.giftWrapDescription}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
                </table>   
            </div>
        </div> 
        <div style={{paddingLeft: "500px", margin: "100px"}}>
        <Pagination
            postsPerPage={postsPerPage}
            totalPosts={purchaseDeatils.length}
            paginate={paginate}
            
        />
      </div>
        </div> }
        {purchaseDeatils.length ==0 &&
            <div class="container">
                <h1 style={{color:"red"}}>You have not made any purchases yet!</h1>
            </div>
        }
    </div>
  )
}

export default PurchasesPage
