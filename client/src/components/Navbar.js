import React, { useState } from "react";
import Signin from "./Signin";
import { Navigate, useNavigate } from "react-router";
import cookie from "react-cookies";
import {
  ShoppingCart,
  Person,
  NotificationsNoneSharp,
  FavoriteBorderSharp,
} from "@material-ui/icons";
// import { PersonIcon, ShoppingCart } from "@mui/icons-material";
import "bootstrap/dist/css/bootstrap.min.css";
import ProfileList from "./profileList";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import SearchBar from "./searchBar";
import Axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [showSignIn, setshowSignIn] = useState(false);
  const [showProfileLists, setShowProfileLists] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(0);

  const popUpSignIn = () => {
    setshowSignIn(true);
  };

  const showProfileList = () => {
    setShowProfileLists(true);
  };

  const showFavourites = () => {
    window.location.pathname = "/profile";
  };

  const handleOpenCart = () => {
    window.location.pathname = "/cart";
  };

  let navLogin = null;
  if (user && cookie.load("user")) {
    console.log("Able to read cookie");
    console.log(cookie.load("user"));
    navLogin = (
      <ul className="icons">
        <li onClick={showFavourites}>
          <FavoriteBorderSharp />
        </li>

        <li onClick={showProfileList}>
          <Person />
        </li>
        <li>
          <ShoppingCart onClick={handleOpenCart} />
        </li>
      </ul>
    );
  } else {
    console.log("Not Able to read cookie in navbar");
    navLogin = (
      <ul className="icons">
        <li className="icons_nav" onClick={popUpSignIn}>
          Login
        </li>
      </ul>
    );
  }

  return (
    <div>
      {/* {redirectVar} */}
      <header className="navBar">
        <a style={{ marginLeft: "3%", textDecoration: "none" }} href="/home">
          <h2 className="logo">Etsy</h2>
        </a>
        <SearchBar
          placeholder="Search for anything"
          // refreshFunction={updateSearchTerm}
        />
        {navLogin}
      </header>
      {showSignIn && <Signin setshowSignIn={setshowSignIn} />}

      {console.log(
        showSignIn + "-------------- " + showProfileLists + "------------------"
      )}
      {showProfileLists && (
        <ProfileList setShowProfileLists={setShowProfileLists} />
      )}
    </div>
  );
}

export default Navbar;
