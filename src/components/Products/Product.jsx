import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Link } from 'react-router-dom';
import { getDiscount } from '../../utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../actions/wishlistAction';
import { useSnackbar } from 'notistack';

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

    return (
        <button className={buttonClasses} style={style} disabled={!isAvailable}>
            {size}
        </button>
    );
};

   
   const Product = ({ _id, Name, main, sub, Description,Price, S,M,L,XL }) => {
    console.log(_id, Name, main, sub, Description,Price, S,M,L,XL);
console.log("The name of the product is:", Name);
 const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { wishlistItems } = useSelector((state) => state.wishlist);

    const itemInWishlist = wishlistItems.some((i) => i.product === _id);

    const addToWishlistHandler = () => {
        if (itemInWishlist) {
            removeFromWishlist(_id);
            enqueueSnackbar("Remove From Wishlist", { variant: "success" });
        } else {
            addToWishlist(_id);
            enqueueSnackbar("Added To Wishlist", { variant: "success" });
        }
    }

    return (
        <div className="flex flex-col items-start gap-2 px-4 py-6 relative hover:shadow-lg rounded-sm"
        style={{
            width: "100%",
            height: "100%",
        marginTop: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgb(0, 0, 0, 0.1)",
            transition: "transform 0.2s ease-in-out",
            padding: "20px",
        }}>
            {/* */}
            <Link to={`/product/${_id}`} className="flex flex-col items-center text-center group">
                <div className="w-100 h-100 flex flex-row items-center tetx-center" >
                    {/* Use the 'main' property for the image source */}
                    <img draggable="false" className="object-contain" src={main} alt="" style={{
                        width: "130%",
                        height: "400px",
                        objectFit: "contain"
                    }} />
                     <img draggable="false" className="object-contain" src={sub} alt="" style={{
                        width: "130%",
                        height: "400px",
                        objectFit: "contain"
                    }} />
                </div>
                <h1 className=" mt-4 group-hover:text-primary-blue text-left">{Name.length > 85 ? `${Name.substring(0, 85)}...` : Name}</h1>
            <h2 className=" text-left">{Description }</h2>
            </Link>
            {/* */}

            {/* */}
            <div className="flex flex-col gap-2 items-start">
                <div className="flex items-center gap-1.5 text-md font-medium items-center tetx-center">
                    <span>₹{Price?.toLocaleString() || 0}</span>
                    <span className="text-stone line-through text-xs">₹{Price?.toLocaleString() || 0}</span>
                    <span className="text-xs text-primary-green">{getDiscount(Price, Price) || 0}%&nbsp;off</span>
                </div>
                {/* */}
            </div>
 <div className="flex gap-2 mt-2">
                    {S && <SizeButton size='S' isAvailable={S} color='white' bgColor='rgba(255, 5, 5, 1)' />}
                    {M && <SizeButton size='M' isAvailable={M} color='white' bgColor='rgba(19, 88, 50, 1)' />}
                    {L && <SizeButton size='L' isAvailable={L} color='white' bgColor='rgba(0, 0, 0, 1)' />}
                    {XL && <SizeButton size='XL' isAvailable={XL} color='white' bgColor='rgba(50, 13, 197, 1)' />}
                </div>
            <span onClick={addToWishlistHandler} className={`${itemInWishlist ? "text-red-500" : "hover:text-red-500 text-darkGray-300"} absolute top-6 right-6 cursor-pointer items-center tetx-center`} ><FavoriteIcon sx={{ fontSize: "18px" }} /></span>
       
            <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300">
                <Link to={`/product/${_id}`} className="text-white">View Details</Link>
            </button>
        </div>
    );
};

export default Product;
