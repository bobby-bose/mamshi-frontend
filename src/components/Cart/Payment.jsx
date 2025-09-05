// PaymentPage.js
import { useEffect } from "react";
import axios from "axios";

const PaymentPage = () => {
  useEffect(() => {
    const startPayment = async () => {
      // Generate a random userId
      const userId = "user_" + Math.floor(Math.random() * 1000000);
      // Get amount from session storage
      const amount = 100;

      console.log("🔹 Initiating payment for user:", userId, "amount:", amount);

      if (!amount) {
        console.error("❌ Amount not found in session storage");
        return;
      }

      try {
        const response = await axios.post("https://mamshi-backend.onrender.com/api/v1/payments/start", { userId, amount });
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
  }, []);

  return <h2>Redirecting to payment...</h2>;
};

export default PaymentPage;
