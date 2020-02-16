import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import productsReducer from './products_reducer';
import cartReducer from './cart_reducer';
import orderReducer from './order_reducer';
import userReducer from './user_reducer';

const rootReducer = combineReducers({
    cart: cartReducer,
    form: formReducer,
    orders: orderReducer,
    products: productsReducer,
    user: userReducer
});

export default rootReducer;