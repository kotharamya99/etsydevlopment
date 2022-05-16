import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/Provider"
import '../styles/SignUp.css';
import {NavLink,useNavigate} from "react-router-dom";
import { Loader } from "semantic-ui-react";
import axiosInstance from "../utils/axios"
import { REGISTER_ERROR, REGISTER_LOADING, REGISTER_SUCCESS, } from "../context/actions/actionTypes"

function SignUp() {

  //const { authState, authDispatch } = useContext(GlobalContext);
  const navigate = useNavigate();
  //const { auth } = authState
  //const { loading, error, data } = auth
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [errorMsg, setErrorMsg] = useState("")
  // useEffect(() => {
  //   if (error) {
  //     console.log("error", error)
  //     setErrorMsg(error.msg)
  //   }
  // }, [error])

  // useEffect(() => {
  //   if (data) {
  //     setForm({ username: "", email: "", password: "" })
  //     setTimeout(() => {
  //     }, 2000)
  //   }
  // }, [data])

  const handleChange = (e) => {
    const value = e.target.value
    setForm({
      ...form,
      [e.target.name]: value,
    })
  }

  const submitHandler = (e) => {
    if(form.email!="" && form.password!="" && form.username!="")
    {
      axiosInstance()
      .post("/signUp", form)
      .then((response) => {
        console.log("response from registerAction", response.data)
        //authDispatch({ type: REGISTER_SUCCESS, payload: response.data })
        navigate("/login", {replace:true});
      })
      .catch((error) => {
        console.log("error from registerAction", error)
        // authDispatch({
        //   type: REGISTER_ERROR,
        //   payload: error.response ? error.response.data : "Could not connect",
        // })
      })
      //console.log(authState)
    }
  }

  return (
    <>
    <section class="vh-100 gradient-custom">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card bg-dark text-white" style={{borderRadius: "1rem"}}>
              <div class="card-body p-5 text-center">

                <div class="mb-md-5 mt-md-4 pb-5">

                  <h2 class="fw-bold mb-2 text-uppercase" style={{color:"white"}}>Create an Account</h2>
                  <p class="text-white-50 mb-5">Please enter the below details</p>

                      {/* {error ? (
                    <div class='alert alert-danger' role='alert'>
                      {errorMsg}
                    </div>
                  ) : null} */}
                  
                  <div class="form-outline form-white mb-4">
                    <label class="form-label" for="typeNameX" style={{float: "left"}}>Username</label>
                    <input type="name" id="typeNameX" class="form-control form-control-lg" value={form.username} onChange={handleChange} name='username'/>
                    
                  </div>

                  <div class="form-outline form-white mb-4">
                    <label class="form-label" for="typeEmailX" style={{float: "left"}}>Email</label>
                    <input type="email" id="typeEmailX" class="form-control form-control-lg" value={form.email} onChange={handleChange} name='email'/>
                    
                  </div>

                  <div class="form-outline form-white mb-4">
                    <label class="form-label" for="typePasswordX" style={{float: "left"}}>Password</label>
                    <input type="password" id="typePasswordX" class="form-control form-control-lg" value={form.password} onChange={handleChange} name='password'/>
            
                  </div>

                  <button class="login-btn" type="Sign Up" onClick={submitHandler}>Sign Up</button>

                </div>

                <div>
                <p class="mb-0">Already Have an account? <NavLink to="/login" style={{textDecoration:"none"}}> <p class="text-white-50 fw-bold" >Login</p></NavLink></p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default SignUp