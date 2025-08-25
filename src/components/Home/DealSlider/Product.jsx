import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Product component to display a single product card.
 *
 * It's now a clickable link that navigates to the product's
 * details page using its unique ID.
 * * @param {object} props - The product properties.
 * @param {string} props._id - The unique ID of the product.
 * @param {string} props.Name - The name of the product.
 * @param {number} props.Price - The price of the product.
 * @param {string} props.Description - The description of the product.
 * @param {string} props.main - The URL of the main product image.
 */
const Product = ({ _id, Name, Price, Description, main }) => {
  return (
    // The entire card is now a clickable link.
    // The "to" prop uses a template literal to embed the product's _id in the URL.
    <Link to={`/product/${_id}`}>
      <div className="w-full h-80 transform hover:scale-105 transition-transform duration-150 ease-out">
        <img 
          draggable="false" 
          className="w-full h-full object-contain rounded-md" 
          src={main} 
          alt={Name} 
        />
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
