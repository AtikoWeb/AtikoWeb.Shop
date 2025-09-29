import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {IoIosArrowBack, IoIosArrowForward, IoIosArrowUp} from 'react-icons/io';
import {useDispatch, useSelector} from 'react-redux';
import {fetchProducts, resetProducts} from '../../redux/slices/productSlice';
import {Badge, Button, Chip, Spinner} from '@nextui-org/react';
import ProductList from '../components/ProductList';
import Filter from '../components/Filter.jsx';
import ModalWindow from "../components/Modal.jsx";
import InfiniteScroll from "react-infinite-scroll-component";
import {setSelectedCategory} from "../../redux/slices/categorySlice.js";

function Category() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [isScroll, setIsScroll] = useState(false);
    const categories = useSelector((state) => state.categories);
    const isCategoriesLoading = categories.categories.status === 'loading';
    const isCategoriesError = categories.categories.status === 'error';
    const CategoriesItems = useMemo(() => categories.categories.items?.category, [categories.categories.items]);
    const [category, setCategory] = useState({id: '', name: '', children: []});
    const products = useSelector((state) => state.products);
    const productsItems = products.products.items;
    const totalCount = products.products.totalCount;
    const [page, setPage] = useState(1);
    const isLoading = products.products.status === 'loading'
    const hasMore = productsItems.length < totalCount;
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const containerRefCategory = useRef(null);
    const containerRefProducts = useRef(null);
    const [inView, setInView] = useState(false);

    const [filtersCount, setFiltersCount] = useState(0);
    const [isProgrammaticScrolling, setIsProgrammaticScrolling] = useState(false);

    const updateFiltersCount = (count) => {
        setFiltersCount(count);
    };


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


    useEffect(() => {
        dispatch(setSelectedCategory(id));

        if (category.children && category.children.length > 0) {
            setSelectedCategoryId(category.children[0].id);
        }

    }, [dispatch, id, category]);

    const getProducts = ({page = 1, categoryId = id, limit = 10, keepOldItems = false}) => {
        const filters = JSON.parse(localStorage.getItem('filters')) || {};
        const {checkedFilter, selectedBrands, priceValue} = filters;
        const minPrice = priceValue ? priceValue[0] : 0;
        const maxPrice = priceValue ? priceValue[1] : 250000;
        const sort = checkedFilter || 'popular';
        const brandIds = selectedBrands || [];
        let count = 0;

        dispatch(fetchProducts({
            categoryId,
            sort,
            limit,
            minPrice,
            page,
            maxPrice,
            brandIds,
            keepOldItems,
        }));
    }

    useEffect(() => {
        // Очистка списка продуктов при изменении id
        dispatch(resetProducts());
        // Загрузка новых продуктов с новым id
        getProducts({page: 1, categoryId: id, limit: 10, keepOldItems: false});
    }, [dispatch, id]);


    function findCategoryById(categories, id) {
        for (const category of categories) {
            if (category.id === id) {
                return category; // Если категория найдена, возвращаем её
            } else if (category.children && category.children.length > 0) {
                // Если у категории есть дочерние категории, рекурсивно ищем в них
                const foundChild = findCategoryById(category.children, id);
                if (foundChild) {
                    return foundChild; // Если найдена дочерняя категория, возвращаем её
                }
            }
        }
        return null; // Если категория с заданным id не найдена, возвращаем null
    }


    useEffect(() => {
        if (!isCategoriesLoading && !isCategoriesError && CategoriesItems) {
            const foundCategory = findCategoryById(CategoriesItems, id);
            setCategory(foundCategory || {id: '', name: '', children: []});

        }
    }, [isCategoriesLoading, isCategoriesError, CategoriesItems, id]);

    const goBack = () => {
        navigate(-1);
        localStorage.removeItem('filters');
    };

    const clickFilter = () => {
        setIsOpen(true);
    };

    const scrollCategoryIntoView = (id) => {
        const container = containerRefCategory.current;
        if (container) {
            const categoryElement = container.querySelector(`[data-id="${id}"]`);
            if (categoryElement) {
                categoryElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center',
                });
            }
        }
    };

    const scrollProductsIntoView = (id) => {
        setIsProgrammaticScrolling(true);
        const container = containerRefProducts.current;
        const productsSection = container.querySelector(`[data-subcategory="${id}"]`);
        if (productsSection) {
            const headerHeight = document.getElementById('header').offsetHeight;
            const topPosition = productsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 40;
            window.scrollTo({
                top: topPosition,
                behavior: 'smooth',
            });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!isProgrammaticScrolling) {
                return; // Не выполняем дальнейшие действия, если скроллирует пользователь
            }

            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const container = containerRefProducts.current;
            const productsSection = container.querySelector(`[data-subcategory="${selectedCategoryId}"]`);
            if (productsSection) {
                const headerHeight = document.getElementById('header').offsetHeight;
                const topPosition = productsSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 40;
                const isAtTopPosition = Math.abs(scrollTop - topPosition) <= 10;
                if (isAtTopPosition) {
                    setIsProgrammaticScrolling(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [selectedCategoryId, isProgrammaticScrolling]);


    const onClickSub = (sub = {id: '', name: ''}) => {
        setSelectedCategoryId(sub.id);
        scrollProductsIntoView(sub.id);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset === 0) {
                if (category.children.length > 0) {
                    setSelectedCategoryId(category.children[0].id);
                }
            }
        };

        // Добавляем слушателя события прокрутки окна
        window.addEventListener('scroll', handleScroll);

        // Убираем слушателя события при размонтировании компонента
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [window.pageYOffset]);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);


    useEffect(() => {

        scrollCategoryIntoView(selectedCategoryId);

    }, [selectedCategoryId]);


    return (
        <div className={'relative mx-0 md:mx-2'}>


            <div
                id={'header'}
                className={`grid lg:sticky bg-white ${
                    isScroll ? 'shadow-black/20 shadow-2xl' : ''} fixed top-0 z-[1] pt-3 rounded-xl w-full items-center`}
            >
                <div
                    className={`flex ${category.children && category?.children.length > 0 ? 'h-14' : 'h-10'} justify-between`}>
                    <Button
                        size='sm'
                        className='normal-case md:mt-3 -ml-2 bg-transparent flex justify-start'
                        onClick={goBack}
                    >
                        <IoIosArrowBack className='text-4xl'/>
                    </Button>
                    <span className={`text-xl md:mt-3 font-bold flex`}>
                        {category && category.name}
                    </span>
                    <Badge className={`mr-3 ${filtersCount < 1 && 'hidden'}`} content={filtersCount} size="lg"
                           color="primary">
                        <Button size='sm' className='bg-transparent md:mt-3 -mr-1' onClick={clickFilter}>
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
                    </Badge>

                </div>

                <div ref={containerRefCategory}
                     className={'flex px-3 mb-3 w-12/12 md:w-11/12 gap-3 scrollbar-hide overflow-x-scroll'}>


                    {category && category.children && category.children.length > 0 && isMobile && (
                        <>
                            {category.children.map((obj) => (
                                <>
                                    <Chip data-id={obj.id} onClick={() => onClickSub(obj)}
                                          className={`${selectedCategoryId === obj.id ? 'bg-neutral-600 text-white' : 'bg-neutral-100'} h-10 cursor-pointer grid place-content-center items-center rounded-xl`}>
                                           <span className={'text-center font-semibold w-10 text-[14px]'}>
                                                {obj.name}
                                           </span>
                                    </Chip>
                                </>
                            ))}

                        </>
                    )}
                </div>
            </div>


            <div className={`${category.children && category?.children.length > 0 ? 'mt-32' : 'mt-20'} lg:mt-1`}>

                <div
                    className={`mt-0 overflow-auto ${!isMobile && productsItems.length > 8 ? '' : ''}  lg:mt-5 mx-3`}>

                    <div className={'mt-3'}>

                        <>
                            {category.children && category.children.length === 0 && (
                                <InfiniteScroll
                                    dataLength={productsItems.length}
                                    next={() => {
                                        setTimeout(() => {
                                            getProducts({
                                                page: page + 1,
                                                categoryId: id,
                                                limit: 10,
                                                keepOldItems: true
                                            })
                                        }, [1000])

                                    }}
                                    hasMore={hasMore}
                                    loader={<div className={'flex justify-center mb-20'}><Spinner/></div>}
                                >
                                    <ProductList isLoading={isLoading} display={'grid'}/>

                                </InfiniteScroll>
                            )}
                        </>

                        {isCategoriesLoading ? (
                            <div className={'flex justify-center'}>
                                <Spinner/>
                            </div>
                        ) : (
                            <>
                                <div className={'mt-10 md:mt-0'} ref={containerRefProducts}>
                                    {category.children && (
                                        <>

                                            {category.children.map((obj) => (

                                                <div data-subcategory={`${obj.id}`}
                                                >
                                                    <div
                                                        className={'flex justify-between items-center mb-5'}>
                                                        <span id={'title'} className={'font-bold text-2xl'}>
                                                            {obj.name}
                                                        </span>
                                                        <Button onPress={() => navigate(`/category/${obj.id}`)}
                                                                size={"sm"}
                                                                className={'bg-neutral-100'}>
                                                            Посмотреть все <IoIosArrowForward/>
                                                        </Button>
                                                    </div>


                                                    <ProductList onProductsView={() => {
                                                        if (!isProgrammaticScrolling) {
                                                            setSelectedCategoryId(obj.id)
                                                        }
                                                    }}
                                                                 useReduxProducts={false} marginBottom={'mb-16'}
                                                                 categoryProducts={obj?.product}
                                                                 display={'grid'}/>


                                                    {isScroll && (
                                                        <Button onPress={() => {
                                                            window.scrollTo({
                                                                top: 0,
                                                                behavior: 'smooth',
                                                            });
                                                        }}
                                                                className={'fixed 2xl:right-[400px] bg-neutral-100/40 backdrop-blur-xl right-3 rounded-full h-14 bottom-10'}>
                                                            <IoIosArrowUp className={'text-2xl'}/>
                                                        </Button>
                                                    )}
                                                </div>

                                            ))}


                                        </>
                                    )}

                                </div>
                            </>
                        )
                        }


                    </div>


                </div>


            </div>
            {
                <ModalWindow
                    size={isMobile ? 'full' : 'xl'}
                    scrollBehavior={'outside'}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    closeButtonColor={'bg-neutral-200'}
                    children={
                        <Filter close={() => setIsOpen(false)} filtersCount={filtersCount}
                                onSetFilter={updateFiltersCount}
                        />}/>}
        </div>
    );
}

export default Category;
