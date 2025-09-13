import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import client from "../../api/client";
import { BACKEND_URL } from "../../constant.js";
import DeliveryDetailsModal from "../ProductDetails/DeliveryDetails.jsx";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({});
  const [pendingAction, setPendingAction] = useState(null); // "buyAll" or "buySingle"
  const [selectedItem, setSelectedItem] = useState(null); // for single item purchase
  const navigate = useNavigate();

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
        const userItems = items.filter((item) => item.mobileNumber === mobileNumber);
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
              quantity: 1,
            };
          })
        );
        setWishlist(enrichedItems);
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
      });
  }, [mobileNumber]);

  const handleQuantityChange = (itemId, change) => {
    setWishlist((prevWishlist) =>
      prevWishlist.map((item) =>
        item._id === itemId ? { ...item, count: Math.max(1, item.count + change) } : item
      )
    );
  };

  const totalPrice = wishlist.reduce((total, item) => {
    const price = item.product?.productDetails?.Price || 0;
    const quantity = item.count || 1;
    return total + price * quantity;
  }, 0);

  // Open modal for "Buy All Items"
  const handleBuyAll = () => {
    setPendingAction("buyAll");
    setIsModalOpen(true);
  };

  // Open modal for buying single item
  const handleBuySingle = (item) => {
    setSelectedItem(item);
    setPendingAction("buySingle");
    setIsModalOpen(true);
  };

  // Modal submit handler
  const handleModalSubmit = async (deliveryDetails) => {
    setDeliveryInfo(deliveryDetails);
    setIsModalOpen(false);

    try {
      if (pendingAction === "buyAll") {
        // Place order for all items
        await Promise.all(
          wishlist.map((item) =>
            client.post("/orders/productId/mobilenumber", {
              productId: item.productId,
              size: item.size,
              color: item.color || null,
              count: item.count,
              deliveryDetails,
            })
          )
        );
        sessionStorage.setItem("totalPrice", totalPrice);
      } else if (pendingAction === "buySingle" && selectedItem) {
        await client.post("/orders/productId/mobilenumber", {
          productId: selectedItem.productId,
          size: selectedItem.size,
          color: selectedItem.color || null,
          count: selectedItem.count,
          deliveryDetails,
        });
        sessionStorage.setItem("totalPrice", selectedItem.product.productDetails.Price * selectedItem.count);
      }

      navigate("/checkout");
    } catch (error) {
      console.error("Failed to place order", error);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen mt-[20px]">
      {wishlist.length === 0 ? (
        <p className="text-stone text-center">Your wishlist is empty.</p>
      ) : (
        <div className="space-y-6">
          {wishlist.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow p-4 flex flex-col sm:flex-row sm:items-start"
            >
              <div className="w-full sm:w-40 flex justify-center">
                <img
                  src={
                    item.product?.productDetails?.main
                      ? `${BACKEND_URL}${item.product.productDetails.main}`
                      : "/placeholder.png"
                  }
                  alt={item.product?.productDetails?.Name}
                  className="w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-xl"
                />
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-4 flex-1">
                <h3 className="text-lg font-semibold">{item.product?.productDetails?.Name}</h3>
                <p className="text-darkGray-600 text-sm">{item.product?.productDetails?.Description}</p>
                <p className="text-lg font-bold mt-2">₹{item.product?.productDetails?.Price ?? "-"}</p>

                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-700">Ordered Size:</span>
                    <span className="text-lg font-semibold">{item.size}</span>
                  </div>
                  {item.color && (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-700">Ordered Color:</span>
                      <span
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ background: colorMap[item.color] || "#000" }}
                        title={item.color}
                      ></span>
                      <span className="text-sm">{item.color}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center mt-3">
                  <div className="flex items-center border border-gray-300 rounded-lg px-2 py-1">
                    <button
                      onClick={() => handleQuantityChange(item._id, -1)}
                      className="text-gray-500 hover:text-gray-800 text-lg font-bold"
                    >
                      -
                    </button>
                    <span className="mx-3 text-sm font-semibold">{item.count}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, 1)}
                      className="text-gray-500 hover:text-gray-800 text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 sm:mt-0 sm:ml-4 flex sm:flex-col gap-2">
                <button
                  className="w-full sm:w-auto bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600"
                  onClick={() => {
                    client
                      .delete(`/wishlist/${item._id}`)
                      .then(() => setWishlist((prev) => prev.filter((w) => w._id !== item._id)))
                      .catch((error) => console.error("Error removing item from wishlist:", error));
                  }}
                >
                  Remove
                </button>

                <button
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-500"
                  onClick={() => handleBuySingle(item)}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {wishlist.length > 0 && (
        <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg flex justify-between items-center">
          <button
            className="bg-darkGray text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
            onClick={handleBuyAll}
          >
            Buy All Items
          </button>
          <div className="flex flex-col items-end">
            <span className="text-xl font-bold">Total Price:</span>
            <span className="text-2xl font-extrabold text-blue-600">₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <DeliveryDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={deliveryInfo}
      />
    </div>
  );
}
