import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserProfile {
    username: string;
    picture_url: string;
    bio: string;
}

const Customize: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [newBio, setNewBio] = useState<string>("");
    const [newPicture, setNewPicture] = useState<File | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = sessionStorage.getItem("token");
            const username = sessionStorage.getItem("username");

            if (!token || !username) {
                navigate("/auth");
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER}/client/users/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(response.data);
                setNewBio(response.data.bio || "");
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewBio(e.target.value);
    };

    const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewPicture(e.target.files[0]);
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
            formData.append("bio", newBio);
            if (newPicture) {
                formData.append("picture", newPicture);
            }

            await axios.put(`${import.meta.env.VITE_SERVER}/client/users/${username}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate(`/profile/${username}`);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    const handleCancel = () => {
        navigate(`/profile/${sessionStorage.getItem("username")}`);
    };

    return (
        <div className='profile-container p-6 max-w-4xl mx-auto'>
            <div className='flex items-start space-x-6 text-left'>
                <img
                    src={profile?.picture_url || `${import.meta.env.VITE_DEFAULT_PIC}`}
                    alt='User Avatar'
                    className='w-32 h-32 rounded-full object-cover border-4 border-gray-300'
                />
                <div className='flex-grow'>
                    <h1 className='text-4xl font-extrabold text-gray-800 text-left mb-2'>
                        {profile?.username || "Anonymous"}
                    </h1>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <textarea
                                value={newBio}
                                onChange={handleBioChange}
                                rows={4}
                                className='mt-1 block w-full p-2 border border-gray-300 rounded-md'
                                style={{ width: "100%" }}
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='block text-lg font-medium text-gray-700'>Profile Picture</label>
                            <input type='file' accept='image/*' onChange={handlePictureChange} />
                        </div>
                        <div className='flex space-x-4'>
                            <button
                                type='submit'
                                className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700'
                            >
                                Save Changes
                            </button>
                            <button
                                type='button'
                                onClick={handleCancel}
                                className='flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400'
                            >
                                Cancel Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Customize;
