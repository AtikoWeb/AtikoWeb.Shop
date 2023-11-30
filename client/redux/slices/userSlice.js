import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	userId: localStorage.getItem('userId') || null,
	isAuthenticated: localStorage.getItem('userId') ? true : false,
	loading: false,
	error: null,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		userRegistered: (state, action) => {
			state.userId = action.payload;
			state.isAuthenticated = true;
			state.loading = false;
			state.error = null;
		},
		userLoggedIn: (state, action) => {
			state.userId = action.payload;
			state.isAuthenticated = true;
			state.loading = false;
			state.error = null;
		},
		userLoggedOut: (state) => {
			state.userId = null;
			state.isAuthenticated = false;
			state.loading = false;
			state.error = null;
		},
		authError: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
});

export const {
	userRegistered,
	userLoggedIn,
	userLoggedOut,
	authError,
	clearError,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
