import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Layouts/Loader";
import MetaData from "../Layouts/MetaData";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import client from "../../api/client";
import MobileProductDetailsSub from "./MobileProductDetailsSub";
import { BACKEND_URL } from "../../constant.js";
import DeliveryDetailsModal from "./DeliveryDetails";

const colorMap = {
  Black: "#000000",
  White: "#FFFFFF",
  Blue: "#1E90FF",
  "Dark Green": "#006400",
  Cream: "#FFFDD0",
  Red: "#FF0000",
  Maroon: "#800000",
  "Mustard Yellow": "#FFDB58",
  Beige: "#F5F5DC",
  SkyBlue: "#87CEEB",
  Olive: "#808000",
  "Black & White Stripes":
    "repeating-linear-gradient(45deg, #000 0 5%, #fff 5% 10%)",
  "Blue & White Stripes":
    "repeating-linear-gradient(45deg, #1E90FF 0 5%, #fff 5% 10%)",
  "Mustard Yellow & White Stripes":
    "repeating-linear-gradient(45deg, #FFDB58 0 5%, #fff 5% 10%)",
  "Maroon/Burgundy & White Stripes":
    "repeating-linear-gradient(45deg, #800000 0 5%, #fff 5% 10%)",
};

const MobileProductDetails = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({});
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [availableSizes, setAvailableSizes] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({});
  const [pendingAction, setPendingAction] = useState(null); // "cart" or "buy"

  const mobileNumber = sessionStorage.getItem("mobileNumber");

