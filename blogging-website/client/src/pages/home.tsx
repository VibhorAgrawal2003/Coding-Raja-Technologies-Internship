import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BlogCard from "../components/BlogCard";

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

const Home: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    const navigate = useNavigate();

    const handleCreateBlogClick = () => {
        navigate("/create");
    };

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER}/blogs`);
                setBlogs(response.data.blogs);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <div className='home-container p-6 max-w-5xl mx-auto'>
            <div className='flex justify-between items-end text-gray-600 text-sm'>
                <h2 className='text-2xl font-semibold text-gray-700 text-left'>Latest Blogs</h2>
                <p className='text-lg font-semibold cursor-pointer hover:text-blue-600' onClick={handleCreateBlogClick}>
                    Create Blog
                </p>
            </div>

            <div className='mt-6 space-y-4'>
                {blogs.length > 0 ? (
                    blogs.map((blog) => <BlogCard key={blog.bid} blog={blog} />)
                ) : (
                    <p className='text-gray-600'>No blogs available.</p>
                )}
            </div>
        </div>
    );
};

export default Home;
