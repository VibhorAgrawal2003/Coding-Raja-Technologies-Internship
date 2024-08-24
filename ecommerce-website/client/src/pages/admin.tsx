import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin: React.FC = () => {
    const [name, setName] = useState<string>("");
    const [provider, setProvider] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [cost, setCost] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
    const navigate = useNavigate();

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const token = sessionStorage.getItem("token");
        const username = sessionStorage.getItem("username");

        if (!token || !username) {
            navigate("/auth");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("name", name);
            formData.append("provider", provider);
            formData.append("category", category);
            formData.append("cost", cost);
            formData.append("description", description);

            if (image) {
                formData.append("image", image);
            }

            await axios.post(`${import.meta.env.VITE_SERVER}/client/product/add`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Product added successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    useEffect(() => {
        if (isSuccessful) {
            alert("Successful upload!");
            setIsSuccessful(false);
        }
    }, [isSuccessful, navigate]);

    return (
        <div className='auth-container p-6 max-w-4xl mx-auto'>
            <form className='admin-form m-auto text-left' onSubmit={handleSubmit}>
                <h1>Admin Portal</h1>
                <div>
                    <label>
                        <input
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder='Product Name'
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type='text'
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            required
                            placeholder='Provider'
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type='text'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            placeholder='Category'
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type='text'
                            value={cost}
                            onChange={(e) => setCost(e.target.value)}
                            required
                            placeholder='Cost'
                        />
                    </label>
                </div>
                <div>
                    <label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder='Description'
                            rows={6}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black'
                        />
                    </label>
                </div>
                <div className='mb-4'>
                    <label className='ml-2 text-gray-400'>Product Image</label>
                    <input type='file' accept='image/*' onChange={handlePictureChange} required />
                </div>

                <button type='submit' onClick={() => handleSubmit}>
                    Upload Product
                </button>
                <div className='switch-button'>Delete existing product</div>
            </form>
        </div>
    );
};

export default Admin;
