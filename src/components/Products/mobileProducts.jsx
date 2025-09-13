import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '@mui/material/Pagination';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Loader from '../Layouts/Loader';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MetaData from '../Layouts/MetaData';
import client from '../../api/client';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CounterBanner from '../Home/Banner/top';
import {BACKEND_URL} from "../../constant.js";



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
const MobileProducts = () => {
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const location = useLocation();

    const [initialProducts, setInitialProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [price, setPrice] = useState([0, 2000]);
    const [selectedSizes, setSelectedSizes] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [sizesToggle, setSizesToggle] = useState(true);

    const keyword = params.keyword;

    const priceHandler = (e, newPrice) => {
        setPrice(newPrice);
    };

    const handleSizeChange = (event) => {
        const { value, checked } = event.target;
        setSelectedSizes(prevSizes => {
            if (checked) {
                return [...prevSizes, value];
            } else {
                return prevSizes.filter(size => size !== value);
            }
        });
    };

   

    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await client.get(`/products`);
                const products = response.data.products;
                console.log("Fetched Products:", products);
                setInitialProducts(products);
             
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []);

    useEffect(() => {
        
    }, [price, selectedSizes]);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            setError(null);
        }
    }, [error, enqueueSnackbar]);

    // Image slider component for each product
    const ProductImageSlider = ({ images }) => {
        const [currentIndex, setCurrentIndex] = useState(0);

        const nextImage = () => {
            if (currentIndex < images.length - 1) setCurrentIndex(currentIndex + 1);
        };
        const prevImage = () => {
            if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
        };

        return (
            <div className="relative w-full h-64 sm:h-72 overflow-hidden rounded-md">
                <img
                    src={images[currentIndex]}
                    alt="product"
                    className="w-full h-full object-contain transition-all duration-500"
                />
                {currentIndex > 0 && (
                    <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 rounded-full p-1"
                    >
                        <ArrowBackIosNewIcon fontSize="small" />
                    </button>
                )}
                {currentIndex < images.length - 1 && (
                    <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 rounded-full p-1"
                    >
                        <ArrowForwardIosIcon fontSize="small" />
                    </button>
                )}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, idx) => (
                        <span
                            key={idx}
                            className={`w-2 h-2 rounded-full ${idx === currentIndex ? 'bg-gray-800' : 'bg-gray-400'}`}
                        />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <MetaData title="All Products" />
        
            <main className="w-full font-[Inter,sans-serif] text-stone sm:mt-0" style={{ marginTop: "100px" }}>
                <div className="flex flex-col sm:flex-row gap-3 mt-2 sm:mt-2 sm:mx-3 m-auto mb-7">

          

                    {/* Product List */}
                    <div className="flex-1">
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                {initialProducts?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center gap-3 bg-white shadow-sm rounded-sm p-6 sm:p-16">
                                        <img draggable="false" className="w-1/2 h-44 object-contain" src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/error-no-search-results_2353c5.png" alt="Search Not Found" />
                                        <h1 className="text-2xl font-medium">Sorry, no results found!</h1>
                                        <p className="text-xl text-center text-stone">Please check the spelling or try searching for something else</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4 justify-center items-start w-full bg-white p-2 sm:p-4">
                                        {initialProducts?.map((product) => (
                                            <div key={product._id} className="flex flex-col gap-2 p-2 border rounded-md">
                                              <ProductImageSlider 
  images={[
    product.main ? `${BACKEND_URL}${product.main}` : '/placeholder.png',
    product.sub ? `${BACKEND_URL}${product.sub}` : '/placeholder.png',
  ]} 
/>

                                                <div>
                                                    <h2 className="text-large font-large text-darkGray-700">{product.Name}</h2>
                                                    <p className="text-stone text-medium">₹{product.Price}</p>
                                                    <p className="text-medium text-stone ">{product.Description}</p>
                                                     
                 {/* Product details button with a nice hover eefect and light greyish transiitona nd slow animation woth grey , blur and slight dark red color */}

 <Link to={`/product/${product._id}`}>
 <button className="mt-2  
 text-white px-4 py-2 rounded-lg hover:bg-blue transition-colors duration-300"
 style={{
                                                    backgroundColor: 'rgba(23, 67, 114, 1)',
                                                    boxShadow: '0 2px 4px rgba(30, 26, 26, 0.1)',
                                                    transition: 'background-color 0.3s ease-in-out',
 }}>
                                                    View Details
                                                </button>
</Link>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
};

export default MobileProducts;
