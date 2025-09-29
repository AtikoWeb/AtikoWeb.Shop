import React, {useCallback, useEffect, useMemo, useState} from 'react';
import CategoriesList from '../components/CategoriesList';
import 'react-spring-bottom-sheet/dist/style.css';
import InterestingCard from '../components/InterestingCard';
import Search from '../components/Search';
import ProductList from '../components/ProductList';
import Header from '../components/Header';
import {Spinner} from '@nextui-org/react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {hideCart, showCart} from '../../redux/slices/cartSlice.js';
import {fetchCategory, setSelectedCategory} from '../../redux/slices/categorySlice';
import ModalWindow from '../components/Modal.jsx';
import axios from '../../axios.js';
import Stories from 'react-insta-stories';
import Cookies from "js-cookie";
import {fetchProducts} from "../../redux/slices/productSlice.js";

function Home() {
    const [open, setOpen] = useState(false);
    const products = useSelector((state) => state.products);
    const isProductsLoading = products.products.status === 'loading';
    const isProductsError = products.products.status === 'error';
    const [isLoading, setIsLoading] = useState(false);
    const [interesting, setInteresting] = useState([]);
    const [stories, setStories] = useState([]);
    const currentDomain = window.location.hostname === 'localhost' ? process.env.REACT_APP_DOMAIN : window.location.hostname;
    const db_code = Cookies.get('db_code');
    const [isScroll, setIsScroll] = useState(false);
    const API_URL_IMAGES = `https://${currentDomain}/api/images/${db_code}/images/`;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const images = useSelector(state => state.image.images.items);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isInterestingFromLocal = localStorage.getItem('isInteresting');

    useEffect(() => {
        dispatch(setSelectedCategory(''));
        dispatch(fetchProducts({limit: 10}));
        dispatch(fetchCategory(isMobile && {limit: 10}));
        getInteresting();
    }, []);


    // const fetchImages = useCallback(() => {
    //     const storedImages = localStorage.getItem('images');
    //     if (storedImages) {
    //         setImages(JSON.parse(storedImages));
    //         setIsLoading(false);
    //     } else {
    //         axios
    //             .get(`/images/get-images`, {
    //                 params: {
    //                     db_code,
    //                 }
    //             })
    //             .then((res) => {
    //                 setImages(res.data);
    //                 localStorage.setItem('images', JSON.stringify(res.data));
    //                 setIsLoading(false);
    //             })
    //             .catch((err) => {
    //                 console.warn(err);
    //             });
    //     }
    // }, [db_code]);

    const getInteresting = useCallback(async () => {
        await axios
            .get(`/interesting/get-all`, {
                params: {
                    db_code,
                }
            })
            .then((response) => {
                setInteresting(response.data);
            })
            .catch((error) => {
                console.error('Error fetching settings:', error);
            });
    }, [db_code]);


    const openStories = () => {
        dispatch(hideCart());
        setOpen(true);
    };

    const closeStories = () => {
        dispatch(showCart());
        setOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsScroll(scrollTop > 0);

            console.log('scroll')
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleClickInteresting = useCallback(async (obj) => {
        try {
            const storiesImages = images?.filter((image) => image.name.includes(obj.id) && image.isMainImage === false);

            if (storiesImages.length > 0) {
                setStories(storiesImages.map((img) => `${API_URL_IMAGES}${img.name}`));
                openStories();
            }
        } catch (error) {
            console.error('Error handling interesting click:', error);
        }
    }, [images, API_URL_IMAGES, setStories]);


    const MemoizedProductListMobile = useMemo(() => <ProductList isHome={true}
                                                                 display='flex'/>, [images]);

    const MemoizedCategoryListMobile = useMemo(() => <CategoriesList images={images}
                                                                     isHome={true}/>, [images]);

    const MemoizedProductListDesktop = useMemo(() => <ProductList isHome={true}/>, [images]);

    const interestingCards = useMemo(() =>
        interesting.map((obj, index) => (
            <InterestingCard
                key={index}
                id={obj.id}
                index={index}
                isLoading={isLoading}
                images={images}
                name={obj.name}
                onClick={() => handleClickInteresting(obj)}
            />
        )), [interesting, isLoading, handleClickInteresting]);

    if (isProductsLoading) {
        return (
            <div className='w-full bg-white flex justify-center mt-20'>
                <Spinner/>
            </div>
        );
    }

    if (isProductsError) {
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
            <div className={'relative'}>
                <div className='block md:hidden'>
                    <Header/>
                </div>
                <div className={`bg-white  ${
                    isScroll ? 'shadow-black/20 shadow-2xl' : ''} rounded-b-2xl pt-5 px-3 lg:px-5 pb-5 sticky top-0 z-[2] lg:pt-3 lg:rounded-t-3xl`}>
                    <Search/>
                </div>

                <div
                    className={`bg-white ${isInterestingFromLocal !== 'false' ? 'block' : 'hidden'} rounded-b-3xl px-3 lg:px-5 pt-3 z-[1]`}>
                    <span className='text-2xl lg:text-3xl font-black'>Это интересно</span>
                    <div className='grid grid-cols-3 pt-2 gap-2 w-full pb-6'>
                        {interestingCards}
                    </div>
                </div>
                <div className='lg:hidden'>
                    <div className='flex mx-3 mt-2 lg:mx-5 justify-between'>
                        <span className='text-2xl mb-1 font-black'>Категории</span>

                    </div>
                    <div className='mt-2 flex overflow-x-scroll overflow-y-hidden scrollbar-hide'>
                        {MemoizedCategoryListMobile}
                    </div>
                </div>
                <div className={`bg-white lg:mt-5 rounded-3xl mt-8`}>
                    <span className='text-2xl lg:text-3xl mx-3 lg:mx-5 font-black'>Часто покупают</span>

                    {isMobile ? (
                        <div className='pb-10 mt-2'>
                            {MemoizedProductListMobile}
                        </div>
                    ) : (
                        <div className='pb-10 mx-3 mt-3'>
                            {MemoizedProductListDesktop}
                        </div>
                    )}

                </div>
            </div>
            <ModalWindow scrollBehavior={'normal'} size={isMobile ? 'full' : 'xl'} onClose={closeStories}
                         isStories={true} isOpen={open}>
                <div className={`${isMobile && 'grid place-items-center relative place-content-center'}`}>

                    <Stories
                        stories={stories}
                        defaultInterval={10000}
                        width={isMobile ? '100vw' : 480}
                        height={'100%'}
                        storyContainerStyles={{
                            borderRadius: '15px',
                            overflowX: 'hidden',
                            overflowY: 'hidden',
                            zIndex: 0
                        }}
                        storyStyles={{height: '100vh', width: '100vw'}}
                        onAllStoriesEnd={closeStories}
                    />
                </div>
            </ModalWindow>

        </>
    );
}

export default Home;
