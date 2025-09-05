// PaymentSuccess.js
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState("Verifying your payment...");

  useEffect(() => {
    console.log("🔹 Full URL:", window.location.href); // Log the entire URL

    const verifyPayment = async () => {
      // Extract query params from URL
      const status = searchParams.get("status"); // SUCCESS or FAILED
      const merchantOrderId = searchParams.get("merchantOrderId");
      const phonePeTxnId = searchParams.get("phonePeTxnId");
      const amount = sessionStorage.getItem("amount"); // still get amount from sessionStorage or backend
      const userId = sessionStorage.getItem("userId"); // userId stored before payment

      console.log("Payment success page loaded with params:", {
        status,
        merchantOrderId,
        phonePeTxnId,
        amount,
        userId,
      });

      if (!merchantOrderId || !phonePeTxnId || !amount || !userId) {
        setStatusMessage("Invalid payment data received.");
        console.error("❌ Missing required payment parameters");
        return;
      }

      if (status !== "SUCCESS") {
        setStatusMessage("❌ Payment failed or cancelled.");
        return;
      }

      try {
        // Call backend to verify & complete payment
        const response = await axios.post("https://mamshi-backend.onrender.com/api/v1/payments/complete", {
          userId,
          amount,
          merchantOrderId,
          phonePeTxnId,
        });

        console.log("/payments/complete response:", response.data);
        setStatusMessage("✅ Payment successful!");
      } catch (error) {
        setStatusMessage("❌ Payment verification failed.");
        console.error("/payments/complete failed:", error.response?.data || error.message);
      }
    };

    verifyPayment();
  }, [searchParams]);

  return <h2>{statusMessage}</h2>;
};

export default PaymentSuccess;
