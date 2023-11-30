import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchProducts = createAsyncThunk(
	'products/fetchProducts',
	async ({ categoryId } = {}) => {
		const token = process.env.REACT_APP_API_TOKEN;
		const { data } = await axios.get(`product/products`, {
			params: {
				categoryId,
			},
			headers: {
				'x-auth-token': token,
			},
		});
		return data;
	}
);

const initialState = {
	products: {
		items: [],
		status: 'loading',
	},
};

const productSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {},
	extraReducers: {
		[fetchProducts.pending]: (state) => {
			state.products.status = 'loading';
		},
		[fetchProducts.fulfilled]: (state, action) => {
			state.products.items = action.payload;
			state.products.status = 'loaded';
		},
		[fetchProducts.rejected]: (state) => {
			state.products.items = [];
			state.products.status = 'error';
		},
	},
});

export const productReducer = productSlice.reducer;
