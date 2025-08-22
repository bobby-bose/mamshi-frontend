import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import logo from '../../../assets/images/logo.png';
import PrimaryDropDownMenu from './PrimaryDropDownMenu';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const Header = () => {

  const user = sessionStorage.getItem('mobileNumber') || '' || '';

  const { cartItems } = useSelector(state => state.cart);

  const [togglePrimaryDropDown, setTogglePrimaryDropDown] = useState(false);

const whatsappNumber = '916360461032'; // Replace with your desired number, including the country code

  // This function constructs the WhatsApp URL and opens it in a new tab
  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${whatsappNumber}`;
    window.open(url, '_blank');
  };

  return (

    <header className="
    // i need a dark grey background
    bg-gray-700
     fixed top-0 py-2.5 w-full z-10">

      {/* <!-- navbar container --> */}
      <div className="w-full flex justify-between items-center relative" style={{
        // padding to left and right at once
        paddingLeft: "20px",
        paddingRight: "20px"
      }}>

        {/* <!-- logo & search container --> */}
        <div className="flex items-center flex-1 items-center justify-between">
          <Link className="h-7 mr-1 sm:mr-4" to="/">
            <img draggable="false" src={logo} alt="Slouch Logo"
            style={{
              // i need a custom styling with good border nad rounded corners and shadow
              // also with nice width and 50% hieght only

              width: "80px",
              height: "120%",
              borderRadius: "10px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)"

            }} />
          </Link>

 
  

  { !user && (
    <Link to="/login" className="px-3 sm:px-9 py-0.5 text-primary-blue bg-white border font-medium rounded-sm cursor-pointer">Login</Link>
)}
              <div
              className="text-green cursor-pointer hover:scale-105 transition-transform duration-200   
  flex justify-center items-center"
              onClick={handleWhatsAppClick}
            >
         <i className="fa fa-whatsapp" style={{ fontSize: "35px", color: "green",fontWeight:'bolder' }}></i>
            </div>
          <div className="relative flex items-center">
  <span
    className="userDropDown flex items-center text-white font-medium gap-1 cursor-pointer"
    onClick={() => setTogglePrimaryDropDown(!togglePrimaryDropDown)}
  >
    {user}
    <span>
      {togglePrimaryDropDown ? (
        <ExpandLessIcon sx={{ fontSize: "16px" }} />
      ) : (
        <ExpandMoreIcon sx={{ fontSize: "16px" }} />
      )}
    </span>
  </span>

  {/* dropdown will now align under user */}
  {togglePrimaryDropDown && (
    <PrimaryDropDownMenu
      setTogglePrimaryDropDown={setTogglePrimaryDropDown}
      user={user}
    />
  )}
</div>


          <Link to="/cart" className="flex items-center text-white font-medium gap-2 relative">
            <span><ShoppingCartIcon /></span>
            {cartItems.length > 0 &&
              <div className="w-5 h-5 p-2 bg-gray-700 text-xs rounded-full absolute -top-2 left-3 flex justify-center items-center border">
                {cartItems.length}
              </div>
            }
            Cart
          </Link>
        </div>
        {/* <!-- right navs --> */}

      </div>
      {/* <!-- navbar container --> */}
    </header>
  )
};

export default Header;
