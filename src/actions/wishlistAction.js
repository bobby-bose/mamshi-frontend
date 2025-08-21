import axios from "axios";
import { ADD_TO_WISHLIST, REMOVE_FROM_WISHLIST } from "../constants/wishlistConstants";
import client from "../api/client";
// Add To Wishlist
export const addToWishlist = (id, mobileNumber) => async (dispatch, getState) => {
    const response = await client.post(`/wishlist/${id}/${mobileNumber}`);
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