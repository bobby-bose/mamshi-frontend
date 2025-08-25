import React, { useEffect, useState } from "react";
// Assuming you have the QR code image locally, otherwise you can use a placeholder
import qrcode from "../../assets/qrcode.png"; 

export default function PaymentPage() {
  // Get the total price from session storage and convert it to a number
  const totalPrice = parseFloat(sessionStorage.getItem("totalPrice"));

  // This useEffect is currently empty but can be used for future logic
  useEffect(() => {
    // You could add logic here to handle payment status updates or timers
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 pt-[50px]">
      {/* Payment message with the total price */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Total Amount: ₹{totalPrice ? totalPrice.toFixed(2) : "0.00"}
        </h2>
        <p className="mt-2 text-darkGray-600 text-base sm:text-lg">
          Please pay the amount to the QR code below to complete your order.
        </p>
      </div>

      {/* QR code image */}
      <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
        {/* Placeholder for the QR code image if you don't have one */}
        {/* You should replace this with a proper QR code image URL or base64 data if available */}
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