if (!mobileNumber) {
  // mobileNumber is null, undefined, or empty
  window.location.href = "/LoginRedirectPage"; // or your login page route
}


  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const itemInWishlist = wishlistItems.some((i) => i.product === id);

  const allImages = data
    ? [data.main, data.sub].filter(Boolean).map((p) => `${BACKEND_URL}${p}`)
    : [];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await client.get(`/product/${id}`);
      const productData = response.data.productDetails;
      setData(productData);

      // Extract available sizes
      const sizes = [];
      ["XS", "S", "M", "L", "XL", "XXL", "thxL", "foxL", "fixL", "sixL", "sexL"].forEach(
        (s) =>
          productData[s] &&
          sizes.push(
            s === "thxL"
              ? "3XL"
              : s === "foxL"
              ? "4XL"
              : s === "fixL"
              ? "5XL"
              : s === "sixL"
              ? "6XL"
              : s === "sexL"
              ? "7XL"
              : s
          )
      );
      setAvailableSizes(sizes);
    } catch (err) {
      console.error(err);
      enqueueSnackbar("Failed to load product details", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const toggleWishlist = () => {
    if (itemInWishlist) {
      enqueueSnackbar("Removed from Wishlist", { variant: "info" });
    } else {
      enqueueSnackbar("Added to Wishlist", { variant: "success" });
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increment") setQuantity((prev) => prev + 1);
    else if (type === "decrement" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const clearSelection = () => {
    setSize("");
    setColor("");
  };

  const handleAddToCartClick = () => {
    if (!size) {
      enqueueSnackbar("⚠️ Please select a size", { variant: "warning" });
      return;
    }
    if (data.colors?.length > 0 && !color) {
      enqueueSnackbar("⚠️ Please select a color", { variant: "warning" });
      return;
    }
    setPendingAction("cart");
    setIsModalOpen(true);
  };

  const handleBuyNowClick = () => {
    if (!size) {
      enqueueSnackbar("⚠️ Please select a size", { variant: "warning" });
      return;
    }
    if (data.colors?.length > 0 && !color) {
      enqueueSnackbar("⚠️ Please select a color", { variant: "warning" });
      return;
    }
    setPendingAction("buy");
    setIsModalOpen(true);
  };



const handleModalSubmit =async (deliveryDetails) => {
  setDeliveryInfo(deliveryDetails);
  setIsModalOpen(false);

  const productItem = {
    productId: id,
    size,
    color: color || null,
    count: quantity,
  };

  // Save products array + delivery details in sessionStorage
  sessionStorage.setItem("products", JSON.stringify([productItem]));
  sessionStorage.setItem("deliveryDetails", JSON.stringify(deliveryDetails));

  const totalPrice = data.Price * quantity;
  sessionStorage.setItem("totalPrice", totalPrice);

  console.log("✅ Saved to sessionStorage:", {
    products: [productItem],
    deliveryDetails,
    totalPrice,
  });
console.log("products", JSON.stringify([productItem]));
 
  navigate("/payment"); // uncomment when ready
};



 

  if (!data.Name) return <Loader />;

  return (
    <div className="p-4 bg-gray-50 font-sans w-full">
      <MetaData title={data.Name} />
      <div className="max-w-8xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10 my-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Images */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            {isMobile ? (
              <Carousel showArrows={false} showStatus={false} showThumbs={false} infiniteLoop autoPlay={false}>
                {allImages.map((img, index) => (
                  <div key={index}>
                    <img src={img} alt={`Product image ${index + 1}`} className="w-full h-auto object-cover rounded-3xl" />
                  </div>
                ))}
              </Carousel>
            ) : (
              <div className="flex w-full gap-4">
                <div className="w-1/4 flex flex-col gap-2">
                  {allImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-full h-auto object-cover rounded-xl cursor-pointer ${
                        currentImageIndex === index ? "border-2 border-black" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
                <div className="w-3/4">
                  <img src={allImages[currentImageIndex]} alt={`Product view ${currentImageIndex + 1}`} className="w-full h-auto object-cover rounded-3xl" />
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 relative">
            <button
              onClick={toggleWishlist}
              className={`absolute top-0 right-0 p-2 rounded-full shadow ${
                itemInWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
            >
              ❤️
            </button>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{data.Name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-500 line-through text-lg">₹{data.Price?.toLocaleString()}</span>
              <span className="text-2xl font-bold text-gray-900">₹{data.Price?.toLocaleString()}</span>
            </div>

            {data.colors?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Color: {color || "Choose a color"}</h4>
                <div className="flex gap-3 flex-wrap">
                  {data.colors.map((c) => (
                    <div
                      key={c}
                      className={`w-10 h-10 rounded-full border-2 cursor-pointer ${
                        color === c ? "border-black" : "border-gray-300"
                      }`}
                      style={{ background: colorMap[c] || "#ccc" }}
                      onClick={() => setColor(c)}
                    ></div>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Size: {size || "Choose a size"}</h4>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      className={`border px-4 py-2 rounded-lg text-sm font-medium ${
                        size === s ? "bg-black text-white" : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <button className="flex items-center hover:underline" onClick={clearSelection}>
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* Quantity & Actions */}
            <div className="flex flex-col gap-4">
              <div
                className={`w-full px-4 py-2 rounded-full text-white font-semibold mb-2 flex justify-center items-center text-lg ${
                  data.stock > 0 ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {data.stock > 0 ? "STOCK AVAILABLE" : "OUT OF STOCK"}
              </div>

              <div className="flex items-center gap-4">
                <h4 className="text-md font-semibold text-gray-800">Quantity</h4>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button className="p-2 w-10 text-gray-600" onClick={() => handleQuantityChange("decrement")} disabled={data.stock === 0}>
                    -
                  </button>
                  <input type="text" value={quantity} readOnly className="w-12 text-center text-gray-800 border-x border-gray-300 focus:outline-none" />
                  <button className="p-2 w-10 text-gray-600" onClick={() => handleQuantityChange("increment")} disabled={data.stock === 0}>
                    +
                  </button>
                </div>

                <button className="flex-1 bg-white border border-gray-300 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors" onClick={handleAddToCartClick} disabled={data.stock === 0}>
                  Add to cart
                </button>
              </div>

              <button className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors" onClick={handleBuyNowClick} disabled={data.stock === 0}>
                Buy Now
              </button>
            </div>

            <DeliveryDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} initialData={deliveryInfo} />
          </div>
        </div>
      </div>
      <MobileProductDetailsSub productId={id} />
    </div>
  );
};

export default MobileProductDetails;
