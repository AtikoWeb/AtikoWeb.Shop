import {AnimatePresence, motion} from 'framer-motion';
import {Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import React, {useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Cart from './screens/Cart';
import CartComponent from './components/Cart';
import {hideCart, showCart} from '../redux/slices/cartSlice';
import Search from './screens/Search';
import Settings from './screens/Settings';
import './App.scss';
import {ScrollShadow, Spinner} from '@nextui-org/react';
import CategoriesList from './components/CategoriesList';
import Category from './screens/Category';
import axios from '../axios';
import Layout from './components/Layout';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Profile from './screens/Profile';
import Verify from './screens/Verify';
import ImageUploadForm from './screens/UploadImage';
import About from './screens/About';
import Contact from './screens/Contact';
import Refund from './screens/Refund';
import Header from "./components/Header.jsx";
import {Helmet} from "react-helmet";
import DetailProduct from "./screens/DetailProduct.jsx";
import MyOrders from "./screens/MyOrders.jsx";
import Home from './screens/Home.jsx';
import Cookies from 'js-cookie';
import {PiSmileySadBold} from "react-icons/pi";
import Reviews from "./screens/Reviews.jsx";
import {fetchCategory} from "../redux/slices/categorySlice.js";
import {fetchImages} from "../redux/slices/imageSlice.js";
import CartSmall from "./screens/CartSmall.jsx";

const App = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const images = useSelector(state => state.image.images.items);
    const isVisible = useSelector((state) => state.cart.isVisible);
    const itemCount = useSelector((state) => state.cart.count);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [loading, setLoading] = useState(true); // Состояние загрузки
    const [loadingError, setLoadingError] = useState(false); // Состояние ошибки загрузки
    const [shopName, setShopName] = useState('');
    const currentDomain = window.location.hostname === 'localhost' ? process.env.REACT_APP_DOMAIN : window.location.hostname;
    const db_code = Cookies.get('db_code') || '';
    const lowerCase_db_code = db_code.toString().toLowerCase();
    const API_URL_IMAGES = `https://${currentDomain}/api/images/${lowerCase_db_code}/images/`
    const [status, setStatus] = useState('');
    const MASTER_DB_URL = process.env.REACT_APP_MASTER_DB_URL;

    const getConfig = async () => {

        try {
            // Получение db_code
            const {data: {db_code}} = await axios.get(`https://${MASTER_DB_URL}/api/client/get-db/?domain=${currentDomain}`);
            Cookies.set('db_code', db_code, {expires: 7});

            // Получение статуса
            const statusResponse = await axios.get(`https://${MASTER_DB_URL}/api/client/get-status`, {
                params: {
                    db_code
                }
            });
            const status = statusResponse.data.status;
            setStatus(status);

            // Получение статуса
            const atikowebURLResponse = await axios.get(`https://${MASTER_DB_URL}/api/client/get-atikowebURL`, {
                params: {
                    db_code
                }
            });
            localStorage.setItem('AtikowebURL', atikowebURLResponse.data.url);

            // Получение настроек
            const res = await axios.get(`/settings?db_code=${db_code}`);
            document.documentElement.style.setProperty('--primary-color', res.data.config.main_color);
            localStorage.setItem('isInteresting', res.data.config.isInteresting);
            setShopName(res.data.config.shop_name || 'AtikoWeb.Store');
            localStorage.setItem('columnCount', res.data.config.column_count);

        } catch (error) {
            console.error('Error fetching settings:', error);
            throw error; // Пробрасываем ошибку для обработки в вызывающем коде
        }
    };

    const isCart = location.pathname.includes('/cart');
    const isSettings = location.pathname.includes('/settings');
    const isFileUpload = location.pathname.includes('/upload-image');
    const isDetailView = location.pathname.includes('/detailview');
    const isCategory = location.pathname.includes('/category');

    if (isCart || isSettings || isDetailView || itemCount === 0 || !isMobile) {
        dispatch(hideCart());
    } else {
        dispatch(showCart());
    }


    useEffect(() => {
        const fetchData = async () => {
            try {

                await getConfig();

                if (isSettings || isFileUpload) {
                    console.log({isFileUpload, isSettings});
                } else {
                    dispatch(fetchCategory());
                    dispatch(fetchImages());
                }
                // Установка состояния загрузки в false после успешной загрузки
                setLoading(false);
                setLoadingError(false);
            } catch (err) {
                console.warn(err);
                // Установка состояния ошибки загрузки в true в случае ошибки
                setLoading(false);
                setLoadingError(true);
            }
        };

        fetchData();
    }, [isSettings, isFileUpload]);

    const MemoizedCategoryList = useMemo(() => <CategoriesList images={images}/>, [images]);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    if (status === 'inactive') {
        return (
            <div className=' bg-white gap-5 grid place-content-center place-items-center mt-20'>
                <div className={'grid mx-5 lg:mx-0 gap-5'}>
                   <span className={'text-3xl'}>
                    Біреу төлем жасауды ұмытып кеткен сияқты
                </span>
                    <span className={'text-3xl opacity-60'}>
                    Кажется кто-то забыл совершить оплату
                </span>
                </div>
                <div className={'flex justify-center'}>
                    <PiSmileySadBold className={'text-9xl text-red-500 opacity-50 text-center'}/>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className='w-full bg-white flex justify-center mt-20'>
                <Spinner/>
            </div>
        );
    }

    if (loadingError) {
        return (
            <div className='w-screen bg-white flex justify-center mt-20'>
				<span className='text-danger grid gap-10 font-bold text-xl'>
					Ошибка при загрузке данных
					<Spinner color={'danger'}/>
				</span>
            </div>
        );
    }

    return (
        <>

            <Helmet>
                <title>{shopName}</title>
                <link
                    rel="icon"
                    type="image/x-icon"
                    href={`${API_URL_IMAGES}FAVICON.ICO`}
                />
            </Helmet>


            <div className={`${!isSettings && !isFileUpload && '2xl:container'} mx-auto`}>

                {isSettings || isFileUpload ? (' ') : (
                    <div className={'hidden md:block'}>
                        <Header/>
                    </div>
                )}


                <div className='flex z-10 bg-neutral-100 justify-between'>
                    {!isSettings && !isFileUpload && !isDetailView && !isCart && (
                        <div
                            className={`sticky hidden h-[100vh] lg:block top-5 w-1/3 mr-5 rounded-2xl`}
                        >
                            <div className={'bg-white h-[85vh] pt-3 rounded-2xl relative'}>
                                <ScrollShadow className='mx-3 h-[74vh]'>
                                    {MemoizedCategoryList}


                                </ScrollShadow>

                                <div className='absolute mt-10 right-0 left-0 bottom-6 mx-auto text-center'>
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
                        </div>
                    )}

                    <Layout>

                        <div className={''}>
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
                                                key='Detail'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <Home/>
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        key={'Cart'}
                                        path='/cart'
                                        element={
                                            <motion.div
                                                key='Cart'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <Cart/>
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        key={'Category'}
                                        path='/category/:id'
                                        element={
                                            <motion.div
                                                key='Category'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <Category/>
                                            </motion.div>
                                        }
                                    />

                                    <Route
                                        key={'SubCategory'}
                                        path='/category/:categoryId/sub-category/:subCategoryId/'
                                        element={
                                            <motion.div
                                                key='SubCategory'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <Category/>
                                            </motion.div>
                                        }
                                    />

                                    <Route
                                        key={'Detail'}
                                        path='/detailview/:id'
                                        element={
                                            <motion.div
                                                key='Home'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <DetailProduct/>
                                            </motion.div>
                                        }
                                    />

                                    <Route
                                        key={'Reviews'}
                                        path='/detailview/:id/reviews'
                                        element={
                                            <motion.div
                                                key='Reviews'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <Reviews/>
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        key={'SignIn'}
                                        path='/signin'
                                        element={
                                            <motion.div
                                                key='SignIn'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <SignIn/>
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        key={'SignUp'}
                                        path='/signup'
                                        element={
                                            <motion.div
                                                key='SignUp'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <SignUp/>
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        key={'Profile'}
                                        path='/profile'
                                        element={
                                            <motion.div
                                                key='Profile'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <Profile/>
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        key={'MyOrders'}
                                        path='/my-orders'
                                        element={
                                            <motion.div
                                                key='MyOrders'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <MyOrders/>
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        key={'Verify'}
                                        path='/verify'
                                        element={
                                            <motion.div
                                                key='Verify'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <Verify/>
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        key={'About'}
                                        path='/about'
                                        element={
                                            <motion.div
                                                key='About'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <About/>
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        key={'Contact'}
                                        path='/contact'
                                        element={
                                            <motion.div
                                                key='Contact'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <Contact/>
                                            </motion.div>
                                        }
                                    />
                                    <Route
                                        key={'Refund'}
                                        path='/refund'
                                        element={
                                            <motion.div
                                                key='Refund'
                                                initial={{opacity: 0}}
                                                animate={{opacity: 1}}
                                                exit={{opacity: 0}}
                                                transition={{duration: 0.1, delay: 0.2}}
                                            >
                                                <Refund/>
                                            </motion.div>
                                        }
                                    />
                                </Routes>
                            </AnimatePresence>

                            <CartComponent visible={isVisible}/>

                            <Routes>
                                <Route
                                    key={'Settings'}
                                    path='/settings'
                                    element={
                                        <motion.div
                                            key='Settings'
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            transition={{duration: 0.1, delay: 0.2}}
                                        >
                                            <Settings/>
                                        </motion.div>
                                    }
                                />
                                <Route
                                    key={'Search'}
                                    path='/search'
                                    element={
                                        <motion.div
                                            key='Search'
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            transition={{duration: 0.1, delay: 0.2}}
                                        >
                                            <Search/>
                                        </motion.div>
                                    }
                                />
                                <Route
                                    key={'FileUpload'}
                                    path='/upload-image'
                                    element={
                                        <motion.div
                                            key='FileUpload'
                                            initial={{opacity: 0}}
                                            animate={{opacity: 1}}
                                            exit={{opacity: 0}}
                                            transition={{duration: 0.1, delay: 0.2}}
                                        >
                                            <ImageUploadForm/>
                                        </motion.div>
                                    }
                                />
                            </Routes>
                        </div>
                    </Layout>

                    {!isSettings && !isFileUpload && !isDetailView && (
                        <div
                            className={`hidden ${isCart ? ' 2xl:hidden' : '2xl:block'} 2xl:block sticky ml-5 h-[100vh] top-5 xl:w-1/3 rounded-2xl`}
                        >

                            <div className={'rounded-2xl relative'}>
                                <CartSmall/>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default App;
