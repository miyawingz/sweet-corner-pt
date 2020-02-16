import axios from 'axios';
import types from './types';
const BASE_URL = "http://api.sc.lfzprototypes.com";

export function getAllProducts() {
    return async function (dispatch) {
        try {
            const resp = await axios.get("/api/products");

            dispatch({
                type: types.GET_ALL_PRODUCTS,
                products: resp.data.products
            })

        }
        catch (error) {
            console.error('get all products fail', error);
        }

    }
}

export function getProductDetails(id) {
    return async function (dispatch) {
        try {
            const resp = await axios.get(`/api/products/${id}`);
            dispatch({
                type: types.GET_PRODUCT_DETAILS,
                details: resp.data
            })
        }

        catch (error) {
            console.error('get product details fail', error);
        }
    }
}

export const clearProductDetails = () => ({ type: types.CLEAR_PRODUCT_DETAILS })

export const addItemToCart = (productId, quantity) => async (dispatch) => {
    try {
        let axiosConfig = {};
        const auth = localStorage.getItem('Authorization')
        if (auth) {
            axiosConfig = {
                headers: {
                    'Authorization': auth,
                }
            }
        } else {
            const cartToken = localStorage.getItem('sc-cart-token');
            axiosConfig = {
                headers: {
                    'X-Cart-Token': cartToken
                }
            }
        }

        const resp = await axios.post(`${BASE_URL}/api/cart/items/${productId}`, {
            quantity: quantity
        }, axiosConfig)

        if (!auth) {
            localStorage.setItem('sc-cart-token', resp.data.cartToken);
        }

        dispatch({
            type: types.ADD_ITEM_TO_CART,
            cartTotal: resp.data.total
        })
    }

    catch (error) {
        console.error('add item to cart fail', error);
    }
}

export const getActiveCart = () => async (dispatch) => {
    try {
        let axiosConfig = {};
        const auth = localStorage.getItem('Authorization')
        if (auth) {
            axiosConfig = {
                headers: {
                    'Authorization': auth,
                }
            }
        } else {
            const cartToken = localStorage.getItem('sc-cart-token');
            axiosConfig = {
                headers: {
                    'X-Cart-Token': cartToken
                }
            }
        }

        const resp = await axios.get(`${BASE_URL}/api/cart`, axiosConfig);

        dispatch({
            type: types.GET_ACTIVE_CART,
            cart: resp.data
        })
    }

    catch (error) {
        console.error('get active cart fail', error);
    }
}

export const getCartTotals = () => async (dispatch) => {
    try {
        let axiosConfig = {};
        const auth = localStorage.getItem('Authorization')
        if (auth) {
            axiosConfig = {
                headers: {
                    'Authorization': auth,
                }
            }
        } else {
            const cartToken = localStorage.getItem('sc-cart-token');
            axiosConfig = {
                headers: {
                    'X-Cart-Token': cartToken
                }
            }
        }

        const resp = await axios.get(`${BASE_URL}/api/cart/totals`, axiosConfig);

        dispatch({
            type: types.GET_CART_TOTALS,
            total: resp.data.total
        })
    }

    catch (error) {
        console.error('get cart totail fail', error);
    }
}

export const createGuestOrder = (formValues) => async (dispatch) => {
    try {
        const { firstName, lastName, email } = formValues;
        const cartToken = localStorage.getItem('sc-cart-token');
        const axiosConfig = {
            headers: {
                'X-Cart-Token': cartToken
            }
        }

        const resp = await axios.post(`${BASE_URL}/api/orders/guest`, {
            email: email,
            firstName: firstName,
            lastName: lastName
        }, axiosConfig)

        localStorage.removeItem('sc-cart-token');

        dispatch({
            type: types.CREATE_GUEST_ORDER,
            orderId: resp.data.id,
            email: email
        })
    }
    catch (error) {
        console.error('create guest order fail', error);
    }
}

export const getGuestOrderDetails = (orderId, email) => async (dispatch) => {
    try {
        const resp = await axios.get(`${BASE_URL}/api/orders/guest/${orderId}`, {
            params: {
                email: email
            }
        })

        dispatch({
            type: types.GET_GUEST_ORDER_DETAILS,
            orderDetails: resp.data
        })
    }
    catch (error) {
        console.error('get guest order details fail', error)
    }

}

export function deleteItemFromCart(id) {
    return async function (dispatch) {
        try {
            let axiosConfig = {};
            const auth = localStorage.getItem('Authorization')
            if (auth) {
                axiosConfig = {
                    headers: {
                        'Authorization': auth,
                    }
                }
            } else {
                const cartToken = localStorage.getItem('sc-cart-token');
                axiosConfig = {
                    headers: {
                        'X-Cart-Token': cartToken
                    }
                }
            }

            const resp = await axios.delete(`${BASE_URL}/api/cart/items/${id}`, axiosConfig);

            dispatch({
                type: types.DELETE_ITEM_FROM_CART,
                total: resp.data.total
            })
        }

        catch (error) {
            console.error('delete item from cart fail', error.message)
        }
    }
}

export const signUp = (user) => async (dispatch) => {
    try {
        const cartToken = localStorage.getItem('sc-cart-token');
        const axiosConfig = {
            headers: {
                'X-Cart-Token': cartToken
            }
        }

        const resp = await axios.post(`${BASE_URL}/auth/create-account`, user, axiosConfig);
        localStorage.setItem('Authorization', resp.data.token);
        localStorage.removeItem('sc-cart-token');

        dispatch({
            type: types.SIGN_UP,
            email: resp.data.user.email,
            firstName: resp.data.user.firstName,
            lastName: resp.data.user.lastName
        })
    }

    catch (error) {
        console.error('sign in fail', error.message);
    }
}

export const signIn = (user) => async (dispatch) => {
    try {
        const cartToken = localStorage.getItem('sc-cart-token');
        const axiosConfig = {
            headers: {
                'X-Cart-Token': cartToken
            }
        }
        const resp = await axios.post(`${BASE_URL}/auth/sign-in`, user, axiosConfig);
        localStorage.setItem('Authorization', resp.data.token);
        localStorage.removeItem('sc-cart-token');

        dispatch({
            type: types.SIGN_IN,
            email: resp.data.user.email,
            firstName: resp.data.user.firstName,
            lastName: resp.data.user.lastName
        })
    }

    catch (error) {
        console.error('sign in fail', error.messgae)
    }
}

export const signOut = () => {
    localStorage.removeItem('Authorization');

    return {
        type: types.SIGN_OUT
    }
}

export const createUserOrder = (user) => async (dispatch) => {
    try {
        const auth = localStorage.getItem('Authorization')
        const axiosConfig = {
            headers: {
                'Authorization': auth
            }
        }
        const resp = await axios.post(`${BASE_URL}/api/orders`, user, axiosConfig);

        dispatch({
            type: types.CREATE_USER_ORDER,
            orderId: resp.data.id,
            email: user.email
        })
    }
    catch (error) {
        console.error('fail create user order', error.message)
    }
}

export const getUserOrderDetails = (orderId) => async (dispatch) => {
    try {
        const auth = localStorage.getItem('Authorization')
        const axiosConfig = {
            headers: {
                'Authorization': auth
            }
        }
        const resp = await axios.get(`${BASE_URL}/api/orders/${orderId}`, axiosConfig);

        dispatch({
            type: types.GET_USER_ORDER_DETAILS,
            orderDetails: resp.data,
            orderId: resp.data.id
        })
    }
    catch (error) {
        console.error('fail get user order detail', error.message)
    }
}