import React, {useEffect, useRef, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {fetchProducts} from '../../redux/slices/productSlice';
import {BsSearch} from 'react-icons/bs';
import {useNavigate} from 'react-router-dom';
import {TiDelete} from 'react-icons/ti';
import CategoriesList from '../components/CategoriesList';
import ProductList from '../components/ProductList';
import {ScrollShadow} from '@nextui-org/react';

function Search() {
    const products = useSelector((state) => state.products);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const [isScroll, setIsScroll] = useState(false);
    const productsItems = products.products.items;
    const inputRef = useRef(null);

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
        dispatch(fetchProducts());
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

    return (
        <div
            onScroll={handleScroll}
            className='lg:w-full'
        >
            <div
                className={`bg-white w-full rounded-b-3xl z-[1] h-20 pt-5 pb-10 fixed md:sticky top-0`}
            >
                <div className='relative w-1/1 px-5 flex'>
                    <div
                        className='absolute inset-y-0 transform pl-2 translate-x-3 flex items-center pointer-events-none'>
                        <BsSearch className='text-xl'/>
                    </div>
                    {searchQuery.length !== 0 && (
                        <div className='absolute inset-y-0 right-[110px] transform translate-x-3 flex items-center'>
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

                    <span
                        onClick={goBack}
                        className=' text-lg ml-2.5 font-semibold -mt-1 normal-case flex justify-center items-center'
                    >
						Отмена
					</span>
                </div>
            </div>
            {searchQuery.length < 2 && (
                <div className='pt-20 px-5 lg:hidden'>
                    <CategoriesList isSearch={true}/>
                </div>
            )}

            <div className='bg-white pt-20 rounded-b-3xl relative lg:h-screen'>
                {searchQuery.length > 2 && (
                    <div>
                        {productsItems.length === 0 ? (
                            <div
                                className='text-center text-xl mt-4'>{`По запросу ${searchQuery} ничего не найдено`}</div>
                        ) : (
                            <ScrollShadow className=''>
                                <ProductList display='grid'/>
                            </ScrollShadow>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;
