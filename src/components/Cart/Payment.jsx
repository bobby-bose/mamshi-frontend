import { useEffect } from "react";
import client from "../../api/client";

const PaymentPage = () => {
  useEffect(() => {
    const startPayment = async () => {
      // Generate a random userId
      const userId = "user_" + Math.floor(Math.random() * 1000000);
      const amount = 100;
      const useremail = sessionStorage.getItem("mobileNumber");

      console.log("🔹 Initiating payment for user:", userId, "amount:", amount);

      // Save to sessionStorage so success page can read it
      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("amount", amount);

      try {
        const response = await client.post("/payments/start", { userId, amount , useremail });

        console.log("✅ Payment start response:", response.data);

        // Save merchantOrderId (required later)
        if (response.data.merchantOrderId) {
          sessionStorage.setItem("merchantOrderId", response.data.merchantOrderId);
        }

        // Optionally, if backend already returns phonePeTxnId (rare at this stage), save it
        if (response.data.phonePeTxnId) {
          sessionStorage.setItem("phonePeTxnId", response.data.phonePeTxnId);
        }

        // Redirect user to PhonePe page
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
