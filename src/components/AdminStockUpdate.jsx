import React, { useEffect, useState } from "react";
import axios from "axios";
import client from "../api/client";

export default function AdminStockUpdate() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await client.get("/products/all");
      setProducts(res.data.products);
      console.log(res.data.products);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const updateStock = async (productId, stock) => {
    try {
      await client.put(`/products/${productId}/stock`, { stock });
      alert("Stock updated successfully!");
      fetchProducts(); // refresh after update
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Error updating stock!");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">ADMIN STOCK UPDATE</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Stock Remaining</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="p-3">
                  <img
                    src={product.main}
                    alt={product.Name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </td>
                <td className="p-3 font-semibold">{product.Name}</td>
                <td className="p-3">{product.Description}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={product.stock}
                    min="0"
                    onChange={(e) =>
                      setProducts((prev) =>
                        prev.map((p) =>
                          p._id === product._id ? { ...p, stock: e.target.value } : p
                        )
                      )
                    }
                    className="border rounded px-2 py-1 w-24"
                  />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => updateStock(product._id, product.stock)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
