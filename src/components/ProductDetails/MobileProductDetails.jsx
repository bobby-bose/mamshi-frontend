import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  clearErrors,
  getProductDetails,
  getSimilarProducts,
  newReview,
} from "../../actions/productAction";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../actions/wishlistAction";
import { NEW_REVIEW_RESET } from "../../constants/productConstants";
import { getDeliveryDate, getDiscount } from "../../utils/functions";
import Loader from "../Layouts/Loader";
import MetaData from "../Layouts/MetaData";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import client from "../../api/client";
import MobileProductDetailsSub from "./MobileProductDetailsSub";
import CounterBanner from "../Home/Banner/top";

const MobileProductDetails = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const productId = id;
  const navigate = useNavigate();
  const [size, setSize] = useState("");
  const mobileNumber = sessionStorage.getItem("mobileNumber");
  const [availableSizes, setAvailableSizes] = useState([]);
  const [data, setData] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  const { success, error: reviewError } = useSelector(
    (state) => state.newReview
  );
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const itemInWishlist = wishlistItems.some((i) => i.product === productId);
  const itemInCart = cartItems.some((i) => i.product === productId);

  // Check if the device is mobile
  const [isMobile, setIsMobile] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allImages = data ? [data.main, data.sub] : [];

  const addToCartHandler = async () => {
    if (!size) {
      enqueueSnackbar("⚠️ Please select a size before adding to cart", {
        variant: "warning",
      });
      return;
    }
    try {
      await client.post(`/wishlist/${id}/${mobileNumber}`, { size });
      enqueueSnackbar("✅ Product Added To Cart", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("❌ Failed to add product to cart", { variant: "error" });
    }
  };

  const buyNow = async () => {
  if (!size) {
    enqueueSnackbar("⚠️ Please select a size before proceeding to checkout", {
      variant: "warning",
    });
    return; // stop if no size selected
  }
var totalPrice= data.Price * quantity;
  try {
    // First, add product to cart/order DB
    await client.post("/orders/productId/mobilenumber", {
      productId: id,
      mobileNumber,
      size,
      quantity,
    
    });

    sessionStorage.setItem("totalPrice", totalPrice);

    // Now navigate to checkout with total price
    navigate("/checkout", {
    
    });
  } catch (error) {
    enqueueSnackbar("❌ Failed to place order", { variant: "error" });
  }
};


  const toggleWishlist = () => {
    if (itemInWishlist) {
      dispatch(removeFromWishlist(productId));
      enqueueSnackbar("Removed from Wishlist", { variant: "info" });
    } else {
      dispatch(addToWishlist(productId));
      enqueueSnackbar("Added to Wishlist", { variant: "success" });
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await client.get(`/product/${productId}`);
        const productData = response.data.productDetails;
        setData(productData);
        const sizes = [];
        if (productData.XS) sizes.push("XS");
        if (productData.S) sizes.push("S");
        if (productData.M) sizes.push("M");
        if (productData.L) sizes.push("L");
        if (productData.XL) sizes.push("XL");
        if (productData.XXL) sizes.push("XXL");
        if (productData.thxL) sizes.push("3XL");
        if (productData.foxL) sizes.push("4XL");
        if (productData.fixL) sizes.push("5XL");
        if (productData.sixL) sizes.push("6XL");
        if (productData.sexL) sizes.push("7XL");
        setAvailableSizes(sizes);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();

    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }
    if (reviewError) {
      enqueueSnackbar(reviewError, { variant: "error" });
      dispatch(clearErrors());
    }
    if (success) {
      enqueueSnackbar("Review Submitted Successfully", { variant: "success" });
      dispatch({ type: NEW_REVIEW_RESET });
    }
  }, [dispatch, productId, error, reviewError, success, enqueueSnackbar]);

  useEffect(() => {
    if (data?.category) {
      dispatch(getSimilarProducts(data.category));
    }
  }, [dispatch, data?.category]);

  const clearSelection = () => {
    setSize("");
  };

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) return <Loader />;

  return (
    <>

    <div className="p-4 bg-gray-50 font-sans w-full">
      <MetaData title={data.Name} />
      <div className="max-w-8xl mx-auto bg-white rounded-3xl shadow-xl p-6 md:p-10 my-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image Section */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            {isMobile ? (
              <div className="w-full">
                <Carousel
                  showArrows={false}
                  showStatus={false}
                  showThumbs={false}
                  infiniteLoop={true}
                  autoPlay={false}
                >
                  {allImages.map((img, index) => (
                    <div key={index}>
                      <img
                        src={img}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-auto object-cover rounded-3xl"
                      />
                    </div>
                  ))}
                </Carousel>
              </div>
            ) : (
              <div className="flex w-full gap-4">
                <div className="w-1/4 flex flex-col gap-2">
                  {allImages.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-full h-auto object-cover rounded-xl cursor-pointer ${
                        currentImageIndex === index
                          ? "border-2 border-black"
                          : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
                <div className="w-3/4">
                  <img
                    src={allImages[currentImageIndex]}
                    alt={`Product view ${currentImageIndex + 1}`}
                    className="w-full h-auto object-cover rounded-3xl"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="w-full md:w-1/2 relative">
            <button
              onClick={toggleWishlist}
              className={`absolute top-0 right-0 p-2 rounded-full shadow ${
                itemInWishlist ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Absolutely Sober Oversized Tee
            </h1>

            {/* Price & Reviews */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-gray-500 line-through text-lg">
                ₹{data.Price?.toLocaleString()}
              </span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{data.Price?.toLocaleString()}
              </span>
              <span className="text-yellow-400 ml-4">★ ★ ★ ★ ☆</span>
              <span className="ml-2 text-gray-500">(0 reviews)</span>
            </div>

            <p className="flex items-center text-gray-600 text-sm mb-6">
              <span className="mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              29 people are viewing this right now
            </p>

            {/* Color Selection */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-800 mb-2">
                Color: Beige
              </h4>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-[#C6A28C] cursor-pointer"></div>
                <div className="w-10 h-10 rounded-full bg-yellow-400 cursor-pointer"></div>
                <div className="w-10 h-10 rounded-full bg-orange-500 cursor-pointer"></div>
              </div>
            </div>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <h4 className="text-md font-semibold text-gray-800 mb-2">
                  Size: {size || "Choose a size"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      className={`border px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        size === s
                          ? "bg-black text-white"
                          : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                      }`}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-start text-sm text-gray-600 gap-2">
                  <button
                    className="flex items-center hover:underline"
                    onClick={clearSelection}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 mr-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Clear
                  </button>
                 
                </div>
              </div>
            )}

            {/* Quantity and Action Buttons */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <h4 className="text-md font-semibold text-gray-800">
                  Quantity
                </h4>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    className="p-2 w-10 text-gray-600"
                    onClick={() => handleQuantityChange("decrement")}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="w-12 text-center text-gray-800 border-x border-gray-300 focus:outline-none"
                  />
                  <button
                    className="p-2 w-10 text-gray-600"
                    onClick={() => handleQuantityChange("increment")}
                  >
                    +
                  </button>
                </div>
                <button
                  className="flex-1 bg-white border border-gray-300 text-gray-900 font-semibold py-3 rounded-xl hover:bg-gray-100 transition-colors"
                  onClick={addToCartHandler}
                >
                  Add to cart
                </button>
              </div>

              <button
                className="w-full bg-gray-900 text-white font-semibold py-3 rounded-xl hover:bg-gray-800 transition-colors"
                onClick={buyNow}
              >
                Buy Now
              </button>
            </div>

            {/* Other Options and Delivery */}
          
          
            <div className="flex items-center gap-2 text-gray-600 text-sm mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18L18 8.25m-18 0l1.5-1.5m10.5 10.5L9.75 21"
                />
              </svg>
              <h4 className="font-semibold text-lg text-gray-800">
                Delivery By:
              </h4>
       <p className="text-gray-500 text-lg">{new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>
     <MobileProductDetailsSub  productId={productId} />
    </div>
  
  </>
  );
};

export default MobileProductDetails;