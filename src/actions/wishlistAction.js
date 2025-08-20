import axios from "axios";
import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../constants/wishlistConstants";
import HOST from '../constants/constant';
import PORT from '../constants/constant';
// Add To Wishlist
export const addToWishlist = (id, mobileNumber) => async (dispatch, getState) => {
    const response = await axios.post(`http://localhost:4000/api/v1/wishlist/${id}/${mobileNumber}`);
    console.log("Product added to wishlist:", response.data);
}
     

// Remove From Wishlist
export const removeFromWishlist = (id) => async (dispatch, getState) => {

    dispatch({
        type: REMOVE_FROM_WISHLIST,
        payload: id,
    });

    localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlistItems))
}