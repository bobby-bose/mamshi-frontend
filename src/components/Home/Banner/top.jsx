import React, { useState, useEffect } from 'react';
import client from '../../../api/client'; // axios instance

const CounterBanner = () => {
  const [vouchersLeft, setVouchersLeft] = useState(null); // initialize as null

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await client.get('/giveaway');
        console.log("Vouchers data:", response.data);

        if (response.data.success && response.data.seq !== undefined) {
          const seqValue = Math.ceil(response.data.seq);
          // Subtract seq from 50000 to get remaining vouchers
          setVouchersLeft(Math.max(0, 50000 - seqValue));
        }
      } catch (error) {
        console.error("Failed to fetch vouchers:", error);
        setVouchersLeft(50000); // fallback
      }
    };

    fetchVouchers(); // initial fetch
    const intervalId = setInterval(fetchVouchers, 5000); // refresh every 5s
    return () => clearInterval(intervalId);
  }, []);

  // If vouchersLeft is not yet loaded, render nothing or a loader
  if (vouchersLeft === null) return null;

  const formatNumber = (num) => String(Math.max(0, num)).padStart(5, '0');
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
