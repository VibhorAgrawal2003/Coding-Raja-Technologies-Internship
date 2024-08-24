import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Product {
    id: number;
    name: string;
    provider: string;
    category: string;
    cost: number;
    description: string;
    image_url: string;
}

const Product: React.FC = () => {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = sessionStorage.getItem("token");

                const response = await axios.get(`${import.meta.env.VITE_SERVER}/client/product/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                });
                setProduct(response.data);
                console.log(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch product");
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div className='text-center text-xl py-10'>Loading...</div>;
    }

    if (error) {
        return <div className='text-center text-red-600 text-xl py-10'>{error}</div>;
    }

    return (
        <div className='product-container max-w-2xl mx-auto py-16'>
            <div className='grid grid-cols-1 sm:flex-col md:grid-cols-2 gap-8 justify-center'>
                <img
                    src={product?.image_url}
                    alt={product?.name}
                    className='w-60 h-60 object-contain rounded-lg mx-auto'
                />
                <div className='m-auto'>
                    <h1 className='text-3xl text-left font-bold'>{product?.name}</h1>
                    <p className='text-sm text-left text-gray-500'>provided by {product?.provider}</p>
                    <p className='text-2xl text-left font-bold text-green-500 my-4'>₹ {product?.cost}</p>
                    <div className='flex space-x-4 mt-4'>
                        <button className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600'>
                            Add to Cart
                        </button>
                        <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>
                            Order Now
                        </button>
                    </div>
                </div>
            </div>
            <hr className='w-3/4 border-2 my-8 mx-auto' />
            <h1 className='text-xl text-left text-gray-600 font-medium pl-8'>Product Description</h1>
            <p className='m-auto text-left text-lg text-gray-600 mt-4 pl-8'>{product?.description}</p>
        </div>
    );
};

export default Product;
