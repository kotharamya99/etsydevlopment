// import React, {useState,useContext,useEffect} from 'react';
//import axiosInstance from "../utils/axios";
// import config from "../utils/config.js";
// import {useNavigate} from "react-router-dom";
// import {NavLink} from "react-router-dom";
// import '../styles/ProfileEditPage.css';
// import { GlobalContext } from "../context/Provider";
// import countries from '../countries';
// function ProfileEditPage() {
//     const { authState, authDispatch } = useContext(GlobalContext);
//     const navigate = useNavigate();
//     const [progress , setProgress] = useState(0);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [userDetails, setUserDetails] = useState({
//         username:"",
//         imageUrl:"",
//         dob:"",
//         gender:"",
//         address:"",
//         city:"",
//         state:"",
//         country:"",
//         about:"",
//         email:"",
//         phoneNo:""
//       });
    
//     const [form, setForm] = useState({
//         username:"",
//         imageUrl:"",
//         dob:"",
//         gender:"",
//         address:"",
//         city:"",
//         state:"",
//         country:"",
//         about:"",
//         email:"",
//         phoneNo:""
//       })

//       const handleChange = (e) => {
//         const value = e.target.value
//         setForm({
//           ...form,
//           [e.target.name]: value,
//         })
//       }

//     const getUserDetails = async () =>
//     {
//         try{
//         console.log("asas"+authState.auth.data.data.userId);
//         const response = await axiosInstance().get(`/users/${authState.auth.data.data.userId}/profile`,{headers:{'Authorization':localStorage.getItem("token")}});
//         if(response && response.data){
//             setUserDetails({
//             username:response.data.username,
//             imageUrl:response.data.imageUrl,
//             dob:response.data.dob,
//             gender:response.data.gender,
//             address:response.data.address,
//             city:response.data.city,
//             state:response.data.state,
//             country:response.data.country,
//             about:response.data.about,
//             email:response.data.email,
//             phoneNo:response.data.phoneNo
//             })

//             setForm({
//             username:response.data.username,
//             imageUrl:response.data.imageUrl,
//             dob:response.data.dob,
//             gender:response.data.gender,
//             address:response.data.address,
//             city:response.data.city,
//             state:response.data.state,
//             country:response.data.country,
//             about:response.data.about,
//             email:response.data.email,
//             phoneNo:response.data.phoneNo
//             })
//             console.log(JSON.stringify(userDetails));
//         }else{
//             console.log("Error Getting Response from get User API");
//         }

//         }catch(e)
//         {
//         console.log("Error Getting Response from get User API"+e);
//         }
//     }

    

//     const postuserData = async()=>
//     {
//         console.log(JSON.stringify(form));
//     }

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         if(!token){
//             navigate("/login", {replace:true});
//         }else{
//             getUserDetails();
//      }
//     },[]);
//   return (
//     <>
//         <div className="container">
//         <div className="row flex-lg-nowrap">
//         <div className="col-12 col-lg-auto mb-3" style={{width: "200px"}}>
//         </div>

//         <div className="col">
//             <div className="row">
//             <div className="col mb-3">
//                 <div className="card">
//                 <div className="card-body">
//                     <div className="e-profile">
                    
//                     <ul className="nav nav-tabs">
//                         <li className="nav-item"><a href="" className="active nav-link">Please Edit you Details Below</a></li>
//                     </ul>
//                     <div className="tab-content pt-3">
//                         <div className="tab-pane active">
//                         <form className="form" onSubmit={(e)=>{e.preventDefault()}}>
//                             <div className="row">
//                             <div className="col">
//                                 <div className="row">
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>Full Name</label>
//                                     <input className="form-control" type="text" name="username" value={userDetails.username} onChange={handleChange}></input>
//                                     </div>
//                                 </div>
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>Date of Birth</label>
//                                     <input className="form-control" type="date" name="dob"  onChange={handleChange}></input>
//                                     </div>
//                                 </div>
//                                 </div>
//                                 <div className="row">
//                                 <div className="col">
//                                     <div className="form-group">
//                                         <label>Gender</label>
//                                         {/*<input className="form-check-input" type="radio" id="huey" name="drone" value="huey"checked></input>
//                                         <label for="huey">Huey</label>
//                                         <input className="form-check-input" type="radio" id="dewey" name="drone" value="dewey"></input>
//                                         <label for="dewey">Dewey</label>
//                                         <input className="form-check-input" type="radio" id="louie" name="drone" value="louie"></input>
//                                         <label for="louie">Louie</label>*/}
//                                     </div>
//                                 </div>
//                                 </div>
//                                 <div className="row">
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>Email</label>
//                                     <input className="form-control" type="text" placeholder="user@example.com" name="email" onChange={handleChange}></input>
//                                     </div>
//                                 </div>
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>Phone Number</label>
//                                     <input className="form-control" type="tel" placeholder="123-456-7890" name="phoneNo" /*pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"*/ onChange={handleChange}></input>
//                                     </div>
//                                 </div>
//                                 </div>
//                                 <div className="row">
//                                 <div className="col mb-3">
//                                     <div className="form-group">
//                                     <label>About</label>
//                                     <textarea className="form-control" rows="5" placeholder="My Bio"  name="about" onChange={handleChange}></textarea>
//                                     </div>
//                                 </div>
//                                 </div>
//                                 <div className="row">
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>Address</label>
//                                     <input className="form-control" type="text"  name="address" onChange={handleChange}></input>
//                                     </div>
//                                 </div>
                        
//                                 </div>
//                                 <div className="row">
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>City</label>
//                                     <input className="form-control" type="text"  name="city" onChange={handleChange}></input>
//                                     </div>
//                                 </div>
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>State</label>
//                                     <input className="form-control" type="text"  name="state" onChange={handleChange}></input>
//                                     </div>
//                                 </div>
//                                 </div>
//                                 <div className="row">
//                                 <div className="col">
//                                     <div className="form-group">
//                                     <label>Country</label>
//                                     <select className="form-control"  name="country" onChange={handleChange}>
//                                      <option value="Select the country">Select the country</option>
//                                      {countries.map((country) => <option key={country.name} value={country.name}>{country.name}</option>)}
//                                     </select>
//                                     </div>
//                                 </div>
                                
//                                 </div>

//                                 <div className="row">
//                                 <div className="col">
//                                 <div>
//                                     <div>Upload Profile Photo</div>
//                                     <input type="file" onChange={handleFileInput} name="imageUrl"/>
//                                 </div>
//                                 </div>
                    
//                                 </div>

//                             </div>
//                             </div>
//                             <div className="row">
//                             <div className="col d-flex justify-content-end">
//                                 <NavLink to="/profile"><button className="saveChanges-btn" >Cancel</button></NavLink>
//                                 <button className="saveChanges-btn" onClick={postuserData}>Save Changes</button>
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
//     </>
//   )
// }

// export default ProfileEditPage