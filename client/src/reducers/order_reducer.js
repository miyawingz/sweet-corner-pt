import types from '../actions/types';

const DEFAULT_STATE = {
    details: null,
    email: null,
    orderId: null
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case types.CREATE_USER_ORDER:
        case types.CREATE_GUEST_ORDER:
            return { ...state, orderId: action.orderId, email: action.email }
        case types.GET_GUEST_ORDER_DETAILS:
        case types.GET_USER_ORDER_DETAILS:
            return { ...state, details: action.orderDetails, orderId: action.orderId }
        default:
            return state;
    }
}