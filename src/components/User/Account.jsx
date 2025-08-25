import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Link, useNavigate } from 'react-router-dom';
import MetaData from '../Layouts/MetaData';
import client from '../../api/client';

const Account = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "", // <-- we’ll use this to store _id
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    mobileNumber: "",
    address: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Fetch using mobileNumber (to find user) but save _id for updates
  const fetchUserDetails = async () => {
    const mobileNumber = sessionStorage.getItem("mobileNumber");
    if (!mobileNumber) {
      navigate("/login");
      return;
    }

    try {
      const res = await client.get(`/me/${mobileNumber}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("User Details:", res.data);

      const data = res.data;
      setFormData({
        id: data.user._id, // ✅ store id
        firstName: data.user.name.split(" ")[0],
        lastName: data.user.name.split(" ")[1] || "",
        gender: data.user.gender || "",
        mobileNumber: data.user.mobileNumber || "",
        email: data.user.email || "",
        address: data.user.address || "",
      });
      
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || err.message || "Unknown error";
      alert("❌ Failed to fetch user details: " + message);
    }
  };

  // ✅ Update using id instead of mobileNumber
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        ...formData,
        name: formData.firstName + " " + formData.lastName,
      };

      const res = await client.put(`/me/${formData.id}`, updatedData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        alert("✅ Profile updated successfully!");

        // update sessionStorage with new mobileNumber if changed
        sessionStorage.setItem("mobileNumber", formData.mobileNumber);
      } else {
        alert("❌ Error: " + res.data.message);
      }

    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || err.message || "Unknown error";
      alert("❌ Failed to update profile: " + message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <>
      <MetaData title="My Profile" />
      <main className="w-full mt-12 sm:mt-0 px-4 sm:px-0" style={{ paddingTop: "60px" }}>
        <div className="flex flex-col sm:flex-row gap-3.5 sm:w-11/12 sm:mt-4 m-auto mb-7">
          <Sidebar activeTab={"profile"} />

          <div className="flex-1 overflow-hidden shadow bg-white">
            <div className="flex flex-col gap-12 m-4 sm:mx-8 sm:my-6">
              {/* Personal Info */}
              <div className="flex flex-col gap-5 items-start">
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full" id="personalInputs">
                  <div className="flex flex-col gap-0.5 flex-1 min-w-[200px] px-3 py-1.5 rounded-sm border inputs bg-gray-100 focus-within:border-primary-blue">
                    <label className="text-xs text-stone">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      name="firstName"
                      onChange={handleChange}
                      className="text-sm outline-none border-none text-stone"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-[200px] px-3 py-1.5 rounded-sm border inputs bg-gray-100 focus-within:border-primary-blue">
                    <label className="text-xs text-stone">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      name="lastName"
                      onChange={handleChange}
                      className="text-sm outline-none border-none text-stone"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-2 w-full">
                  <h2 className="text-sm">Your Gender</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8" id="radioInput">
                    <div className="flex items-center gap-4 inputs text-stone">
                      <input
                        type="radio"
                        name="gender"
                        value="male"
                        checked={formData.gender === "male"}
                        onChange={handleChange}
                        id="male"
                        className="h-4 w-4"
                      />
                      <label htmlFor="male">Male</label>
                    </div>
                    <div className="flex items-center gap-4 inputs text-stone">
                      <input
                        type="radio"
                        name="gender"
                        value="female"
                        checked={formData.gender === "female"}
                        onChange={handleChange}
                        id="female"
                        className="h-4 w-4"
                      />
                      <label htmlFor="female">Female</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col gap-5 items-start w-full">
                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 w-full">
                  {/* Mobile */}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-[200px] px-3 py-1.5 rounded-sm border bg-gray-100 focus-within:border-primary-blue">
                    <label className="text-xs text-stone">Mobile Number</label>
                    <input
                      type="tel"
                      value={formData.mobileNumber}
                      name="mobileNumber"
                      onChange={handleChange}
                      className="text-sm outline-none border-none text-stone"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-[200px] px-3 py-1.5 rounded-sm border bg-gray-100 focus-within:border-primary-blue">
                    <label className="text-xs text-stone">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      name="email"
                      onChange={handleChange}
                      className="text-sm outline-none border-none text-stone"
                    />
                  </div>

                  {/* Address */}
                  <div className="flex flex-col gap-0.5 flex-1 min-w-[200px] px-3 py-1.5 rounded-sm border bg-gray-100 focus-within:border-primary-blue">
                    <label className="text-xs text-stone">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      name="address"
                      onChange={handleChange}
                      className="text-sm outline-none border-none text-stone"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className="text-white py-2 px-4 bg-primary-orange rounded-sm font-medium mt-2 sm:mt-4"
                >
                  Update Profile
                </button>
              </div>

              {/* FAQs */}
              <div className="flex flex-col gap-4 mt-4">
                <span className="font-medium text-lg mb-2">FAQS</span>
                {/* ... same FAQ content ... */}
              </div>

              {/* Deactivate */}
              <Link className="text-sm text-primary-blue font-medium mt-4 inline-block" to="/">Deactivate Account</Link>
            </div>

            <img
              draggable="false"
              className="w-full object-contain"
              src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/myProfileFooter_4e9fe2.png"
              alt="footer"
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Account;
