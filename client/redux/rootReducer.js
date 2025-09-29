import {combineReducers} from 'redux';
import {cartReducer} from './slices/cartSlice';
import {categoryReducer} from './slices/categorySlice';
import {productReducer} from './slices/productSlice';
import {userReducer} from './slices/userSlice';
import {imageReducer} from "./slices/imageSlice.js";

const rootReducer = combineReducers({
    cart: cartReducer,
    categories: categoryReducer,
    products: productReducer,
    user: userReducer,
    image: imageReducer
});

export default rootReducer;
