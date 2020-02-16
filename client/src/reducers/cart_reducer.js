import types from '../actions/types';

const DEFAULT_STATE = {
    cartId: null,
    items: null,
    total: null
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case types.ADD_ITEM_TO_CART:
            return { ...state, total: action.cartTotal }
        case types.CREATE_GUEST_ORDER: {
            return { ...DEFAULT_STATE }
        }
        case types.GET_ACTIVE_CART:
            return { ...state, ...action.cart }
        case types.DELETE_ITEM_FROM_CART:
        case types.GET_CART_TOTALS:
            return { ...state, total: action.total }
        default:
            return state;
    }
}