import { useEffect } from "react";
import client from "../../api/client";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const startPayment = async () => {
      const products = JSON.parse(sessionStorage.getItem("products"));
      const deliveryDetails = JSON.parse(sessionStorage.getItem("deliveryDetails"));
      const totalPrice = JSON.parse(sessionStorage.getItem("totalPrice"));
      
  if(!products || !deliveryDetails || !totalPrice){
    console.log("The following details are missing any of these");
  }
const productId = products[0].productId;
const size= products[0].size;
const color= products[0].color;
const count= products[0].count;
const mobileNumber = sessionStorage.getItem("mobileNumber");


console.log("👉 ProductId:", productId);
console.log("👉 Delivery Details:", deliveryDetails);
console.log("👉 Total Price:", totalPrice);


      const userId = "user_" + Math.floor(Math.random() * 1000000);
      const amount = totalPrice;
      const useremail = mobileNumber;

      sessionStorage.setItem("userId", userId);
      sessionStorage.setItem("amount", amount);
await new Promise((resolve) => setTimeout(resolve, 13000));
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
         
        }

        console.error("Payment start response:", response.data);
      await new Promise((resolve) => setTimeout(resolve, 13000));



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
