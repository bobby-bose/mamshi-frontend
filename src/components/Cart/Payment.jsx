// PaymentPage.js
import { useEffect } from "react";
import axios from "axios";

const PaymentPage = ({ userId, amount }) => {
  useEffect(() => {
    const startPayment = async () => {
      console.log("🔹 Initiating payment for user:", userId, "amount:", amount);

      try {
        const response = await axios.post("http://localhost:5000/payments/start", { userId, amount });
        console.log("✅ Payment start response:", response.data);

        const paymentUrl = response.data.paymentUrl;
        if (paymentUrl) {
          console.log("🔹 Redirecting to PhonePe payment page:", paymentUrl);
          window.location.href = paymentUrl;
        } else {
          console.error("❌ Payment URL not found in response");
        }
      } catch (error) {
        console.error("❌ Payment initiation failed:", error.response?.data || error.message);
      }
    };

    startPayment();
  }, [userId, amount]);

  return <h2>Redirecting to payment...</h2>;
};

export default PaymentPage;
