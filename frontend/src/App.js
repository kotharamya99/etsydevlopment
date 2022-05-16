import logo from './logo.svg';
import './App.css';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ProductPage from './components/ProductPage';
import ProfileEditPage from './components/ProfileEditPage';
import FavoritesPage from './components/FavoritesPage';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Footer from './components/Footer';
import NewShop from './components/NewShop';
import UserShop from './components/UserShop';
import Sample from './components/Sample';
import Cart from './components/Cart';
import PurchasesPage from './components/PurchasesPage';
import Shop from './components/Shop';
import ProductEdit from './components/ProductEdit';
function App() {
  return (
    <Router>
        <Header />
        <Routes>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/signup" element={<SignUp/>}/>
          <Route exact path="/profile" element={<FavoritesPage/>}/>
          <Route exact path="/profileEdit" element={<ProfileEditPage/>}/>
          <Route exact path="/product/:id" element={<ProductPage/>}/>
          <Route exact path="/newshop" element={<NewShop/>}/>
          <Route exact path="/usershop" element={<UserShop/>}/>
          <Route exact path="/shop/:id" element={<Shop/>}/>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/sample" element={<Sample/>}/>
          <Route exact path="/cart" element={<Cart/>}/>
          <Route exact path="/purchases" element={<PurchasesPage/>}/>
          <Route exact path="/productedit/:id" element={<ProductEdit/>}/>
        </Routes>
    </Router>
  );
}

export default App;
