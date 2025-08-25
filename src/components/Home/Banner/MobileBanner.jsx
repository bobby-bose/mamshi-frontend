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
    <div className="p-2 justify-center items-center">
      {/* Left - Banner */}
      <div className="w-full bg-gray-100 rounded-2xl shadow-lg p-2">
        <img
          src={banner}
          alt="Promo Banner"
          className=" h-auto rounded-2xl shadow-md"
        />
      </div>

    </div>
  );
}
