import React, { useEffect, useState } from "react";
import client from "../api/client";
import colors from "../colors";

export default function AdminStockUpdate() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 New product state
  const [newProduct, setNewProduct] = useState({
    Name: "",
    Description: "",
    Price: "",
    main: null, // file
    sub: null, // file (optional)
    S: false,
    M: false,
    L: false,
    XL: false,
    colors: [],
    stock: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await client.get("/products/all");
      setProducts(res.data.products);
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
      fetchProducts();
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Error updating stock!");
    }
  };

  // 🔹 Handle new product submission
// 🔹 Handle new product submission
const handleNewProductSubmit = async (e) => {
  e.preventDefault();
  console.log("Form submission started"); // ✅ Form submission triggered

  try {
    const formData = new FormData();
    console.log("FormData object created");

    // Append product details
    console.log("Appending Name:", newProduct.Name);
    formData.append("Name", newProduct.Name);

    console.log("Appending Description:", newProduct.Description);
    formData.append("Description", newProduct.Description);

    console.log("Appending Price:", Number(newProduct.Price));
    formData.append("Price", Number(newProduct.Price));

    console.log("Appending Stock:", Number(newProduct.stock));
    formData.append("stock", Number(newProduct.stock));

    // Append sizes
    console.log("Appending Sizes:", { S: newProduct.S, M: newProduct.M, L: newProduct.L, XL: newProduct.XL });
    formData.append("S", newProduct.S);
    formData.append("M", newProduct.M);
    formData.append("L", newProduct.L);
    formData.append("XL", newProduct.XL);

    // Append colors
   // Append colors
if (newProduct.colors.length > 0) {
  console.log("Appending Colors:", newProduct.colors);
  formData.append("colors", JSON.stringify(newProduct.colors));
} else {
  console.log("No colors selected");
}


    // Append images
    if (newProduct.main) {
      console.log("Appending main image:", newProduct.main.name);
      formData.append("main", newProduct.main);
    } else {
      console.log("No main image provided");
    }

    if (newProduct.sub) {
      console.log("Appending sub image:", newProduct.sub.name);
      formData.append("sub", newProduct.sub);
    } else {
      console.log("No sub image provided");
    }

    console.log("Sending POST request to /products/new");
    await client.post("/products/new", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("POST request successful");

    alert("✅ New product added!");
    console.log("Resetting newProduct state");
    setNewProduct({
      Name: "",
      Description: "",
      Price: "",
      main: null,
      sub: null,
      S: false,
      M: false,
      L: false,
      XL: false,
      colors: "",
      stock: 0,
    });

    console.log("Fetching updated product list");
    fetchProducts();
  } catch (error) {
    console.error("Error adding product:", error);
    if (error.response) console.error("Backend response:", error.response.data);
    alert(error.response?.data?.message || "❌ Failed to add product!");
  }
};


  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ADMIN STOCK UPDATE
      </h1>

      {/* 🔹 New Product Form */}
      <form
        onSubmit={handleNewProductSubmit}
        className="mb-8 p-6 border rounded-lg shadow-md bg-gray-50"
        encType="multipart/form-data"
      >
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={newProduct.Name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, Name: e.target.value })
            }
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.Price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, Price: e.target.value })
            }
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewProduct({ ...newProduct, main: e.target.files[0] })
            }
            className="border rounded px-3 py-2"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewProduct({ ...newProduct, sub: e.target.files[0] })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Stock"
            value={newProduct.stock}
            onChange={(e) =>
              setNewProduct({ ...newProduct, stock: e.target.value })
            }
            className="border rounded px-3 py-2"
            required
          />
       <div className="mt-2">
  <h4 className="mb-1 font-semibold">Select Colors:</h4>
<div className="mt-2">
  <h4 className="mb-1 font-semibold">Select Colors:</h4>
  <div className="flex flex-wrap gap-2">
    {colors.map((c) => (
      <div
        key={c.name}
        title={c.name}
        className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
          newProduct.colors.includes(c.name) ? "border-black" : "border-gray-300"
        }`}
        style={{ backgroundColor: c.code }}
        onClick={() => {
          // toggle selection
          if (newProduct.colors.includes(c.name)) {
            setNewProduct({
              ...newProduct,
              colors: newProduct.colors.filter((col) => col !== c.name),
            });
          } else {
            setNewProduct({
              ...newProduct,
              colors: [...newProduct.colors, c.name],
            });
          }
        }}
      ></div>
    ))}
  </div>
</div>

</div>

        </div>

        <textarea
          placeholder="Description"
          value={newProduct.Description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, Description: e.target.value })
          }
          className="border rounded px-3 py-2 mt-4 w-full"
          required
        />

        {/* Sizes */}
        <div className="flex gap-4 mt-4">
          {["S", "M", "L", "XL"].map((size) => (
            <label key={size} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={newProduct[size]}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, [size]: e.target.checked })
                }
              />
              {size}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ➕ Add Product
        </button>
      </form>

      {/* 🔹 Existing Products Table */}
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
                          p._id === product._id
                            ? { ...p, stock: e.target.value }
                            : p
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
