import React, { useEffect, useState } from "react";
import qrcode from "../../assets/qrcode.png";

export default function PaymentPage() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // size → color mapping
  const sizeColors = {
    S: "bg-green-500",
    M: "bg-blue-500",
    L: "bg-purple-500",
    XL: "bg-red-500",
  };

  useEffect(() => {
    const name = sessionStorage.getItem("productName");
    const description = sessionStorage.getItem("productDescription");
    const size = sessionStorage.getItem("selectedSize"); // get size from storage

    if (name) setProductName(name);
    if (description) setProductDescription(description);
    if (size) setSelectedSize(size);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 pt-[50px]">
      {/* Product name */}
      <h1 className="text-xl sm:text-2xl font-bold mb-2 text-center">
        {productName}
      </h1>
      <h3 className="text-sm sm:text-lg text-darkGray-700 mb-6 text-center">
        {productDescription}
      </h3>

      {/* Selected Size Button */}
      {selectedSize && (
        <button
          className={`px-6 py-2 rounded-full text-white font-semibold shadow-md mb-6 ${sizeColors[selectedSize] || "bg-gray-500"}`}
        >
          {selectedSize === "S" && "Small (S)"}
          {selectedSize === "M" && "Medium (M)"}
          {selectedSize === "L" && "Large (L)"}
          {selectedSize === "XL" && "Extra Large (XL)"}
        </button>
      )}

      {/* QR code image */}
      <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
        <img
          src={qrcode}
          alt="QR Code"
          className="w-full h-full object-contain shadow-lg border rounded-xl"
        />
      </div>

      <p className="mt-6 text-darkGray-600 text-center text-sm sm:text-base">
        Scan the QR code to make the payment
      </p>
    </div>
  );
}
