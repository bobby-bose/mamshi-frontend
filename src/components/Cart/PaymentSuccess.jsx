import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../api/client";
import Confetti from "react-confetti";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  const { orderId } = useParams(); // ✅ get parameter from URL
  const [statusMessage, setStatusMessage] = useState("Verifying your payment...");
  const [success, setSuccess] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });

    const verifyPayment = async () => {
      const userId = sessionStorage.getItem("userId");
      const amount = sessionStorage.getItem("amount");
      let merchantOrderId = sessionStorage.getItem("merchantOrderId");
      let phonePeTxnId = sessionStorage.getItem("phonePeTxnId");

      // ✅ If URL has an orderId, override session one
      if (orderId) {
        merchantOrderId = orderId;
      }

      if (!userId || !amount || !merchantOrderId) {
        setStatusMessage("❌ Missing payment session data.");
        setSuccess(false);
        return;
      }

      try {
        const response = await client.post("/payments/complete", {
          userId,
          amount,
          merchantOrderId,
          phonePeTxnId,
        });

        if (response.data.phonePeTxnId) {
          sessionStorage.setItem("phonePeTxnId", response.data.phonePeTxnId);
        }

        if (response.data.success) {
          setSuccess(true);
          setStatusMessage(
            "Thank you for shopping at Sloutch DRESS! 🎉 Your order is confirmed."
          );
        } else {
          setSuccess(false);
          setStatusMessage("❌ Payment failed or not confirmed. Please try again.");
        }
      } catch (error) {
        setSuccess(false);
        setStatusMessage("❌ Payment verification failed. Please contact support.");
        console.error("/payments/complete failed:", error.response?.data || error.message);
      }
    };

    verifyPayment();
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 px-4">
      {success && <Confetti width={windowSize.width} height={windowSize.height} numberOfPieces={300} gravity={0.2} />}
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
        {success === null && <p className="text-gray-600 text-lg animate-pulse">{statusMessage}</p>}
        {success === true && (
          <div className="flex flex-col items-center space-y-4 animate-fadeIn">
            <FaCheckCircle className="w-24 h-24 text-green-500 animate-bounce" />
            <h1 className="text-3xl font-extrabold text-green-700">Payment Successful!</h1>
            <p className="text-gray-700 text-lg">{statusMessage}</p>
            <button
              className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600"
              onClick={() => (window.location.href = "/")}
            >
              Continue Shopping
            </button>
          </div>
        )}
        {success === false && (
          <div className="flex flex-col items-center space-y-4 animate-fadeIn">
            <FaTimesCircle className="w-24 h-24 text-red-500 animate-shake" />
            <h1 className="text-3xl font-extrabold text-red-600">Payment Failed</h1>
            <p className="text-gray-700 text-lg">{statusMessage}</p>
            <button
              className="mt-4 px-6 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600"
              onClick={() => (window.location.href = "/cart")}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
