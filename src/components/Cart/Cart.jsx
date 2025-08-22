import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import client from "../../api/client";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className="p-4 bg-gray-50 min-h-screen mt-[50px]">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">My Cart</h2>

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
                <img
                  src={item.product?.productDetails?.main}
                  alt={item.product?.productDetails?.Name}
                  className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl"
                />
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
                  ₹{item.product?.productDetails?.Price}
                </p>

                {/* Sizes */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* Display the size chosen by the user from the item object */}
                  <span className="border px-2 py-1 text-lg rounded-md bg-green-800 text-white font-semibold">
                  {item.size}
                  </span>
                </div>

                {/* User Info */}
                <div className="mt-3 text-sm text-stone">
                  Ordered by:{" "}
                  <span className="font-medium">{item.user?.user?.name}</span>{" "}
                  <br />
                  Mobile:{" "}
                  <span className="font-medium">
                    {item.user?.user?.mobileNumber}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 sm:mt-0 sm:ml-4 flex sm:flex-col gap-2">
                <button
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                  onClick={() => {
                    sessionStorage.setItem(
                      "productName",
                      item.product?.productDetails?.Name
                    );
                    sessionStorage.setItem(
                      "productDescription",
                      item.product?.productDetails?.Description
                    );
                    navigate("/checkout");
                  }}
                >
                  Buy Now
                </button>
                <button
                  className="w-full sm:w-auto bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-darkGray-600"
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
    </div>
  );
}