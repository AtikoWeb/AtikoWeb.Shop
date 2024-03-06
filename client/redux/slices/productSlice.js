import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({categoryId, minPrice, page, limit, maxPrice, brandIds, searchQuery, sort, keepOldItems} = {}) => {
        const token = process.env.REACT_APP_API_TOKEN;
        const {data} = await axios.get(`product/products`, {
            params: {
                categoryId,
                searchQuery,
                sort,
                minPrice,
                maxPrice,
                brandIds,
                page,
                limit
            },
            headers: {
                'x-auth-token': token,
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
    reducers: {},
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

export const productReducer = productSlice.reducer;
