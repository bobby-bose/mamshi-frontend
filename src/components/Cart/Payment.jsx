import React, { useEffect, useState } from "react";
import qrcode from "../../assets/qrcode.png";

export default function PaymentPage() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");

  useEffect(() => {
    const name = sessionStorage.getItem("productName");
    const description = sessionStorage.getItem("productDescription");
    if (name) setProductName(name);
    if (description) setProductDescription(description);
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
