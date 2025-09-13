import { useEffect } from "react";
import client from "../../api/client";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const startPayment = async () => {
      const pendingOrder = JSON.parse(sessionStorage.getItem("pendingOrder"));
      if (!pendingOrder) {
        alert("No order info found");
        navigate("/");
        return;
      }

      const { productId, size, color, count, deliveryDetails, mobileNumber } = pendingOrder;
      const userId = "user_" + Math.floor(Math.random() * 1000000);
      const amount = pendingOrder.count * pendingOrder.Price || 100; // fallback
      const useremail = mobileNumber;

      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("amount", amount);

      try {
        const response = await client.post("/payments/start", {
          userId,
          amount,
          useremail,
          deliveryDetails,
          products: [{ productId, size, color, count }]
        });

        if (response.data.merchantOrderId) {
          sessionStorage.setItem("merchantOrderId", response.data.merchantOrderId);
          sessionStorage.setItem("pendingOrder", JSON.stringify({
            ...pendingOrder,
            merchantOrderId: response.data.merchantOrderId
          }));
        }

        const paymentUrl = response.data.paymentUrl;
        if (paymentUrl) window.location.href = paymentUrl;
        else console.error("Payment URL missing");

      } catch (err) {
        console.error("Payment start failed:", err.response?.data || err.message);
      }
    };

    startPayment();
  }, [navigate]);

  return <h2>Redirecting to payment...</h2>;
};

export default PaymentPage;
