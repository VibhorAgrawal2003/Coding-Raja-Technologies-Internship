import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const endpoint = `${import.meta.env.VITE_SERVER}/auth/${isLogin ? "login" : "signup"}`;

        try {
            const response = await axios.post(endpoint, {
                username,
                password,
                email: isLogin ? undefined : email,
                phone: isLogin ? undefined : phone,
                address: isLogin ? undefined : address,
            });

            // Save the token in sessionStorage
            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("username", username);
            setIsSuccessful(true);
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

    useEffect(() => {
        if (isSuccessful) {
            if (isLogin) {
                navigate("/");
            } else {
                navigate("/auth");
            }
            setIsSuccessful(false);
        }
    }, [isSuccessful, isLogin, navigate]);

    return (
        <div className='auth-container p-6 max-w-5xl mx-auto'>
            <form className='auth-form m-auto text-left' onSubmit={handleSubmit}>
                <h1>TitanMart</h1>
                <div>
                    <label>
                        <input
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder='Username'
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder='Password'
                        />
                    </label>
                </div>
                {!isLogin && (
                    <>
                        <div>
                            <label>
                                <input
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required={!isLogin}
                                    placeholder='Email'
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type='text'
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder='Phone'
                                />
                            </label>
                        </div>
                        <div>
                            <label>
                                <input
                                    type='text'
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder='Address'
                                />
                            </label>
                        </div>
                    </>
                )}
                <button type='submit'>{isLogin ? "Log In" : "Sign Up"}</button>
                <div className='switch-button' onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Create New Account" : "Log In to Existing Account"}
                </div>
            </form>
        </div>
    );
};

export default Auth;
