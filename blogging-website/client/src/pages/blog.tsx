import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BlogContent from "../components/BlogContent";

interface BlogItem {
    bid: number;
    author: string;
    title: string;
    content: string;
    likes: number;
    tags: Array<string>;
    date_upload: Date;
    date_modify: Date;
}

const Blog: React.FC = () => {
    const [blogItem, setBlogItem] = useState<BlogItem | null>(null);
    const { bid } = useParams<{ bid: string }>();
    const navigate = useNavigate();
    const [isDeleting, setIsDeleting] = useState(false); // New state for delete operation

    useEffect(() => {
        const fetchBlog = async () => {
            const token = sessionStorage.getItem("token");
            const username = sessionStorage.getItem("username");

            if (!token || !username) {
                console.error("No token or username found in session");
                navigate("/auth");
                return;
            }

            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER}/client/blogs/${bid}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: { user: username },
                });
                setBlogItem(response.data);
                console.log("Fetched blog data:", response.data);
            } catch (error) {
                console.error("Error fetching blog data:", error);
            }
        };

        if (bid) {
            fetchBlog();
        }
    }, [bid, navigate]);

    const handleDelete = async () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            console.error("No token found in session");
            navigate("/auth");
            return;
        }

        try {
            setIsDeleting(true);
            await axios.delete(`${import.meta.env.VITE_SERVER}/client/blogs/${bid}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Blog deleted successfully");
            navigate("/"); // Navigate to the home or blogs list page after deletion
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Failed to delete the blog");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <div className='max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden'>
                <div className='p-6'>
                    {/* Blog Title */}
                    <h1 className='text-3xl font-semibold text-gray-800 mb-4'>{blogItem?.title || "Loading..."}</h1>

                    {/* Blog Content */}
                    <div className='text-gray-700 mb-6 text-left'>
                        <BlogContent content={blogItem?.content || "Content is loading..."} />
                    </div>

                    {/* Blog Metadata */}
                    <div className='mb-6'>
                        <div className='flex justify-between text-gray-600 text-sm'>
                            <p className='text-sm text-gray-500'>Likes: {blogItem?.likes || 0}</p>
                            <p className='text-sm text-gray-500'>
                                Uploaded on:{" "}
                                {blogItem ? new Date(blogItem.date_upload).toLocaleDateString() : "Loading..."}
                            </p>
                        </div>
                        <p
                            className='text-sm text-gray-500 text-left cursor-pointer hover:underline'
                            onClick={() => navigate(`/profile/${blogItem?.author}`)}
                        >
                            Author: {blogItem?.author || "Anonymous"}
                        </p>
                        {blogItem && sessionStorage.getItem("username") === blogItem.author && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className='mt-4 text-red-500 hover:underline'
                            >
                                {isDeleting ? "Deleting..." : "Delete Blog"}
                            </button>
                        )}
                    </div>

                    {/* Tags */}
                    <div className='text-gray-700 flex flex-wrap gap-2'>
                        <p className='font-semibold mb-2'>Tags:</p>
                        <div className='flex gap-2'>
                            {blogItem?.tags.length ? (
                                blogItem.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className='text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-md'
                                    >
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <p className='text-gray-500'>No tags available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
