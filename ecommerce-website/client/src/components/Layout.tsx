import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../images/dragon.svg";
import drop from "../images/dropdown.svg";

const Layout = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("username");
    const [pictureUrl, setPictureUrl] = useState<string>("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/auth");
    };

    useEffect(() => {
        const fetchPicture = async () => {
            const endpoint = `${import.meta.env.VITE_SERVER}/client/picture/${username}`;

            try {
                const response = await axios.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                setPictureUrl(response.data.picture_url);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Axios error response data:", error.response?.data);
                    console.error("Axios error response status:", error.response?.status);
                    console.error("Axios error message:", error.message);
                } else {
                    console.error("Unexpected error:", error);
                }
            }
        };

        if (username) {
            fetchPicture();
        }
    }, [username]);

    return (
        <div className='min-h-screen bg-white'>
            {/* Navigation Bar */}
            <nav className='bg-black p-4 flex justify-between items-center'>
                <div className='flex flex-row items-center'>
                    <img src={logo} alt='Website Logo' className='h-12 w-12 mr-2' />
                    <div className='text-white text-2xl font-bold cursor-pointer' onClick={() => navigate(`/`)}>
                        TitanMart
                    </div>
                </div>
                {token ? (
                    <div className='flex space-x-2 items-center'>
                        <span className='text-white hidden md:block'>Hello, </span>
                        <div
                            className='text-white cursor-pointer hover:underline font-bold hidden md:block'
                            onClick={() => navigate("/profile")}
                        >
                            {username}
                        </div>
                        <div className='relative'>
                            <img
                                src={drop}
                                alt='Menu'
                                className='h-2 mt-1 mr-4'
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            />
                            {isDropdownOpen && (
                                <ul className='absolute right-0 mt-2 bg-white border' style={{ width: "108px" }}>
                                    <li className='px-4 py-2 hover:bg-gray-100 cursor-pointer' onClick={handleLogout}>
                                        Log Out
                                    </li>
                                    <li
                                        className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                                        onClick={() => {
                                            navigate("/cart");
                                        }}
                                    >
                                        View Cart
                                    </li>
                                </ul>
                            )}
                        </div>
                        {pictureUrl && (
                            <img
                                src={pictureUrl}
                                alt='Profile Picture'
                                className='h-8 w-8 cursor-pointer'
                                onClick={() => navigate("/profile")}
                            />
                        )}
                    </div>
                ) : (
                    <div className='flex space-x-4 items-center'>
                        <div className='text-white cursor-pointer hover:underline' onClick={() => navigate("/auth")}>
                            Log In
                        </div>
                        <div
                            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer'
                            onClick={() => navigate("/auth")}
                        >
                            Sign Up
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer Section */}
            <footer className='text-center text-gray-500 py-4 mt-16'>
                <p>© {new Date().getFullYear()} TitanMart. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
