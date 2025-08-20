import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import Product from './Product';
import client from '../../../api/client';

// Import slick CSS (must be included for react-slick to work)
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const MobileDealSlider = ({ title }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await client.get('/products'); // change API if needed
        console.log('Fetched products:', data.products);
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Slider settings for auto-play
  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,           // transition speed (ms)
    slidesToShow: 2,       // Show 2 products at a time
    slidesToScroll: 1,
    autoplay: true,        // enable auto sliding
    autoplaySpeed: 2500,   // wait time before next slide (ms)
    cssEase: "linear",     // makes sliding continuous
    arrows: false,         // hide navigation buttons
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="bg-white w-full shadow overflow-hidden">
      {/* Header */}
      <div className="flex flex-col px-6 py-3 justify-between items-center gap-2">
        <h1 className="font-medium">{title}</h1>
        <Link
          to="/products"
          className="bg-gray-700 text-xs font-medium text-white px-5 py-2.5 rounded-sm shadow-lg"
        >
          VIEW ALL
        </Link>
      </div>

      <hr />

      {/* Products slider */}
      {products.length > 0 ? (
        <div className="px-4 py-4">
          <Slider {...settings}>
            {products.map((item, i) => (
              <div key={item._id || i} className="px-2">
                <Product {...item} />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <p className="text-center py-5">No products found.</p>
      )}
    </section>
  );
};

export default MobileDealSlider;
