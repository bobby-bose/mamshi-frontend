import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginRedirectPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login"); // Redirect after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      {/* Top Image */}
      <img
        src="assets/images/alert.png"
        alt="Login required"
        className="w-48 h-48 object-cover mb-6 rounded-lg shadow-lg"
      />

      {/* Message */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Please login first
        </h1>
        <p className="text-gray-600">
          You need to login before fetching products. Redirecting you shortly...
        </p>
      </div>
    </div>
  );
};

export default LoginRedirectPage;
