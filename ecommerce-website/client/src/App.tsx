import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Admin from "./pages/admin";
import Auth from "./pages/auth";
import Cart from "./pages/cart";
import Home from "./pages/home";
import Order from "./pages/order";
import Product from "./pages/product";
import Profile from "./pages/profile";
import Layout from "./components/Layout";

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Layout />}>
                    {/* Auth Page */}
                    <Route path='auth' element={<Auth />} />

                    {/* Home Page */}
                    <Route index element={<Home />} />

                    {/* Admin Page */}
                    <Route path='admin' element={<Admin />}></Route>

                    {/* Cart Page */}
                    <Route path='cart' element={<Cart />}></Route>

                    {/* Order Page */}
                    <Route path='order/:id' element={<Order />}></Route>

                    {/* Product Page */}
                    <Route path='product/:id' element={<Product />}></Route>

                    {/* Profile Page */}
                    <Route path='profile' element={<Profile />}></Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
