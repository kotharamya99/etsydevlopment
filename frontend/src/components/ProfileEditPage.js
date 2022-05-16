import React, {useState,useContext,useEffect} from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from "../utils/axios";
import config from "../utils/config.js";
import {useNavigate} from "react-router-dom";
import {NavLink} from "react-router-dom";
import '../styles/ProfileEditPage.css';
import { GlobalContext } from "../context/Provider";
import countries from '../countries';
function ProfileEditPage() {
    const {user} = useSelector((state)=>state.user);
    //const { authState, authDispatch } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
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


      const handleChange = (e) => {
        const value = e.target.value
        setUserDetails({
          ...userDetails,
          [e.target.name]: value,
        })
      }

    const getUserDetails = async () =>
    {
        try{
        const response = await axiosInstance().get(`/users/${user.userId}/profile`,{headers:{'Authorization':localStorage.getItem("token")}});
        console.log("RES"+JSON.stringify(response.data));
        if(response && response.data){
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
            console.log("Error Getting Response from get User API");
        }

        }catch(e)
        {
        console.log("Error Getting Response from get User API"+e);
        }
    }

    

    const postuserData = async()=>
    {
        try
        {

        
        console.log(JSON.stringify(userDetails));
        const response = await axiosInstance().put(`/users/${user.userId}/profile`,userDetails,{headers:{'Authorization':localStorage.getItem("token"),'Content-Type':"application/json"}});
        console.log(JSON.stringify(response));
        if(response && response.data)
        {
            console.log("update profile successfull");
            
            navigate("/profile", {replace:true});
        }else{
            console.log("error posting data to API");
        }
        }catch(e)
        {
            console.log("error posting data to API");
        }

    }

    useEffect(() => {
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login", {replace:true});
        }else{
            getUserDetails();
     }
    },[]);
    
    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
    
    }
    const handleUpload = async (file)=>
    {
       
        // var bodyFormData = new FormData();
        // bodyFormData.append('myImage',selectedFile);
        // const response = await axiosInstance().post(`/upload`,bodyFormData,{headers:{'Authorization':localStorage.getItem("token")}});
        // const iUrl = response.data.imageUrl;
        // console.log(iUrl);
        // setUserDetails({
        //     ...userDetails,
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
                body: selectedFile
              })

              const imageUrl = url.split('?')[0]
              setUserDetails({
            ...userDetails,
            imageUrl: imageUrl,
            })
        }


    }

    const handleRadio = (e) =>{
        setUserDetails({
            ...userDetails,
            gender: e.target.value,
          })
      }
  return (
    <>
        <div className="container">
        <div className="row flex-lg-nowrap">
        {/* <div className="col-12 col-lg-auto mb-3" style={{width: "200px"}}>
        </div> */}

        <div className="col">
            <div className="row">
            <div className="col mb-3">
                <div className="card">
                <div className="card-body">
                    <div className="e-profile">
                    
                    <ul className="nav nav-tabs">
                        <li className="nav-item"><a href="" className="active nav-link">Please Edit you Details Below</a></li>
                    </ul>
                    <div className="tab-content pt-3">
                        <div className="tab-pane active">
                        <form className="form" onSubmit={(e)=>{e.preventDefault()}}>
                            <div className="row">
                            <div className="col">
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>Full Name</label>
                                    <input className="form-control" type="text" name="username" value={userDetails?.username} onChange={handleChange}></input>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input className="form-control" type="date" name="dob"  value={userDetails?.dob?.slice(0,10)} onChange={handleChange}></input>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label>Gender</label>
                                    
                                        {/*<div class="form-check">
                                        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"/>
                                        <label class="form-check-label" for="flexRadioDefault1"> Male</label>
                                        </div>
                                        <div class="form-check">
                                        <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                        <label class="form-check-label" for="flexRadioDefault2"> Female </label>
                                        </div>*/}
                                        <div onChange={handleRadio}>
                                            <input type="radio" value="Male" name="gender" checked={userDetails?.gender==='Male'}/> Male
                                            <br></br>
                                            <input type="radio" value="Female" name="gender" checked={userDetails?.gender==='Female'}/> Female
                                            <br></br>
                                            <input type="radio" value="Other" name="gender" checked={userDetails?.gender==='Other'}/> Other
                                       </div>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>Email</label>
                                    <input className="form-control" type="text" placeholder="user@example.com" name="email" value={userDetails?.email} onChange={handleChange}></input>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                    <label>Phone Number</label>
                                    <input className="form-control" type="text" placeholder="123-456-7890" name="phoneNo" value={userDetails?.phoneNo} /*pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"*/ onChange={handleChange}></input>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col mb-3">
                                    <div className="form-group">
                                    <label>About</label>
                                    <textarea className="form-control" rows="5" placeholder="My Bio"  name="about" value={userDetails?.about} onChange={handleChange}></textarea>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>Address</label>
                                    <input className="form-control" type="text"  name="address" onChange={handleChange} value={userDetails?.address}></input>
                                    </div>
                                </div>
                        
                                </div>
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>City</label>
                                    <input className="form-control" type="text"  name="city" onChange={handleChange} value={userDetails?.city}></input>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-group">
                                    <label>State</label>
                                    <input className="form-control" type="text"  name="state" onChange={handleChange} value={userDetails?.state}></input>
                                    </div>
                                </div>
                                </div>
                                <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                    <label>Country</label>
                                    <select className="form-control"  name="country" onChange={handleChange} value={userDetails?.country}>
                                     <option value="Select the country">Select the country</option>
                                     {countries.map((country) => <option key={country?.name} value={country?.name}>{country?.name}</option>)}
                                    </select>
                                    </div>
                                </div>
                                
                                </div>

                                <div className="row">
                                <div className="col">
                                <div>
                                    <div>Upload Profile Photo</div>
                                    <input type="file" onChange={handleFileInput} name="imageUrl"/>
                                    <br></br>
                                    <button onClick={handleUpload}>Upload File</button>
                                </div>
                                </div>
                    
                                </div>

                            </div>
                            </div>
                            <div className="row">
                            <div className="col d-flex justify-content-end">
                                <NavLink to="/profile"><button className="saveChanges-btn" style={{margin:"5px"}}>Cancel</button></NavLink>
                                <button className="saveChanges-btn" onClick={postuserData} style={{margin:"5px"}}>Save Changes</button>
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
    </>
  )
}

export default ProfileEditPage