import types from '../actions/types';

const DEFAULT_STATE = {
    details: null,
    list: []
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case types.ADD_ITEM_TO_CART:
            return { ...state, cart: action.cart }
        case types.CLEAR_PRODUCT_DETAILS:
            return { ...state, details: null }
        case types.GET_ALL_PRODUCTS:
            return { ...state, list: action.products }
        case types.GET_PRODUCT_DETAILS:
            return { ...state, details: action.details }
        default:
            return state;
    }
} 