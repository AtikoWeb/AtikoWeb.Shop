import React, {useEffect, useRef, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {fetchProducts} from '../../redux/slices/productSlice';
import {BsSearch} from 'react-icons/bs';
import {useNavigate} from 'react-router-dom';
import {TiDelete} from 'react-icons/ti';
import CategoriesList from '../components/CategoriesList';
import ProductList from '../components/ProductList';
import {Button, ScrollShadow} from '@nextui-org/react';
import {fetchCategory} from "../../redux/slices/categorySlice.js";

function Search() {
    const products = useSelector((state) => state.products);
    const navigate = useNavigate();
    const images = useSelector(state => state.image.images.items);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const [isScroll, setIsScroll] = useState(false);
    const productsItems = products.products.items;
    const inputRef = useRef(null);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleScroll = () => {
        setIsScroll(window.scrollY > 0);
    };

    const removeQuery = () => {
        setSearchQuery('');
        inputRef.current.focus();
    };

    const goBack = () => {
        navigate(-1);
        removeQuery();
    };

    useEffect(() => {
        localStorage.removeItem('filters');
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (searchQuery.length >= 3) {
            dispatch(fetchProducts({searchQuery: searchQuery}));
        }
        inputRef.current.focus();
    }, [searchQuery]);

    useEffect(() => {
        dispatch(fetchCategory());
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsScroll(scrollTop > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            onScroll={handleScroll}
            className='lg:w-full'
        >
            <div
                className={`bg-white ${
                    isScroll ? 'shadow-black/20 shadow-2xl' : ''} w-full rounded-b-3xl z-10 h-20 pt-5 pb-10 fixed md:sticky top-0`}
            >
                <div className='relative w-1/1 px-5 flex'>
                    <div
                        className='absolute inset-y-0 transform pl-2 translate-x-3 flex items-center pointer-events-none'>
                        <BsSearch className='text-xl'/>
                    </div>
                    {searchQuery.length !== 0 && (
                        <div className='absolute inset-y-0 right-[130px] transform translate-x-3 flex items-center'>
                            <TiDelete
                                onClick={removeQuery}
                                className='text-2xl'
                            />
                        </div>
                    )}
                    <input
                        placeholder='Поиск'
                        ref={inputRef}
                        autoFocus={true}
                        className='bg-neutral-200/60 text-gray-900 focus:outline-none font-semibold text-lg rounded-xl block w-full pl-14 h-10'
                        value={searchQuery}
                        onChange={handleSearch}
                    />

                    <Button
                        variant={"light"}
                        onClick={goBack}
                        className=' text-lg ml-2.5 font-semibold -mt-1 normal-case flex justify-center items-center'
                    >
                        Отмена
                    </Button>
                </div>
            </div>
            {searchQuery.length < 2 && (
                <div className='pt-20 px-5 lg:hidden'>
                    <CategoriesList images={images} isSearch={true}/>
                </div>
            )}

            <div className={`bg-white pb-20 ${isMobile && 'pt-20'} rounded-b-3xl px-3 relative`}>
                {searchQuery.length > 2 && (
                    <div>
                        {productsItems.length === 0 ? (
                            <div
                                className='text-center text-xl mt-4'>{`По запросу ${searchQuery} ничего не найдено`}</div>
                        ) : (
                            <ScrollShadow className=''>
                                <ProductList isSearch={true} display='grid'/>
                            </ScrollShadow>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
