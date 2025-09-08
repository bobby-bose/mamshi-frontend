import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import client from "../../api/client";
import CounterBanner from "../Home/Banner/top";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  // Add this colorMap above your component
const colorMap = {
  Black: "#000000",
  White: "#FFFFFF",
  Blue: "#1E90FF",
  "Dark Green": "#006400",
  Cream: "#FFFDD0",
  Red: "#FF0000",
  Maroon: "#800000",
  "Mustard Yellow": "#FFDB58",
  Beige: "#F5F5DC",
  SkyBlue: "#87CEEB",
  Olive: "#808000",
  "Black & White Stripes": "repeating-linear-gradient(45deg, #000 0 5%, #fff 5% 10%)",
  "Blue & White Stripes": "repeating-linear-gradient(45deg, #1E90FF 0 5%, #fff 5% 10%)",
  "Mustard Yellow & White Stripes": "repeating-linear-gradient(45deg, #FFDB58 0 5%, #fff 5% 10%)",
  "Maroon/Burgundy & White Stripes": "repeating-linear-gradient(45deg, #800000 0 5%, #fff 5% 10%)",
};


  const mobileNumber = sessionStorage.getItem("mobileNumber");
  if (!mobileNumber) {
    navigate("/login");
  }

  useEffect(() => {
    client
      .get(`/wishlist`)
      .then(async (response) => {
        const items = response.data.wishlistItems;

        const userItems = items.filter(
          (item) => item.mobileNumber === mobileNumber
        );

        const enrichedItems = await Promise.all(
          userItems.map(async (item) => {
            const [productRes, userRes] = await Promise.all([
              client.get(`/product/${item.productId}`),
              client.get(`/me/${item.mobileNumber}`),
            ]);

            return {
              ...item,
              product: productRes.data,
              user: userRes.data,
              // Add a quantity field to each item, default to 1
              quantity: 1, 
            };
          })
        );
        console.log("Fetched wishlist items:", enrichedItems);
        setWishlist(enrichedItems);
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
      });
  }, [mobileNumber]);

  // Handle quantity change for a specific item
  const handleQuantityChange = (itemId, change) => {
    setWishlist(prevWishlist =>
      prevWishlist.map(item =>
        item._id === itemId
          ? { ...item, count: Math.max(1, item.count + change) } // Ensure count is at least 1
          : item
      )
    );
  };

  // Calculate the total price of all items in the wishlist
  const totalPrice = wishlist.reduce((total, item) => {
    const price = item.product?.productDetails?.Price || 0;
    const quantity = item.count || 1; 
    return total + price * quantity;
  }, 0);

  // Handle the single "Buy Now" button click
  const handleBuyAll = () => {
    sessionStorage.setItem("totalPrice", totalPrice);
    const orderItems = wishlist.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    sessionStorage.setItem("orderItems", JSON.stringify(orderItems));
    navigate("/checkout");
  };

  return (
    <>   
    <div className="p-4 bg-gray-50 min-h-screen mt-[20px]">

      {wishlist.length === 0 ? (
        <p className="text-stone text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {wishlist.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row sm:items-start"
            >
              {/* Product Image */}
            <div className="w-full sm:w-40 flex justify-center">
  {item.product?.productDetails ? (
    <img
      src={
        item.product.productDetails.main
          ? `http://localhost:4000${item.product.productDetails.main}`
          : "/placeholder.png"
      }
      alt={item.product.productDetails.Name}
      className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl"
    />
  ) : (
    <img
      src="/placeholder.png"
      alt="Product not available"
      className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl"
    />
  )}
</div>

              {/* Product Details */}
              <div className="mt-4 sm:mt-0 sm:ml-4 flex-1">
                <h3 className="text-lg font-semibold">
                  {item.product?.productDetails?.Name}
                </h3>
                <p className="text-darkGray-600 text-sm">
                  {item.product?.productDetails?.Description}
                </p>
                <p className="text-lg font-bold mt-2">
                  ₹{item.product?.productDetails?.Price ?? "-"}
                </p>

               {/* Ordered Size and Color */}
{/* Ordered Size and Color */}
<div className="mt-2">
  {/* Size */}
  <div className="flex items-center gap-2 mb-1">
    <span className="font-semibold text-gray-700">Ordered Size:</span>
    <span className="text-lg font-semibold">{item.size}</span>
  </div>

  {/* Color */}
  {item.color && (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-gray-700">Ordered Color:</span>
      <span
        className="w-6 h-6 rounded-full border border-gray-300"
        style={{
          background: colorMap[item.color] || "#000",
        }}
        title={item.color}
      ></span>
      <span className="text-sm">{item.color}</span>
    </div>
  )}
</div>



                {/* Quantity Counter */}
                <div className="flex items-center mt-3">
                  <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1">
                    <button onClick={() => handleQuantityChange(item._id, -1)} className="text-gray-500 hover:text-gray-800 text-lg font-bold">-</button>
                    <span className="mx-3 text-sm font-semibold">{item.count}</span>
                    <button onClick={() => handleQuantityChange(item._id, 1)} className="text-gray-500 hover:text-gray-800 text-lg font-bold">+</button>
                  </div>
                </div>

                {/* User Info */}
                <div className="mt-3 text-lg text-stone" style={{fontWeight: "bold"}}>
                  Ordered by:{" "}
                  <span className="font-large" style={{fontWeight: "bold"}}> {item.user?.user?.mobileNumber}</span>
                  <br />
                 
                </div>
              </div>

              {/* Actions - The "Remove" button remains */}
              <div className="mt-4 sm:mt-0 sm:ml-4 flex sm:flex-col gap-2">
                <button
                  className="w-full sm:w-auto bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
                  onClick={() => {
                    client
                      .delete(`/wishlist/${item._id}`)
                      .then(() => {
                        console.log("Item removed from wishlist");
                        setWishlist((prev) =>
                          prev.filter((w) => w._id !== item._id)
                        );
                      })
                      .catch((error) => {
                        console.error(
                          "Error removing item from wishlist:",
                          error
                        );
                      });
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* New Section for Total Price and Buy All Items Button */}
      {wishlist.length > 0 && (
       <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg flex justify-between items-center">
  {/* Left side → Button */}
  <button
    className="bg-darkGray text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
    onClick={handleBuyAll}
  >
    Buy All Items
  </button>

  {/* Right side → Total Price */}
  <div className="flex flex-col items-end">
    <span className="text-xl font-bold">Total Price:</span>
    <span className="text-2xl font-extrabold text-blue-600">
      ₹{totalPrice.toFixed(2)}
    </span>
  </div>
</div>

      )}
    </div>
    </>

  );
}