import React, {useCallback, useEffect, useMemo, useState} from 'react';
import CategoriesList from '../components/CategoriesList';
import 'react-spring-bottom-sheet/dist/style.css';
import InterestingCard from '../components/InterestingCard';
import Search from '../components/Search';
import ProductList from '../components/ProductList';
import Header from '../components/Header';
import {Button} from '@nextui-org/react';
import {FaChevronRight} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {hideCart, showCart} from '../../redux/slices/cartSlice.js';
import {setSelectedCategory} from '../../redux/slices/categorySlice';
import {fetchProducts} from '../../redux/slices/productSlice';
import ModalWindow from '../components/Modal.jsx';
import axios from '../../axios.js';
import Stories from 'react-insta-stories';

function Home() {
    const [isScroll, setIsScroll] = useState(false);
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [interesting, setInteresting] = useState([]);
    const [isInteresting, setIsInteresting] = useState(false);
    const [clickedInterestingCard, setClickedInterestingCard] = useState({});
    const [stories, setStories] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const accessToken = process.env.REACT_APP_API_TOKEN;
    const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;

    useEffect(() => {
        localStorage.removeItem('filters');
        window.scrollTo(0, 0);
    }, []);

    const getIsInteresting = () => {
        axios
            .get(`/settings/`)
            .then((response) => {
                setIsInteresting(response.data.config.isInteresting || false);
            })
            .catch((error) => {
                setIsLoading();
                console.error('Error fetching settings:', error);
            });
    };

    const fetchImages = () => {
        axios
            .get(`/images/get-images`)
            .then((res) => {
                setImages(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.warn(err);
            });
    };

    const getInteresting = () => {
        axios
            .get(`/interesting/get-all`, {headers: {'x-auth-token': accessToken}})
            .then((response) => {
                setInteresting(response.data);
            })
            .catch((error) => {
                console.error('Error fetching settings:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openStories = () => {
        dispatch(hideCart());
        setOpen(true);
    };

    const closeStories = () => {
        dispatch(showCart());
        setOpen(false);
    };

    const handleClickInteresting = useCallback(async (obj) => {
        setClickedInterestingCard(obj);

        try {
            const storiesImages = images.filter((image) => image.name.includes(obj.id) && image.isMainImage === false);

            if (storiesImages.length > 0) {
                setStories(storiesImages.map((img) => `${API_URL_IMAGES}${img.name}`));
                openStories();
            }
        } catch (error) {
            console.error('Error handling interesting click:', error);
        }
    }, [images, API_URL_IMAGES, openStories]);

    const fetchData = useMemo(() => async () => {
        try {
            dispatch(setSelectedCategory(null));
            await dispatch(fetchProducts({limit: 10}));
            getInteresting();
            fetchImages();
            getIsInteresting();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }, [dispatch]);

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
        )), [interesting, isLoading, images, handleClickInteresting]);

    return (
        <>
            <div>
                <div className='block md:hidden'>
                    <Header/>
                </div>
                <div className={`bg-white pt-1 px-3 lg:px-5 pb-3 sticky top-0 z-[2] lg:pt-3 lg:rounded-t-3xl`}>
                    <Search/>
                </div>

                <div className={`bg-white ${isInteresting ? 'block' : 'hidden'} rounded-b-3xl px-3 lg:px-5 pt-3 z-[1]`}>
                    <span className='text-2xl lg:text-3xl font-black'>Это интересно</span>
                    <div className='grid grid-cols-3 pt-3 gap-2 w-full pb-6'>
                        {interestingCards}
                    </div>
                </div>
                <div className='lg:hidden'>
                    <div className='flex mx-3 lg:mx-5 justify-between'>
                        <span className='text-2xl mb-1 font-black'>Категории</span>
                        <Button
                            onClick={() => navigate('/search')}
                            size='sm'
                            variant='flat'
                            endContent={<FaChevronRight/>}
                            className='text-md font-semibold bg-neutral-200/60'
                        >
                            Все
                        </Button>
                    </div>
                    <div className='mt-3'>
                        <CategoriesList display={'flex'}/>
                    </div>
                </div>
                <div className={`bg-white lg:mt-5 rounded-3xl pt-5`}>
                    <span className='text-2xl lg:text-3xl mx-3 lg:mx-5 font-black'>Часто покупают</span>
                    <div className='pb-10'>
                        {isMobile ? <ProductList isHome={true} display='flex'/> : <ProductList isHome={true}/>}
                    </div>
                </div>
            </div>
            <ModalWindow scrollBehavior={'normal'} size={isMobile ? 'full' : 'xl'} onClose={closeStories}
                         isStories={true} isOpen={open}>
                <div className={`${isMobile && 'grid place-items-center place-content-center'}`}>
                    <Stories
                        stories={stories}
                        defaultInterval={10000}
                        width={isMobile ? '100vw' : 480}
                        height={'100%'}
                        storyContainerStyles={{
                            borderRadius: '15px',
                            overflowX: 'hidden',
                            overflowY: 'hidden',
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
