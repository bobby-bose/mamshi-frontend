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
import {
  getDeliveryDate,
  getDiscount,
} from "../../utils/functions";
import Loader from "../Layouts/Loader";
import MetaData from "../Layouts/MetaData";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CachedIcon from "@mui/icons-material/Cached";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Button from "@mui/material/Button";
import client from "../../api/client";

const MobileProductDetails = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const productId = id;
  const navigate = useNavigate();
  const [size, setSize] = useState("");
  const mobileNumber = sessionStorage.getItem("mobileNumber");
  const [availableSizes, setAvailableSizes] = useState([]);

  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [data, setData] = useState({});

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

  // Handlers
  const addToCartHandler = async () => {
    if (!size) {
      enqueueSnackbar("⚠️ Please select a size before adding to cart", {
        variant: "warning",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "top", horizontal: "center" },
        style: {
          backgroundColor: "#ff9800",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          borderRadius: "8px",
        },
      });
      return;
    }
    try {
      // Pass the full size name to the backend
      await client.post(`/wishlist/${id}/${mobileNumber}`, { size });
      enqueueSnackbar("✅ Product Added To Cart", {
        variant: "success",
        autoHideDuration: 2500,
        anchorOrigin: { vertical: "top", horizontal: "center" },
        style: {
          backgroundColor: "#4caf50",
          color: "#fff",
          fontWeight: "bold",
          fontSize: "16px",
          borderRadius: "8px",
        },
      });
    } catch (error) {
      enqueueSnackbar("❌ Failed to add product to cart", { variant: "error" });
    }
  };

  const goToCart = () => navigate("/cart");

  const buyNow = () => {
    addToCartHandler();
    navigate("/cart");
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

  // Effects
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await client.get(`/product/${productId}`);
        const productData = response.data.productDetails;
        setData(productData);

        // Dynamically create the available sizes array with full names
        const sizes = [];
        if (productData.S) sizes.push("Small");
        if (productData.M) sizes.push("Medium");
        if (productData.L) sizes.push("Large");
        if (productData.XL) sizes.push("Extra Large");
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

  // Helper function to get color based on size (using full names)
  const getSizeColor = (s) => {
    switch (s.toLowerCase()) {
      case "small":
        return "#ad1d13ff"; // Red
      case "medium":
        return "#125f15ff"; // Green
      case "large":
        return "#154267ff"; // Blue
      case "extra large":
        return "#342019ff"; // Brown
      default:
        return "#c3259bff"; // Default to black or another neutral color
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <MetaData title={data.Name} />
      <main className="mt-12 sm:mt-0">
        <div className="w-full flex flex-col sm:flex-row bg-white p-4 rounded-lg shadow-md">
          {/* Left Section - Images */}
          <div className="w-full sm:w-1/2 flex flex-col items-center">
            <div className="flex gap-3">
              <img
                draggable="false"
                className="w-1/2 object-contain"
                src={data.main}
                alt={data.Name}
                style={{ height: "400px" }}
              />
              <img
                draggable="false"
                className="w-1/2 object-contain"
                src={data.sub}
                alt={data.Name}
                style={{ height: "400px" }}
              />
            </div>
            <button
              onClick={toggleWishlist}
              className={`mt-4 p-2 rounded-full shadow ${
                itemInWishlist ? "text-red-500" : "text-darkGray-400 hover:text-red-500"
              }`}
            >
              <FavoriteIcon />
            </button>
          </div>

          {/* Right Section - Details */}
          <div className="flex-1 py-2 px-4">
            <h2 className="text-3xl font-semibold text-stone tracking-wide mb-2">
              {data.Name}
            </h2>
            <p className="text-md text-darkGray-700 mb-3">{data.Description}</p>

            {/* Price */}
            <span className="text-primary-green text-sm font-medium">
              Special Price
            </span>
            <div className="flex items-baseline gap-2 text-3xl font-medium mb-2">
              <span className="text-stone">
                ₹{data.Price?.toLocaleString()}
              </span>
              {data.Price && (
                <>
                  <span className="text-base text-stone line-through">
                    ₹{data.Price?.toLocaleString()}
                  </span>
                  <span className="text-base text-primary-green">
                    {getDiscount(data.Price, data.Price)}% off
                  </span>
                </>
              )}
            </div>

            {/* Size Options (Dynamic) */}
            {availableSizes.length > 0 && (
              <div className="mt-4 flex gap-4" 
              style={{flexDirection: "column"}}>
                {availableSizes.map((s) => (
                  <Button
                    key={s}
                    variant={size === s ? "contained" : "outlined"}
                    onClick={() => setSize(s)}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      borderWidth: "3px",
                      fontSize: "20px",
                      fontWeight: "bold",
                      borderColor: getSizeColor(s),
                      color: size === s ? "white" : getSizeColor(s),
                      backgroundColor: size === s ? getSizeColor(s) : "transparent",
                      "&:hover": {
                        backgroundColor: getSizeColor(s),
                        color: "white",
                        opacity: 0.8,
                      },
                    }}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            )}

            {/* Stock + Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={addToCartHandler}
                className="p-4 w-full flex items-center justify-center gap-2 text-white bg-blue-800 rounded shadow hover:shadow-lg"
              >
                <ShoppingCartIcon />
                ADD TO CART
              </button>
            </div>

            {/* Delivery */}
            <div className="flex gap-16 mt-4 text-sm font-medium">
              <p className="text-stone">Delivery</p>
              <span>Delivery by {getDeliveryDate()}</span>
            </div>

            {/* Services */}
            <div className="flex gap-16 mt-4 items-start text-sm">
              <p className="text-stone font-medium">Services</p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-2">
                  <VerifiedUserIcon className="text-blue-500" fontSize="small" />
                  {data.warranty} Year Warranty
                </li>
                <li className="flex items-center gap-2">
                  <CachedIcon className="text-blue-500" fontSize="small" />
                  7 Days Replacement Policy
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MobileProductDetails;