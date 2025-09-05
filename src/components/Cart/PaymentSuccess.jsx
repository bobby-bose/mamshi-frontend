// PaymentSuccess.js
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const PaymentSuccess = ({ userId }) => {
  const [searchParams] = useSearchParams();
  const [statusMessage, setStatusMessage] = useState("Verifying your payment...");

  useEffect(() => {
    const verifyPayment = async () => {
      const merchantOrderId = searchParams.get("merchantOrderId");
      const txnId = searchParams.get("txnId");
      const amount = searchParams.get("amount");

      console.log("🔹 Payment success page loaded with query params:", { merchantOrderId, txnId, amount });

      if (!merchantOrderId || !txnId || !amount) {
        setStatusMessage("Invalid payment data received.");
        console.error("❌ Missing query parameters");
        return;
      }

      try {
        console.log("🔹 Calling backend /payments/complete API");
        const response = await axios.post("http://localhost:5000/payments/complete", {
          userId,
          amount,
          merchantOrderId,
          phonePeTxnId: txnId,
        });

        console.log("✅ /payments/complete response:", response.data);
        setStatusMessage("✅ Payment successful!");
      } catch (error) {
        setStatusMessage("❌ Payment verification failed.");
        console.error("❌ /payments/complete failed:", error.response?.data || error.message);
      }
    };

    verifyPayment();
  }, [searchParams, userId]);

  return <h2>{statusMessage}</h2>;
};

export default PaymentSuccess;
