import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { clearErrors, getProductDetails, getSimilarProducts, newReview } from '../../actions/productAction';
import { NextBtn, PreviousBtn } from '../Home/Banner/Banner';
import ProductSlider from '../Home/ProductSlider/ProductSlider';
import Loader from '../Layouts/Loader';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CachedIcon from '@mui/icons-material/Cached';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import { addItemsToCart } from '../../actions/cartAction';
import { getDeliveryDate, getDiscount } from '../../utils/functions';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistAction';
import MinCategory from '../Layouts/MinCategory';
import MetaData from '../Layouts/MetaData';
import HOST from '../../constants/constant';
import PORT from '../../constants/constant';  
const ProductDetails = () => {


    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const navigate = useNavigate();
    const mobileNumber = sessionStorage.getItem('mobileNumber');

    // reviews toggle
    const [open, setOpen] = useState(false);
    const [viewAll, setViewAll] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const { product, loading, error } = useSelector((state) => state.productDetails);
    const { success, error: reviewError } = useSelector((state) => state.newReview);
    const { cartItems } = useSelector((state) => state.cart);
    const { wishlistItems } = useSelector((state) => state.wishlist);

    const settings = {
        autoplay: true,
        autoplaySpeed: 2000,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <PreviousBtn />,
        nextArrow: <NextBtn />,
    };

    const SizeButton = ({ size, isAvailable, color, bgColor }) => {
        // Determine the class names based on availability
        const buttonClasses = `
            px-2 py-1 border rounded-md text-xs font-semibold
            ${isAvailable
                ? 'cursor-pointer'
                : 'cursor-not-allowed opacity-50'}
        `;

        const style = {
            fontSize: '25px',
            padding: '10px 20px',
            color: isAvailable ? color : 'rgb(107, 114, 128)', // Tailwind's gray-500 for disabled
            backgroundColor: isAvailable ? bgColor : 'rgb(243, 244, 246)', // Tailwind's gray-100 for disabled
        };
         }
        const productId = params._id;
        console.log("Product ID:", productId);
        const itemInWishlist = wishlistItems.some((i) => i.product === productId);

   


        const addToCartHandler = () => {
            dispatch(addItemsToCart(productId,mobileNumber));
            enqueueSnackbar("Product Added To Cart", { variant: "success" });
        }

        const handleDialogClose = () => {
            setOpen(!open);
        }

        const itemInCart = cartItems.some((i) => i.product === productId);

        const goToCart = () => {
            navigate('/cart');
        }

        const buyNow = () => {
            addToCartHandler();
            navigate('/cart');
        }

        useEffect(() => {
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
            dispatch(getProductDetails(productId));
            // eslint-disable-next-line
        }, [dispatch, productId, error, reviewError, success, enqueueSnackbar]);

        useEffect(() => {
            dispatch(getSimilarProducts(product?.category));
        }, [dispatch, product, product.category]);

        return (
                  <div style={{ padding: "60px" }}>
                        <MetaData title={product.Name} />
                    
                        <main className="mt-12 sm:mt-0">

                            {/* */}
                            <div className="w-full flex flex-col sm:flex-row bg-white sm:p-2 relative">

                                {/* */}
                                <div className="w-full ">
                                    {/* */}
                                    <div className="flex flex-col gap-3 m-3">
                                        <div className="w-full h-full pb-6 relative"
                                            // add flex styling with column and center
                                            style={{
                                                display: "flex",
                                                flexDirection: "row",
                                            }}
                                        >
                                            <img draggable="false" className="w-full object-contain" src={product.main} alt={product.Name}
                                                // add custom responisve height
                                                style={{ height: "400px", objectFit: "contain" }} />
                                            <img draggable="false" className="w-full object-contain" src={product.sub} alt={product.Name}
                                                // add custom responisve height
                                                style={{ height: "400px", objectFit: "contain" }} />

                                            {/* <div className="absolute top-4 right-4 shadow-lg bg-white w-9 h-9 border flex items-center justify-center rounded-full">
                                                <span onClick={addToWishlistHandler} className={`${itemInWishlist ? "text-red-500" : "hover:text-red-500 text-darkGray-300"} cursor-pointer`}><FavoriteIcon sx={{ fontSize: "18px" }} /></span>
                                            </div> */}
                                        </div>

                                        {/* <div className="w-full flex gap-3">
                                            {/* */}
                                            {/* {product.stock > 0 && (
                                                <button onClick={itemInCart ? goToCart : addToCartHandler} className="p-4 w-1/2 flex items-center justify-center gap-2 text-white bg-primary-yellow rounded-sm shadow hover:shadow-lg">
                                                    <ShoppingCartIcon />
                                                    {itemInCart ? "GO TO CART" : "ADD TO CART"}
                                                </button>
                                            )}
                                            <button onClick={buyNow} disabled={product.stock < 1 ? true : false} className={product.stock < 1 ? "p-4 w-full flex items-center justify-center gap-2 text-white bg-darkGray-600 cursor-not-allowed rounded-sm shadow hover:shadow-lg" : "p-4 w-1/2 flex items-center justify-center gap-2 text-white bg-primary-orange rounded-sm shadow hover:shadow-lg"}>
                                                <FlashOnIcon />
                                                {product.stock < 1 ? "OUT OF STOCK" : "BUY NOW"}
                                            </button> */}
                                            {/* */}
                                        </div>

                                    </div>
                                    {/* */}
                                </div>
                                {/* */}

                                {/* */}
                                <div className="flex-1 py-2 px-3">

                                    {/* */}
                                    <div className="flex flex-col gap-2 mb-4">

                                        <h2 className="text-3xl font-semibold text-stone tracking-wide"
                                            style={
                                                {
                                                    paddingLeft: "10px",
                                                }
                                            }>{product.Name}</h2>

                                        <p className="text-l font-semibold text-stone tracking-wide"
                                            style={{
                                                paddingLeft: "20px",
                                            }}
                                        >{product.Description}</p>

                                        {/* <div className="flex gap-2 mt-2">
                                            {S && <SizeButton size='S' isAvailable={product.S} color='white' bgColor='rgba(255, 5, 5, 1)' />}
                                            {M && <SizeButton size='M' isAvailable={product.M} color='white' bgColor='rgba(19, 88, 50, 1)' />}
                                            {L && <SizeButton size='L' isAvailable={product.L} color='white' bgColor='rgba(0, 0, 0, 1)' />}
                                            {XL && <SizeButton size='XL' isAvailable={product.XL} color='white' bgColor='rgba(50, 13, 197, 1)' />}
                                        </div>
                                        */}

                                        <span className="text-primary-green text-sm font-medium">Special Price</span>
                                        <div className="flex items-baseline gap-2 text-3xl font-medium">
                                            <span className="text-stone">₹{product.Price?.toLocaleString()}</span>
                                            <span className="text-base text-stone line-through">₹{product.Price?.toLocaleString()}</span>
                                            <span className="text-base text-primary-green">{getDiscount(product.Price, product.Price)}%&nbsp;off</span>
                                        </div>
                                        {/* {product.stock <= 10 && product.stock > 0 && (
                                            <span className="text-red-500 text-sm font-medium">Hurry, Only {product.stock} left!</span>
                                        )} */}
                                        {/* */}
                                        {/* add a button like Order now and on pressing it should send those detaisl tp the backend api
                                         */}
                                        <div className="flex gap-3 mt-4">
                                            {product.stock > 0 && (
                                                <button onClick={itemInCart ? goToCart : addToCartHandler} className="p-4 w-1/2 flex items-center justify-center gap-2 text-white bg-primary-yellow rounded-sm shadow hover:shadow-lg">
                                                    <ShoppingCartIcon />
                                                    {itemInCart ? "GO TO CART" : "ADD TO CART"}
                                                </button>
                                            )}
                                            <button onClick={buyNow} disabled={product.stock < 1 ? true : false} className={product.stock < 1 ? "p-4 w-full flex items-center justify-center gap-2 text-white bg-darkGray-600 cursor-not-allowed rounded-sm shadow hover:shadow-lg" : "p-4 w-1/2 flex items-center justify-center gap-2 text-white bg-primary-orange rounded-sm shadow hover:shadow-lg"}>
                                                <FlashOnIcon />
                                                {product.stock < 1 ? "OUT OF STOCK" : "BUY NOW"}
                                            </button>
</div>
                                        {/* */}
                                        <p className="text-md font-medium">Available offers</p>
                                        {Array(3).fill("").map((el, i) => (
                                            <p className="text-sm flex items-center gap-1" key={i}>
                                                <span className="text-primary-lightGreen"><LocalOfferIcon sx={{ fontSize: "20px" }} /></span>
                                                <span className="font-medium ml-2">Bank Offer</span> 15% Instant discount on first Slouch Pay Later order of 500 and above <Link className="text-primary-blue font-medium" to="/">T&C</Link>
                                            </p>
                                        ))}
                                        {/* */}


                                        {/* */}

                                        {/* */}
                                        <div className="flex gap-16 mt-4 items-center text-sm font-medium">
                                            <p className="text-stone">Delivery</p>
                                            <span>Delivery by {getDeliveryDate()}</span>
                                        </div>
                                        {/* */}


                                        {/* */}

                                        {/* */}
                                        <div className="flex gap-16 mt-4 mr-6 items-stretch text-sm">
                                            <p className="text-stone font-medium">Services</p>
                                            <ul className="flex flex-col gap-2">
                                                <li>
                                                    <p className="flex items-center gap-3"><span className="text-primary-blue"><VerifiedUserIcon sx={{ fontSize: "18px" }} /></span> {product.warranty} Year</p>
                                                </li>
                                                <li>
                                                    <p className="flex items-center gap-3"><span className="text-primary-blue"><CachedIcon sx={{ fontSize: "18px" }} /></span> 7 Days Replacement Policy</p>
                                                </li>
                                                <li>
                                                    <p className="flex items-center gap-3"><span className="text-primary-blue"><CurrencyRupeeIcon sx={{ fontSize: "18px" }} /></span> Cash on Delivery available</p>
                                                </li>
                                            </ul>
                                        </div>
                                        {/* */}
                                    </div>


                                </div>


                      
                          

                        </main>
                    </div>
                )
   
    };

export default ProductDetails;