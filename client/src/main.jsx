import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.scss';
import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../redux/store.js';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<NextUIProvider>
			<Provider store={store}>
				<App />
				<ToastContainer />
			</Provider>
		</NextUIProvider>
	</BrowserRouter>
);
