import axios from "axios"
import { ADD_TO_CART, EMPTY_CART, REMOVE_FROM_CART, SAVE_SHIPPING_INFO } from "../constants/cartConstants";
import client from "../api/client";


export const addItemsToCart = (id ) => async (dispatch, getState) => {
  


// send the above details to the backend api in post
    const mobileNumber = sessionStorage.getItem('mobileNumber');
    console.log("Adding item to cart with ID:", id, "and mobile number:", mobileNumber);
    if (mobileNumber) {
        await client.post(`/wishlist/${id}/${mobileNumber}`, {
            
        }).then((response) => {
            console.log("Product added to wishlist:", response.data);
        }).catch((error) => {
            console.error("Error adding product to wishlist:", error);
        });
    }

   
}

// remove cart item
export const removeItemsFromCart = (id) => async (dispatch, getState) => {

    dispatch({
        type: REMOVE_FROM_CART,
        payload: id,
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

// empty cart
export const emptyCart = () => async (dispatch, getState) => {

    dispatch({ type: EMPTY_CART });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

// save shipping info
export const saveShippingInfo = (data) => async (dispatch) => {

    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload: data,
    });

    localStorage.setItem('shippingInfo', JSON.stringify(data));
}