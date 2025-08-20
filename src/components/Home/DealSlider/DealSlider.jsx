import Product from './Product';
import Slider from 'react-slick';
import { NextBtn, PreviousBtn } from '../Banner/Banner';
import { Link } from 'react-router-dom';
import client from '../../../api/client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
export const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    initialSlide: 1,
    swipe: false,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
};

const DealSlider = ({ title }) => {
    const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            // Replace this URL with your actual API endpoint
            const { data } = await client.get('/products');
            console.log("Fetched products:", data.products);
            setProducts(data.products);
        } catch (error) {
            console.error("Error fetching products:", error);
            // Handle the error (e.g., set an error state or display a message)
        }
    };

    fetchProducts();
}, []);

    return (
        <section className="bg-white w-full shadow overflow-hidden">
            {/* */}
            <div className="flex px-6 py-3 justify-between items-center">
                <h1 className="text-xl font-medium">{title}</h1>
                <Link to="/products" className="bg-gray-700 text-xs font-medium text-white px-5 py-2.5 rounded-sm shadow-lg">VIEW ALL</Link>
            </div>
            <hr />
            {/* */}

            {products.length > 0 ? (
                <Slider {...settings}>
                    {products.map((item, i) => (
                        console.log("Rendering product:", item),
                        <Product {...item} key={item._id || i} />
                    ))}
                </Slider>
            ) : (
                <p className="text-center py-5">No products found.</p>
            )}

        </section>
    );
};



export default DealSlider;
