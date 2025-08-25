import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Product from './Product';
import client from '../../../api/client';

const MobileDealSlider = ({ title }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await client.get('/products');
        setProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

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

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((item, i) => (
              <div key={item._id || i}>
                <Product {...item} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center py-5">No products found.</p>
      )}
    </section>
  );
};

export default MobileDealSlider;