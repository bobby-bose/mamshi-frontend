import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '@mui/material/Pagination';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Loader from '../Layouts/Loader';
import Product from './Product';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MetaData from '../Layouts/MetaData';
import client from '../../api/client';
const Products = () => {
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const location = useLocation();

    // State for products and loading
    const [initialProducts, setInitialProducts] = useState([]); // All products fetched once
    const [filteredProducts, setFilteredProducts] = useState([]); // Products to be displayed
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [price, setPrice] = useState([0, 200000]);
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

    const clearFilters = () => {
        setPrice([0, 200000]);
        setSelectedSizes([]);
    };

    // New function to filter products based on the current state
    const applyFilters = () => {
        let tempProducts = [...initialProducts];

        // Filter by price
        tempProducts = tempProducts.filter(
            (product) => product.Price >= price[0] && product.Price <= price[1]
        );

        // Filter by sizes
        if (selectedSizes.length > 0) {
            tempProducts = tempProducts.filter((product) => {
                // Check if any of the product's available sizes match the selected sizes
                return selectedSizes.some(size => product[size]);
            });
        }
        
        setFilteredProducts(tempProducts);
    };

    // Fetch all products once on component mount
    useEffect(() => {
        const fetchAllProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await client.get(`/products`);
                const products = response.data.products;
                setInitialProducts(products);
                setFilteredProducts(products); // Initially, display all products
            } catch (err) {
                console.error("Failed to fetch products:", err);
                setError("Failed to fetch products.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllProducts();
    }, []); // Empty dependency array means this runs only once

    // Apply filters whenever price or selectedSizes change
    useEffect(() => {
        applyFilters();
    }, [price, selectedSizes]); // Dependency array includes the filter states

    // Handle error notifications
    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            setError(null);
        }
    }, [error, enqueueSnackbar]);
    
    return (
        <>
            <MetaData title="All Products" />
            <main className="w-full  sm:mt-0" style={{ marginTop: "100px" }}>
                <div className="flex gap-3 mt-2 sm:mt-2 sm:mx-3 m-auto mb-7">
                    <div className="hidden sm:flex flex-col w-1/5 px-1">
                        <div className="flex flex-col bg-white rounded-sm shadow">
                            <div className="flex items-center justify-between gap-5 px-4 py-2 border-b">
                                <p className="text-lg font-medium">Filters</p>
                                <span className="uppercase text-primary-blue text-xs cursor-pointer font-medium" onClick={clearFilters}>clear all</span>
                            </div>
                            <div className="flex flex-col gap-2 py-3 text-sm overflow-hidden">
                                {/* Price Slider Filter */}
                                <div className="flex flex-col gap-2 border-b px-4">
                                    <span className="font-medium text-xs">PRICE</span>
                                    <Slider
                                        value={price}
                                        onChange={priceHandler}
                                        valueLabelDisplay="auto"
                                        getAriaLabel={() => 'Price range slider'}
                                        min={0}
                                        max={2500}
                                    />
                                    <div className="flex gap-3 items-center justify-between mb-2 min-w-full">
                                        <span className="flex-1 border px-4 py-1 rounded-sm text-stone bg-gray-50">₹{price[0].toLocaleString()}</span>
                                        <span className="font-medium text-darkGray-400">to</span>
                                        <span className="flex-1 border px-4 py-1 rounded-sm text-stone bg-gray-50">₹{price[1].toLocaleString()}</span>
                                    </div>
                                </div>
                                {/* Price Slider Filter */}

                                {/* Sizes Filter */}
                                <div className="flex flex-col border-b px-4">
                                    <div className="flex justify-between cursor-pointer py-2 pb-4 items-center" onClick={() => setSizesToggle(!sizesToggle)}>
                                        <p className="font-medium text-xs uppercase">Sizes</p>
                                        {sizesToggle ? <ExpandLessIcon sx={{ fontSize: "20px" }} /> : <ExpandMoreIcon sx={{ fontSize: "20px" }} />}
                                    </div>
                                    {sizesToggle && (
                                        <div className="flex flex-col pb-1">
                                            <FormControl component="fieldset">
                                                <FormGroup>
                                                    {['S', 'M', 'L', 'XL'].map((size, i) => (
                                                        <FormControlLabel
                                                            key={i}
                                                            control={
                                                                <Checkbox 
                                                                    size="small" 
                                                                    value={size}
                                                                    checked={selectedSizes.includes(size)}
                                                                    onChange={handleSizeChange}
                                                                />
                                                            }
                                                            label={<span className="text-sm">{size}</span>}
                                                        />
                                                    ))}
                                                </FormGroup>
                                            </FormControl>
                                        </div>
                                    )}
                                </div>
                                {/* Sizes Filter */}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                {filteredProducts?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center gap-3 bg-white shadow-sm rounded-sm p-6 sm:p-16">
                                        <img draggable="false" className="w-1/2 h-44 object-contain" src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/error-no-search-results_2353c5.png" alt="Search Not Found" />
                                        <h1 className="text-2xl font-medium text-darkGray-900">Sorry, no results found!</h1>
                                        <p className="text-xl text-center text-primary-grey">Please check the spelling or try searching for something else</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 pb-4 justify-center items-center w-full overflow-hidden bg-white">
                                        <div className="grid w-full place-content-start overflow-hidden pb-4 border-b">
                                            {filteredProducts?.map((product) => (
                                                <Product {...product} key={product._id} />
                                            ))}
                                        </div>
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

export default Products;