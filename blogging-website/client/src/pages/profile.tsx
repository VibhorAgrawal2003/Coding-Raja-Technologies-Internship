import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import BlogCard from "../components/BlogCard";

interface UserProfile {
    username: string;
    picture_url: string;
    bio: string;
}

interface Blog {
    bid: number;
    title: string;
    description: string;
    content: string;
    likes: number;
    tags: Array<string>;
    date_upload: Date;
    date_modify: Date;
}

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [blogs, setBlogs] = useState<Array<Blog>>([]);

    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = sessionStorage.getItem("token");

            if (!token) {
                navigate("/auth");
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER}/client/users/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [username, navigate]);

    useEffect(() => {
        const fetchBlogs = async () => {
            const token = sessionStorage.getItem("token");

            if (!token) {
                navigate("/auth");
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER}/client/blogs/user/${username}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBlogs(response.data.blogs);
            } catch (error) {
                console.log("Error fetching blogs by this user: ", error);
            }
        };

        fetchBlogs();
    }, [username, navigate]);

    return (
        <div className='profile-container p-6 max-w-4xl mx-auto'>
            <div className='flex items-center space-x-6'>
                <img
                    src={profile?.picture_url || `${import.meta.env.VITE_DEFAULT_PIC}`}
                    alt='User Avatar'
                    className='w-32 h-32 rounded-full object-cover border-4 border-gray-300'
                />
                <div>
                    <h1 className='text-4xl font-extrabold text-gray-800 text-left mb-2'>
                        {profile?.username || "Anonymous"}
                    </h1>
                    <p className='text-lg text-gray-600 mb-4 text-left'>
                        {profile?.bio || "This user does not exist."}
                    </p>
                    {username === sessionStorage.username && (
                        <p
                            className='text-sm text-gray-600 text-left cursor-pointer hover:text-blue-500'
                            onClick={() => navigate("/customize")}
                        >
                            Customize Profile
                        </p>
                    )}
                </div>
            </div>

            <div className='mt-6 p-4 border-t border-gray-200'>
                <h2 className='text-2xl font-semibold text-gray-700 text-left'>
                    Blogs by {profile?.username || "Anonymous"}
                </h2>

                <div className='mt-4 space-y-4'>
                    {blogs.length > 0 ? (
                        blogs.map((blog) => <BlogCard key={blog.bid} blog={blog} />)
                    ) : (
                        <p className='text-gray-600'>No blogs available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
