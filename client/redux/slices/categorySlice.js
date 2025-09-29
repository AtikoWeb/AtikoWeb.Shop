import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from '../../axios';
import Cookies from 'js-cookie';

export const fetchCategory = createAsyncThunk(
    'category/fetchCategory',
    async ({id, limit, minPrice = 0, brandIds = [], maxPrice = 250000, sortProducts, settingsDBcode} = {}) => {
        const currentDomain = window.location.hostname;
        const db_code = Cookies.get('db_code') || settingsDBcode;
        const {data} = await axios.get(`category/categories/`, {
            params: {
                id,
                db_code,
                minPrice,
                maxPrice,
                limit,
                sortProducts,
                brandIds

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
export const {setSelectedCategory} = categorySlice.actions;
