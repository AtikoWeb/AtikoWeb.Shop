import { combineReducers } from 'redux';
import { cartReducer } from './slices/cartSlice';
import { categoryReducer } from './slices/categorySlice';
import { productReducer } from './slices/productSlice';
import { userReducer } from './slices/userSlice';

const rootReducer = combineReducers({
	cart: cartReducer,
	categories: categoryReducer,
	products: productReducer,
	user: userReducer,
});

export default rootReducer;
