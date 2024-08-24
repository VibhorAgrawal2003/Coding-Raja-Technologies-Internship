import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

interface Product {
    id: number;
    name: string;
    category: string;
    image_url: string;
    cost: number;
    purchased_by?: Array<string>;
}

const Home: React.FC = () => {
    const [plushies, setPlushies] = useState<Product[]>([]);
    const [figures, setFigures] = useState<Product[]>([]);
    const [loadingPlushies, setLoadingPlushies] = useState<boolean>(true);
    const [loadingFigures, setLoadingFigures] = useState<boolean>(true);
    const [errorPlushies, setErrorPlushies] = useState<string | null>(null);
    const [errorFigures, setErrorFigures] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlushies = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER}/products/plushies`);
                setPlushies(response.data);
                setLoadingPlushies(false);
            } catch (err) {
                setErrorPlushies("Failed to fetch plushies");
                setLoadingPlushies(false);
            }
        };

        const fetchFigures = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_SERVER}/products/figures`);
                setFigures(response.data);
                setLoadingFigures(false);
            } catch (err) {
                setErrorFigures("Failed to fetch figures");
                setLoadingFigures(false);
            }
        };

        fetchPlushies();
        fetchFigures();
    }, []);

    if (loadingPlushies || loadingFigures) {
        return <div className='text-center text-xl py-10'>Loading...</div>;
    }

    if (errorPlushies || errorFigures) {
        return <div className='text-center text-red-600 text-xl py-10'>{errorPlushies || errorFigures}</div>;
    }

    const limitedPlushies = plushies.slice(0, 4);
    const limitedFigures = figures.slice(0, 4);

    return (
        <>
            {/* HERO SECTION */}
            <div className='py-8 bg-green-500 text-white'>
                <div className='p-12 text-center'>
                    <h1 className='text-4xl font-bold mb-4'>Welcome to TitanMart!</h1>
                    <p className='text-xl mb-6'>
                        Explore our collection of quality figures, plushies, and merchandise.
                    </p>
                </div>
            </div>

            {/* PLUSHIES SECTION */}
            <div className='p-6'>
                <div className='ml-8 w-60 overflow-hidden'>
                    <h2 className='text-2xl text-left font-bold text-gray-800'>Quality Plushies!</h2>
                    <hr className='my-2 border-green-500 border-2 rounded-full' />
                </div>
                <div className='p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {limitedPlushies.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            category={product.category}
                            imageUrl={product.image_url}
                            cost={product.cost}
                        />
                    ))}
                </div>
            </div>

            {/* FIGURES SECTION */}
            <div className='p-6'>
                <div className='ml-8 w-60 overflow-hidden'>
                    <h2 className='text-2xl text-left font-bold text-gray-800'>Action Figures!</h2>
                    <hr className='my-2 border-green-500 border-2 rounded-full' />
                </div>
                <div className='p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                    {limitedFigures.map((product) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            category={product.category}
                            imageUrl={product.image_url}
                            cost={product.cost}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Home;
