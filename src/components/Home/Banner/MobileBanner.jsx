import React, { useEffect, useState } from "react";
import axios from "axios";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import banner from '../../../assets/images/banner.png';
import client from "../../../api/client";
export const PreviousBtn = ({ className, onClick }) => (
  <div className={className} onClick={onClick}>
    <ArrowBackIosIcon />
  </div>
);

export const NextBtn = ({ className, onClick }) => (
  <div className={className} onClick={onClick}>
    <ArrowForwardIosIcon />
  </div>
);

export default function MobilePromoBanner() {
  const [usersCount, setUsersCount] = useState(0);

  // Function to fetch unique users count
  const fetchUsersCount = async () => {
    try {
      const res = await client.get("/wishlist"); // Replace with your API endpoint
      const wishlist = res.data || [];

      // Extract unique mobileNumbers
      const uniqueUsers = new Set(wishlist.map(item => item.mobileNumber));
      setUsersCount(uniqueUsers.size);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  useEffect(() => {
    fetchUsersCount();
    const interval = setInterval(fetchUsersCount, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full gap-4 p-2">
      {/* Left - Banner */}
      <div className="w-full md:w-[60%] flex justify-center items-center bg-gray-100 rounded-2xl shadow-lg p-2">
        <img
          src={banner}
          alt="Promo Banner"
          className="w-[90%] h-auto rounded-2xl shadow-md"
        />
      </div>

      {/* Right - Live Users Count */}
      <div className="w-full md:w-[40%] flex flex-col justify-center items-center bg-blue-900 text-white p-6 md:p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-2xl md:text-5xl font-bold mb-4">🔥 Hurry up!!!</h1>
        <p className="text-xl md:text-4xl">
          {usersCount} users have purchased till now 🚀
        </p>
      </div>
    </div>
  );
}
