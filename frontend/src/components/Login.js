import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Login.css';
import {useState, useRef, useEffect,useContext} from 'react';
import {Link, useNavigate, useLocation } from "react-router-dom";
import { GlobalContext } from "../context/Provider";
import axiosInstance from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_ERROR, LOGIN_LOADING, LOGIN_SUCCESS } from "../context/actions/actionTypes";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  const Login = () => {
  
  
  //Context API
  //const { authState, authDispatch } = useContext(GlobalContext);
  // const {
  //   auth: { data, loading, error },
  // } = authState
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (error && error.status==401) {
      setErrorMsg("Invalid username or password")
    }
  }, [error])

  // useEffect(() => {
  //   if (data) {
  //     if (data.data) {
  //       setForm({ email: "", password: "" })
  //       console.log("data", data)
        
  //     }
  //   }
  // }, [data])

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(token){
        navigate("/profile", {replace:true});
    }
   },[]);

  const submitHandler = async (e) => {
    e.preventDefault ();
    console.log(email,password );

    if(email!="" && password!="")
    {
      console.log("login submitted")
      const postBody = {
        email:email,
        password:password
      }
      // try
      // {
        dispatch({
          type:"LoginRequest"
        })

        axiosInstance()
        .post("/login", postBody)
        .then((response) => {
          localStorage.token = response.data.token;
          console.log("response from LOGINAction", response.data);     
          dispatch({
            type:"LoginSuccess",
            payload: response.data.data
          })
          navigate("/", {replace:true});
        })
        .catch((error) => {
          console.log("error from LOGINAction", error)
          dispatch({
            type:"LoginFailure",
            payload: error
          })
        })

      // const response = await axiosInstance().post("/login",postBody);
      // localStorage.token = response.data.token;
      //   console.log("response from LOGINAction", response.data);
      //   if(response.status == 200)
      //   {
      //     dispatch({
      //       type:"LoginSuccess",
      //       payload: response.data.data
      //     })

      //     dispatch({ type: "clearErrors" });
      //     navigate("/", {replace:true});
      //   }else
      //   {
      //     dispatch({
      //       type:"LoginFailure",
      //       payload: response.message
      //     })
      //   }
      // // }
      // //  catch(error)
      // //  {
      //     console.log("error from LOGINAction", error);
      //     dispatch({
      //       type:"LoginFailure",
      //       payload: error
      //     })
      //  //}

    }

  }
  return (
    <>
      <section className="vh-100 gradient-custom">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card bg-dark text-white" style={{borderRadius: "1rem"}}>
                <div className="card-body p-5 text-center">
                  <div className="mb-md-5 mt-md-3 pb-1">
                    <form onSubmit={submitHandler}>
                        <h2 className="fw-bold mb-2 text-uppercase" style={{color:"white"}}>Login</h2>
                        <p className="text-white-50 mb-5" style={{color:"white"}}>Please enter your login and password!</p>

                         {error ? (
                          <div class='alert alert-danger' role='alert'>
                            {errorMsg}
                          </div>
                        ) : null} 

                        <div className="form-outline form-white mb-4">
                          <label className="form-label" for="typeEmailX" style={{float: "left"}}>Email</label>
                          <input type="email" id="typeEmailX" className="form-control form-control-lg" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                        </div>
                        <div className="form-outline form-white mb-4">
                          <label className="form-label" for="typePasswordX" style={{float: "left"}}>Password</label>
                          <input type="password" id="typePasswordX" className="form-control form-control-lg" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                        </div>
                        <button className="login-btn" type="submit">Login</button>
                    </form>
                  </div>

                  <div>
                   {/* {loading ? <p>Loading..</p> : null} */}
                    <p className="mb-0">Don't have an account? <NavLink to="/signup" style={{textDecoration:"none"}}> <p className="text-white-50 fw-bold">Sign Up</p></NavLink></p>
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

export default Login;