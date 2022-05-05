import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";

import Home from "./routes/home/home.component";
import Navigation from "./routes/navigation/navigation.component";
import Login from "./routes/login/login.component";
import Signup from "./routes/signup/signup.component";
import Products from "./routes/admin/products.component";

import { USER_LOGIN_SUCCESS } from "./redux/actions/userActions";
import Cart from "./routes/cart/cart.component";
import Orders from "./routes/admin/orders.component";
import UserOrders from "./routes/user/userOrders.component";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      dispatch({
        type: USER_LOGIN_SUCCESS,
        payload: JSON.parse(localStorage.getItem("userInfo")),
      });
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="cart" element={<Cart />} />
        <Route path="user-orders" element={<UserOrders />} />
        <Route path="admin/products" element={<Products />} />
        <Route path="admin/orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}

export default App;
