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
export default function PromoBanner() {
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
    // Fetch immediately on mount
    fetchUsersCount();

    // Fetch every second
    const interval = setInterval(fetchUsersCount, 1000);

    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <div className="flex w-full">
      {/* Left - Banner */}
      <div className="w-[60%] flex justify-center items-center bg-gray-100">
        <img 
          src={banner}
          alt="Promo Banner" 
          className="w-[90%] h-auto rounded-2xl shadow-lg"
        />
      </div>

      {/* Right - Live Users Count */}
      <div className="w-[40%] flex flex-col justify-center items-center bg-blue-900 text-white p-10
      // add border radius and shadow
      rounded-2xl shadow-lg">
        <h1 className="text-5xl font-bold mb-4">🔥 Hurry up!!!</h1>
        <p className="text-4xl">
          {usersCount} users have purchased till now 🚀
        </p>
      </div>
    </div>
  );
}
