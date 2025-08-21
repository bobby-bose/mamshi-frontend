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
import { addItemsToCart } from "../../actions/cartAction";
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

// Icons
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CachedIcon from "@mui/icons-material/Cached";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";
import client from "../../api/client";

const MobileProductDetails = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
 const { id } = useParams(); 
 const productId = id; // Assuming the product ID is passed as a URL parameter
  const navigate = useNavigate();
  const mobileNumber = sessionStorage.getItem("mobileNumber");

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
   
  await client.post(`/wishlist/${id}/${mobileNumber}`, {
            
        }).then((response) => {
            console.log("Product added to wishlist:", response.data);
        }).catch((error) => {
            console.error("Error adding product to wishlist:", error);
        });
     enqueueSnackbar("Product Added To Cart", { variant: "success" });
    }

   




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
  console.log("Product ID:", productId);
  const fetchProduct = async () => {
    try {
      console.log("Fetching product details for ID:", productId);
      const response = await client.get(`/product/${productId}`);
      console.log("Product Details Data:", response.data);
console.log("API Raw:", response.data);

      // Your API returns { success: true, productDetails: {...} }
      setData(response.data.productDetails);
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
    if (product?.category) {
      dispatch(getSimilarProducts(data.category));
    }
  }, [dispatch, product?.category]);

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

            {/* Wishlist */}
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

            {/* Stock + Buttons */}
            <div className="flex gap-3 mt-4">
              {/* {data.stock > 0 && (
                <button
                  onClick={itemInCart ? goToCart : addToCartHandler}
                  className="p-4 w-1/2 flex items-center justify-center gap-2 text-white bg-yellow-500 rounded shadow hover:shadow-lg"
                >
                  <ShoppingCartIcon />
                  {itemInCart ? "GO TO CART" : "ADD TO CART"}
                </button>
              )} */}
             
                <button
                  onClick={ addToCartHandler}
                  className="p-4 w-full flex items-center justify-center gap-2 text-white bg-blue-800 rounded shadow hover:shadow-lg"
                >
                  <ShoppingCartIcon />
                  "ADD TO CART"
                </button>
           
           
             
            </div>

            {/* Offers */}
            <p className="text-md font-medium mt-4">Available offers</p>
            {Array(3)
              .fill("")
              .map((_, i) => (
                <p className="text-sm flex items-center gap-2" key={i}>
                  <LocalOfferIcon className="text-green-600" fontSize="small" />
                  <span className="font-medium">Bank Offer</span> 15% Instant
                  discount on first Slouch Pay Later order of 500 and above{" "}
                  <Link className="text-blue-500 font-medium" to="/">
                    T&C
                  </Link>
                </p>
              ))}

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
                <li className="flex items-center gap-2">
                  <CurrencyRupeeIcon className="text-blue-500" fontSize="small" />
                  Cash on Delivery available
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
