import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from '../../axios';
import Cookies from 'js-cookie';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({
               categoryId,
               settingsDBcode,
               minPrice,
               page,
               limit,
               maxPrice,
               brandIds,
               searchQuery,
               sort,
               keepOldItems
           } = {}) => {
        const currentDomain = window.location.hostname;
        const db_code = Cookies.get('db_code') || settingsDBcode;
        const {data} = await axios.get(`product/products`, {
            params: {
                categoryId,
                searchQuery,
                sort,
                minPrice,
                maxPrice,
                brandIds,
                page,
                limit,
                db_code,
            },
        });
        return {data, keepOldItems};
    }
);

const initialState = {
    products: {
        items: [],
        totalCount: 0,
        countOnPage: 0,
        status: 'loading',
    },
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        resetProducts: (state) => {
            state.products = initialState.products; // Сбрасываем состояние списка продуктов до начального
        },
    },
    extraReducers: {
        [fetchProducts.pending]: (state) => {
            state.products.status = 'loading';
        },
        [fetchProducts.fulfilled]: (state, action) => {
            if (action.payload.keepOldItems) {
                state.products.items = [...state.products.items, ...action.payload.data.products]; // Добавляем новые товары к существующим
            } else {
                state.products.items = action.payload.data.products; // Заменяем старые товары новыми
            }
            state.products.totalCount = action.payload.data.totalCount;
            state.products.countOnPage = action.payload.data.countOnPage;
            state.products.status = 'loaded';
        },
        [fetchProducts.rejected]: (state) => {
            state.products.items = [];
            state.products.count = 0; // Сбрасываем count при ошибке
            state.products.status = 'error';
        },
    },
});

export const {resetProducts} = productSlice.actions;
export const productReducer = productSlice.reducer;
