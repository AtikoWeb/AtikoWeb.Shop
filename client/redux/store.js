import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import persistConfig from './persistConfig';
import { persistReducer, persistStore } from 'redux-persist';

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
});
const persistor = persistStore(store);

export { store, persistor };
