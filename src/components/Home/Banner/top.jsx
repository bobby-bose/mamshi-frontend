import React, { useState, useEffect } from 'react';
import client from '../../../api/client';

const CounterBanner = () => {
  const [vouchersLeft, setVouchersLeft] = useState(50000);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await client.get('/orders');
        console.log("Vouchers data:", response.data);

        // ✅ Use backend value directly
        if (response.data.vouchersLeft !== undefined) {
          setVouchersLeft(response.data.vouchersLeft);
        } else {
          setVouchersLeft(50000); // fallback if backend fails
        }

      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
        setVouchersLeft(50000);
      }
    };

    fetchVouchers(); // fetch immediately
    const intervalId = setInterval(fetchVouchers, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const formatNumber = (num) => {
    return String(Math.max(0, num)).padStart(5, '0');
  };

  const formattedVouchers = formatNumber(vouchersLeft);

  return (
    <div className="bg-darkGray text-white py-2 px-4 flex justify-center items-center font-sans">
      <div className="flex items-center text-sm sm:text-base">
        <p className="mr-2 sm:mr-4">Our first 50000th milestone giveaway. Only</p>
        <div className="flex">
          {formattedVouchers.split("").map((digit, idx) => (
            <div key={idx} className="bg-yellow-400 w-5 h-5 sm:w-6 sm:h-6 relative">
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-black font-bold">
                {digit}
              </span>
            </div>
          ))}
        </div>
        <p className="ml-2 sm:ml-4">Vouchers left. Grab yours before they're gone!</p>
      </div>
    </div>
  );
};

export default CounterBanner;
