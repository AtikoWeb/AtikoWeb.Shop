import { AnimatePresence, motion } from 'framer-motion';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import Home from './screens/Home';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategory } from '../redux/slices/categorySlice';
import { fetchProducts } from '../redux/slices/productSlice';
import './App.scss';
import Cart from './screens/Cart';
import CartComponent from './components/Cart';
import { hideCart, showCart } from '../redux/slices/cartSlice';
import Search from './screens/Search';
import Settings from './screens/Settings';
import { ScrollShadow, Spinner } from '@nextui-org/react';
import CategoriesList from './components/CategoriesList';
import Category from './screens/Category';
import axios from '../axios';
import Layout from './components/Layout';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Profile from './screens/Profile';
import Verify from './screens/Verify';

const App = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const isVisible = useSelector((state) => state.cart.isVisible);
	const itemCount = useSelector((state) => state.cart.count);
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	const [loading, setLoading] = useState(true); // Состояние загрузки
	const [loadingError, setLoadingError] = useState(false); // Состояние ошибки загрузки

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Загрузка данных категории
				dispatch(fetchCategory());

				// Загрузка данных продуктов
				dispatch(fetchProducts());

				// Загрузка данных цвета
				const res = await axios.get('/settings/');
				document.documentElement.style.setProperty(
					'--primary-color',
					res.data.config.main_color
				);

				// Установка состояния загрузки в false после успешной загрузки
				setLoading(false);
				setLoadingError(false);
			} catch (err) {
				console.warn(err);
				// Установка состояния ошибки загрузки в true в случае ошибки
				setLoading(false);
				setLoadingError(false);
			}
		};

		fetchData();
	}, [dispatch]);

	const isCart = location.pathname.includes('/cart');
	const isSettings = location.pathname.includes('/settings');

	if (isCart || isSettings || itemCount === 0 || !isMobile) {
		dispatch(hideCart());
	} else {
		dispatch(showCart());
	}

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	if (loading) {
		return (
			<div className='w-screen bg-white flex justify-center mt-20'>
				<Spinner />
			</div>
		);
	}

	if (loadingError) {
		return (
			<div className='w-screen flex justify-center mt-20'>
				<span className='text-red-500 grid gap-10 font-bold text-xl'>
					Ошибка при загрузке данных
					<Spinner />
				</span>
			</div>
		);
	}

	return (
		<div className='bg-gray-100 flex'>
			{!isSettings && (
				<div
					className={`hidden w-1/2 lg:block xl:w-1/5 mr-5 mt-5 rounded-2xl bg-white pt-5`}
				>
					<div
						onClick={() => navigate('/')}
						className='flex justify-center pb-8'
					>
						<img
							src='/aokia_logo.png'
							alt=''
							className='h-10 cursor-pointer'
						/>
					</div>
					<ScrollShadow className='mx-3 h-[620px]'>
						<CategoriesList />
					</ScrollShadow>
					<div className='text-center'>
						<a
							href='https://atikoweb.kz'
							target='_blank'
						>
							<span className='text-lg font-bold text-neutral-400'>
								Работает на AtikoWeb
							</span>
						</a>
					</div>
				</div>
			)}

			<Layout>
				<AnimatePresence
					mode='wait'
					onExitComplete={() => handlePageChange(null)}
				>
					<Routes>
						<Route
							key={'Home'}
							path='/'
							element={
								<motion.div
									key='Home'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.1, delay: 0.2 }}
								>
									<Home />
								</motion.div>
							}
						/>
						<Route
							key={'Cart'}
							path='/cart'
							element={
								<motion.div
									key='Cart'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.1, delay: 0.2 }}
								>
									<Cart />
								</motion.div>
							}
						/>
						<Route
							key={'Category'}
							path='/category/:id'
							element={
								<motion.div
									key='Category'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.1, delay: 0.2 }}
								>
									<Category />
								</motion.div>
							}
						/>
						<Route
							key={'SignIn'}
							path='/signin'
							element={
								<motion.div
									key='SignIn'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.1, delay: 0.2 }}
								>
									<SignIn />
								</motion.div>
							}
						/>
						<Route
							key={'SignUp'}
							path='/signup'
							element={
								<motion.div
									key='SignUp'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.1, delay: 0.2 }}
								>
									<SignUp />
								</motion.div>
							}
						/>
						<Route
							key={'Profile'}
							path='/profile'
							element={
								<motion.div
									key='Profile'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.1, delay: 0.2 }}
								>
									<Profile />
								</motion.div>
							}
						/>
						<Route
							key={'Verify'}
							path='/verify'
							element={
								<motion.div
									key='Verify'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.1, delay: 0.2 }}
								>
									<Verify />
								</motion.div>
							}
						/>
					</Routes>
				</AnimatePresence>

				<CartComponent visible={isVisible} />

				<Routes>
					<Route
						key={'Settings'}
						path='/settings'
						element={
							<motion.div
								key='Settings'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1, delay: 0.2 }}
							>
								<Settings />
							</motion.div>
						}
					/>
					<Route
						key={'Search'}
						path='/search'
						element={
							<motion.div
								key='Search'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.1, delay: 0.2 }}
							>
								<Search />
							</motion.div>
						}
					/>
				</Routes>
			</Layout>

			{!isSettings && (
				<div className='fixed right-8 h-screen w-1/4 hidden xl:flex'>
					<div className='bg-white h-full mt-5 rounded-2xl relative'>
						<Cart />
					</div>
				</div>
			)}
		</div>
	);
};

export default App;
