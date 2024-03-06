import {createSlice} from '@reduxjs/toolkit';

const calcTotalPrice = (items) => {
    return items.reduce((sum, obj) => Number(obj.price) * obj.qty + sum, 0);
};

const calculateTotalItems = (items) => {
    return items.reduce((total, item) => total + item.qty, 0);
};

const initialState = {
    items: [],
    totalPrice: 0,
    count: 0,
    isVisible: false,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        showCart: (state) => {
            state.isVisible = true;
        },
        hideCart: (state) => {
            state.isVisible = false;
        },
        addToCart(state, action) {
            const {productId, qty, size} = action.payload;

            const findItem = state.items.find(
                (obj) => obj.productId === productId && obj?.size?.sizeName === size?.sizeName
            );

            console.log(findItem);

            if (findItem) {
                findItem.qty += qty;
            } else {
                state.items.push({
                    ...action.payload,
                });
            }
            state.count = calculateTotalItems(state.items);
            state.totalPrice = calcTotalPrice(state.items);
        },

        incrementItem(state, action) {
            const findItem = state.items.find(
                (obj) =>
                    obj.productId === action.payload.productId &&
                    obj?.size?.sizeName === action?.payload?.size?.sizeName
            );

            if (findItem) {
                findItem.qty++;
            }

            state.count = calculateTotalItems(state.items);
            state.totalPrice = calcTotalPrice(state.items);
        },

        decrementItem(state, action) {
            const findItem = state.items.find(
                (obj) =>
                    obj.productId === action.payload.productId &&
                    obj?.size?.sizeName === action?.payload?.size?.sizeName
            );

            if (findItem) {
                findItem.qty--;
            }

            state.count = calculateTotalItems(state.items);
            state.totalPrice = calcTotalPrice(state.items);
        },

        removeFromCart(state, action) {
            const findItem = state.items.find(
                (obj) =>
                    obj.productId === action.payload.productId &&
                    obj?.size?.sizeName === action?.payload?.size?.sizeName
            );

            if (findItem && findItem.qty === 1) {
                state.items = state.items.filter(
                    (item) =>
                        !(
                            item.productId === findItem.productId &&
                            item.size?.sizeName === findItem.size?.sizeName
                        )
                );
            } else if (findItem) {
                findItem.qty -= 1;
            }

            state.count = calculateTotalItems(state.items);
            state.totalPrice = calcTotalPrice(state.items);
        },

        removeAll(state) {
            state.items = [];
            state.count = 0;
            state.totalPrice = 0;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    decrementItem,
    incrementItem,
    removeAll,
    showCart,
    hideCart,
} = cartSlice.actions;

export const cartReducer = cartSlice.reducer;
