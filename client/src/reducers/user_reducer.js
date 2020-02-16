import types from '../actions/types';

const auth = localStorage.getItem('Authorization');
let DEFAULT_STATE = {}

if (auth) {
    DEFAULT_STATE = {
        auth: true,
        email: null,
        firstName: null,
        lastName: null
    }
} else {
    DEFAULT_STATE = {
        auth: false,
        email: null,
        firstName: null,
        lastName: null
    }
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case types.SIGN_IN:
        case types.SIGN_UP:
            return { ...state, auth: true, email: action.email, firstName: action.firstName, lastName: action.lastName }
        case types.SIGN_OUT:
            return { ...DEFAULT_STATE }
        default:
            return state;
    }
}