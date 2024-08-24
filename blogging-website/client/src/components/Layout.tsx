import { Outlet, useNavigate } from "react-router-dom";
import logo from "../images/rocket.svg";

const Layout = () => {
    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("username");

    return (
        <div className='min-h-screen bg-gray-100'>
            {/* Navigation Bar */}
            <nav className='bg-gray-800 p-4 flex justify-between items-center'>
                <div className='flex flex-row'>
                    <img src={logo} alt='Website Logo' className='h-8 w-8 mr-2' />
                    <div className='text-white text-2xl font-bold' onClick={() => navigate(`/`)}>
                        ReadSpace
                    </div>
                </div>
                <ul className='flex space-x-8 items-center'>
                    {token ? (
                        <>
                            <li
                                className='text-white cursor-pointer hover:underline'
                                onClick={() => navigate(`/profile/${username}`)}
                            >
                                {username}
                            </li>
                            <li
                                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer'
                                onClick={() => {
                                    sessionStorage.clear();
                                    navigate("/auth");
                                }}
                            >
                                Log Out
                            </li>
                        </>
                    ) : (
                        <>
                            <li className='text-white cursor-pointer hover:underline' onClick={() => navigate("/auth")}>
                                Log In
                            </li>
                            <li
                                className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer'
                                onClick={() => navigate("/auth")}
                            >
                                Sign Up
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            {/* Main Content */}
            <main className='p-4'>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
