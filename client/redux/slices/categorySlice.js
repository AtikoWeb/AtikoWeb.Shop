import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchCategory = createAsyncThunk(
	'category/fetchCategory',
	async (id) => {
		const token = process.env.REACT_APP_API_TOKEN;
		const { data } = await axios.get(`category/categories/`, {
			params: {
				id,
			},
			headers: {
				'x-auth-token': token,
			},
		});
		return data;
	}
);

const initialState = {
	categories: {
		items: [],
		status: 'loading',
	},
	selectedCategory: null,
};

const categorySlice = createSlice({
	name: 'categories',
	initialState,
	reducers: {
		setSelectedCategory: (state, action) => {
			state.selectedCategory = action.payload;
		},
	},
	extraReducers: {
		[fetchCategory.pending]: (state) => {
			state.categories.status = 'loading';
		},
		[fetchCategory.fulfilled]: (state, action) => {
			state.categories.items = action.payload;
			state.categories.status = 'loaded';
		},
		[fetchCategory.rejected]: (state) => {
			state.categories.items = [];
			state.categories.status = 'error';
		},
	},
});

export const categoryReducer = categorySlice.reducer;
export const { setSelectedCategory } = categorySlice.actions;
