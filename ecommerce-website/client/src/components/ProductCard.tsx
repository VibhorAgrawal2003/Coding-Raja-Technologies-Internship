import React from "react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
    id: number;
    name: string;
    category: string;
    imageUrl: string;
    cost: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, category, imageUrl, cost }) => {
    const navigate = useNavigate();

    return (
        <div className='w-64 mx-auto overflow-hidden bg-white'>
            <div className='p-4 text-center flex flex-col items-center h-full'>
                <h2 className='text-md font-semibold text-ellipsis overflow-hidden whitespace-nowrap w-full'>{name}</h2>
                <p className='text-gray-500 text-sm'>{category}</p>
                <img className='h-24 w-24 my-4 mx-auto object-contain' src={imageUrl} alt={name} />
                <div className='mt-2'>
                    <span className='text-lg font-bold text-green-600'>₹{cost.toFixed(2)}</span>
                </div>
                <button
                    className='w-full bg-green-500 text-white text-sm font-semibold py-2 mt-4 rounded-md'
                    onClick={() => {
                        navigate(`/product/${id}`);
                    }}
                >
                    View Product
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
