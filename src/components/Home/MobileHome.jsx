import { useEffect } from 'react';
import ProductSlider from './ProductSlider/ProductSlider';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors } from '../../actions/productAction';
import { useSnackbar } from 'notistack';
import MetaData from '../Layouts/MetaData';
import MobilePromoBanner from './Banner/MobileBanner';
import MobileDealSlider from './DealSlider/MobileDealSlider';

const MobileHome = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { error } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: 'error' });
      dispatch(clearErrors());
    }
  }, [dispatch, error, enqueueSnackbar]);

  return (
    <>
      <MetaData title="Shop on Mobile - Mobiles, Electronics, Grocery & More!" />

      <main className="flex flex-col gap-2 px-3 mt-14 sm:mt-4">
        {/* Banner Section */}
        <div className="w-full h-70 sm:h-50">
          <MobilePromoBanner  />
        </div>

    

        {/* Deal Slider */}
        <div className="w-full my-2">
          <MobileDealSlider title="Trending Deals for You" />
        </div>

        {/* Product Slider */}
       
      </main>
    </>
  );
};

export default MobileHome;
