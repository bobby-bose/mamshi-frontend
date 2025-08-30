import React, { useEffect } from "react";

export default function PaymentPage() {
  const totalPrice = parseFloat(sessionStorage.getItem("totalPrice"));

  useEffect(() => {
    // Could be used for tracking payment status later
  }, []);

  // UPI details
  const upiId = "bobbykboseoffice@okaxis.com";
  const name = "BOBBY K BOSE";
  const amount = totalPrice ? totalPrice.toFixed(2) : "0.00";
  const note = "Order Payment";

  // Google Pay Intent link
  const gpayLink = `intent://pay?pa=${encodeURIComponent(
    upiId
  )}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(
    note
  )}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end;`;

  // PhonePe Intent link
  const phonepeLink = `intent://pay?pa=${encodeURIComponent(
    upiId
  )}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(
    note
  )}#Intent;scheme=upi;package=com.phonepe.app;end;`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Total Amount: ₹{amount}
        </h2>
        <p className="text-gray-600 mb-8">
          Press a button below to complete your payment securely:
        </p>

        <div className="space-y-4">
          {/* Google Pay Button */}
          <a
            href={gpayLink}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition"
          >
           
            Pay with Google Pay
          </a>

          {/* PhonePe Button */}
          <a
            href={phonepeLink}
            className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition"
          >
           
            Pay with PhonePe
          </a>
        </div>
      </div>
    </div>
  );
}
