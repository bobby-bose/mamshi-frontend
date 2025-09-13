import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {BACKEND_URL} from "../../../constant.js";
/**
 * Product component to display a single product card with main & sub images.
 *
 * @param {object} props - The product properties.
 * @param {string} props._id - The unique ID of the product.
 * @param {string} props.Name - The name of the product.
 * @param {number} props.Price - The price of the product.
 * @param {string} props.Description - The description of the product.
 * @param {string} props.main - The path of the main product image from backend.
 * @param {string} props.sub - The path of the sub image from backend.
 * @param {number} props.stock - The available stock count.
 */
const Product = ({ _id, Name, Price, Description, main, sub, stock }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Prepare images array
  const images = [main, sub].filter(Boolean).map((img) => `${BACKEND_URL}${img}`);

  // Handle left/right navigation
  const prevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <Link to={`/product/${_id}`} className="group relative block">
      <div className="w-full h-80 relative rounded-md overflow-hidden transform hover:scale-105 transition-transform duration-150 ease-out">
        <img
          draggable="false"
          className="w-full h-full object-cover rounded-md"
          src={images[currentImageIndex]}
          alt={Name}
        />

        {/* Left & Right buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              &#10094;
            </button>
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              &#10095;
            </button>
          </>
        )}

       
      </div>

      <div className="flex flex-col items-start px-1 py-2">
        <h2 className="font-medium text-sm mt-2">{Name}</h2>
        <span className="text-primary-green text-sm">₹{Price}</span>
        <span className="text-stone text-sm">{Description}</span>
      </div>
    </Link>
  );
};

export default Product;
