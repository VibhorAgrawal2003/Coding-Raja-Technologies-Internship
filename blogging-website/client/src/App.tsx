import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import Auth from "./pages/auth";
import Blog from "./pages/blog";
import Create from "./pages/create";
import Customize from "./pages/customize";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Layout from "./components/Layout";

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Layout />}>
                    {/* Auth Page */}
                    <Route path='auth' element={<Auth />} />

                    {/* Blog Page */}
                    <Route path='blog/:bid' element={<Blog />} />

                    {/* Create Page */}
                    <Route path='create' element={<Create />} />

                    {/* Customize Page */}
                    <Route path='customize' element={<Customize />} />

                    {/* Home Page */}
                    <Route index element={<Home />} />

                    {/* Profile Page */}
                    <Route path='profile/:username' element={<Profile />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
