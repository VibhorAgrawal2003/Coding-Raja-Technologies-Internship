import { useEffect, useState } from "react";
import axios from "axios";

interface UserProfile {
    username: string;
    email: string;
    phone: string;
    address: string;
    picture_url: string;
}

const Profile: React.FC = () => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const storedUsername = sessionStorage.getItem("username");
                const token = sessionStorage.getItem("token");

                if (storedUsername) {
                    const response = await axios.get(`${import.meta.env.VITE_SERVER}/client/user/${storedUsername}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    setUserProfile(response.data);
                } else {
                    console.error("Username not found in sessionStorage");
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        fetchUserProfile();
    }, []);

    return (
        <div className='profile-container mx-auto'>
            <div className='flex flex-col items-center justify-center py-8'>
                <img
                    src={userProfile?.picture_url}
                    alt={userProfile?.username}
                    className='w-48 h-48 rounded-full mb-4'
                />
                <h1 className='text-3xl font-bold mb-2'>{userProfile?.username}</h1>
                <p className='text-lg mb-2'>{userProfile?.email}</p>
                <p className='text-lg mb-2'>{userProfile?.phone}</p>
                <p className='text-lg mb-2'>{userProfile?.address}</p>
            </div>
        </div>
    );
};

export default Profile;
