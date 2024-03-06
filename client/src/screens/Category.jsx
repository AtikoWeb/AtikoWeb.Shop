import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {IoIosArrowBack} from 'react-icons/io';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProducts} from '../../redux/slices/productSlice';
import {Button} from '@nextui-org/react';
import ProductList from '../components/ProductList';
import {setSelectedCategory} from '../../redux/slices/categorySlice';
import Filter from '../components/Filter.jsx';
import {BottomSheet} from 'react-spring-bottom-sheet';
import ModalWindow from "../components/Modal.jsx";

function Category() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [isInView, setIsInView] = useState(true);
    const categories = useSelector((state) => state.categories);
    const isCategoriesLoading = categories.categories.status === 'loading';
    const isCategoriesError = categories.categories.status === 'error';
    const CategoriesItems = useMemo(() => categories.categories.items?.category, [categories.categories.items]);
    const [category, setCategory] = useState({id: '', name: ''});

    useEffect(() => {
        dispatch(setSelectedCategory(id));
    }, [dispatch, id]);

    useEffect(() => {
        const storedFilters = JSON.parse(localStorage.getItem('filters')) || {};

        const {checkedFilter, selectedBrands, priceValue} = storedFilters;
        const sort = checkedFilter || 'popular';
        const minPrice = priceValue ? priceValue[0] : 0;
        const maxPrice = priceValue ? priceValue[1] : 250000;
        const brandIds = selectedBrands || [];

        dispatch(fetchProducts({
            categoryId: id,
            sort,
            minPrice,
            maxPrice,
            brandIds
        }));
    }, [dispatch, id]);


    useEffect(() => {
        if (!isCategoriesLoading && !isCategoriesError && CategoriesItems) {
            const foundCategory = CategoriesItems.find((obj) => obj.id === id);
            setCategory(foundCategory || {id: '', name: ''});
        }
    }, [isCategoriesLoading, isCategoriesError, CategoriesItems, id]);

    const goBack = () => {
        navigate(-1);
        dispatch(fetchProducts());
        localStorage.removeItem('filters');
    };


    const clickFilter = () => {
        setIsOpen(true);
    };


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='overflow-x-hidden lg:mr-5 xl:mr-0'>
            {CategoriesItems && (

                <div
                    className={`flex lg:sticky bg-white/[.5] backdrop-blur-lg fixed top-0 justify-between z-[2] h-16 rounded-xl bg-white w-full items-center`}
                >
                    <Button
                        size='sm'
                        className='normal-case -ml-2 bg-transparent flex justify-start'
                        onClick={goBack}
                    >
                        <IoIosArrowBack className='text-4xl'/>
                    </Button>
                    <span className={`text-xl font-bold flex`}>
                        {category && category.name}
                    </span>
                    <Button size='sm' className='bg-transparent -mr-1' onClick={clickFilter}>
                        <svg
                            width='30px'
                            height='30px'
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path d='M10 8L20 8' stroke='#222222' strokeLinecap='round' strokeWidth='1.5'/>
                            <path d='M4 16L14 16' stroke='#222222' strokeLinecap='round' strokeWidth='1.5'/>
                            <ellipse
                                cx='7'
                                cy='8'
                                rx='3'
                                ry='3'
                                transform='rotate(90 7 8)'
                                stroke='#222222'
                                strokeLinecap='round'
                                strokeWidth='1.5'
                            />
                            <ellipse
                                cx='17'
                                cy='16'
                                rx='3'
                                ry='3'
                                transform='rotate(90 17 16)'
                                stroke='#222222'
                                strokeLinecap='round'
                                strokeWidth='1.5'
                            />
                        </svg>
                    </Button>
                </div>
            )}
            <div className='mt-20 lg:mt-8'>
                <div className='mb-10'>
                    <ProductList getMore={true} display='grid'/>
                </div>
            </div>
            {isMobile ?
                <BottomSheet
                    open={isOpen}
                    onDismiss={() => setIsOpen(false)}
                    defaultSnap={({maxHeight}) => maxHeight / 40}
                    snapPoints={({maxHeight}) => [
                        maxHeight - maxHeight / 40,
                        maxHeight - maxHeight / 40,
                    ]}
                    header={false}
                    draggable={true}
                >
                    <Filter close={() => setIsOpen(false)}/>
                </BottomSheet>
                :
                <ModalWindow
                    size={'xl'}
                    scrollBehavior={'outside'}
                    isOpen={isOpen}
                    children={<Filter close={() => setIsOpen(false)}
                    />}/>}
        </div>
    );
}

export default Category;
