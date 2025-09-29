import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from '../../axios';
import Cookies from 'js-cookie';

export const fetchImages = createAsyncThunk(
    'fetchImages',
    async ({settingsDBcode} = {}) => {
        const db_code = Cookies.get('db_code') || settingsDBcode;
        const {data} = await axios.get(`/images/get-images`, {
            params: {
                db_code
            },
        });
        return data;
    }
);

const initialState = {
    images: {
        items: [],
        status: 'idle', // Изначальный статус "покоя"
        lastUpdated: null, // Дата последнего обновления кэша
    },
};


const imageSlice = createSlice({
    name: 'images',
    initialState,
    extraReducers: {
        [fetchImages.pending]: (state) => {
            if (state.images.status === 'idle') {
                state.images.status = 'loading';
            }
        },
        [fetchImages.fulfilled]: (state, action) => {
            state.images.items = action.payload;
            state.images.status = 'loaded';
            state.images.lastUpdated = Date.now(); // Обновляем дату последнего обновления кэша
        },
        [fetchImages.rejected]: (state) => {
            state.images.status = 'error';
        },
    },
});

export const imageReducer = imageSlice.reducer;
