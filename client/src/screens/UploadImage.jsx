import React, {useEffect, useMemo, useState} from 'react';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Spinner,
    Tab,
    Tabs,
} from '@nextui-org/react';
import {useDispatch, useSelector} from "react-redux";
import axios from "../../axios.js";
import ModalWindow from "../components/Modal.jsx";
import {IoCloseSharp} from "react-icons/io5";
import {FilePond, registerPlugin} from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import CategoryCard from "../components/CategoryCard.jsx";
import {fetchProducts} from "../../redux/slices/productSlice.js";
import {useLocation, useNavigate} from "react-router-dom";
import {fetchCategory} from "../../redux/slices/categorySlice.js";
import {fetchImages} from "../../redux/slices/imageSlice.js";
import ProductList from "../components/ProductList.jsx";
import InfiniteScroll from "react-infinite-scroll-component";


const ImageUploadForm = () => {
    const products = useSelector((state) => state.products);
    const [productImages, setProductImages] = useState({});
    const isProductsLoading = products.products.status === 'loading';
    const isProductsError = products.products.status === 'error';
    const productsItems = products.products.items;
    const categories = useSelector((state) => state.categories);
    const isCategoriesLoading = categories.categories.status === 'loading';
    const isCategoriesError = categories.categories.status === 'error';
    const CategoriesItems = categories.categories.items.category;
    const navigate = useNavigate();
    const images = useSelector(state => state.image.images.items);
    const [isOpen, setIsOpen] = useState(false); // Состояние открытия/закрытия боттом-шита
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [clickedProduct, setClickedProduct] = useState({}); // Выбранный продукт
    const [clickedCategory, setClickedCategory] = useState({}); // Выбранный продукт
    const [isLoading, setIsLoading] = useState(true);
    const count = products.products.count;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [limit, setLimit] = useState(10);
    const currentDomain = window.location.hostname === 'localhost' ? process.env.REACT_APP_DOMAIN : window.location.hostname;
    const db_code = queryParams.get('db_code');
    const lowerCase_db_code = db_code.toLowerCase();
    const token = queryParams.get('token');
    const API_URL_IMAGES = `https://${currentDomain}/api/images/${lowerCase_db_code}/images/`;
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const totalCount = products.products.totalCount;
    const hasMore = productsItems.length < totalCount;

    const API_URL = process.env.REACT_APP_API_URL;
    const accessToken = '48199878-7c84-4dae-9480-7e98b5d0f763'

    useEffect(() => {
        dispatch(fetchProducts({settingsDBcode: db_code, limit: 12, page, keepOldItems: true}));
        dispatch(fetchCategory({settingsDBcode: db_code}));
        dispatch(fetchImages({settingsDBcode: db_code}));
    }, [page]);


    useEffect(() => {
        const productImagesMap = {};
        images.forEach(image => {
            const art = image.name.split('_')[1];
            if (!productImagesMap[art]) {
                productImagesMap[art] = [image];
            } else {
                productImagesMap[art].push(image);
            }
        });
        setProductImages(productImagesMap);
    }, [images]);


    const clickProduct = (product) => {
        setClickedProduct(product);
        setIsOpen(true);
    };

    const clickCategory = (category) => {
        setClickedCategory(category);
        setIsOpen(true);
    };

    useEffect(() => {

        if (!token || token !== accessToken) {
            navigate('/');
        }

    }, []);

    registerPlugin(FilePondPluginImagePreview);

    const handleInitTwo = () => {
        console.log('FilePond is ready');
    };

    const handleInitThree = () => {
        console.log('FilePond is ready');
    };

    // const fetchImages = () => {
    //     axios
    //         .get(`/images/get-images`, {
    //             params: {
    //                 db_code
    //             }
    //         })
    //         .then((res) => {
    //             setImages(res.data);
    //             setIsLoading(false);
    //         })
    //         .catch((err) => {
    //             console.warn(err);
    //         });
    // }


    // useEffect(() => {
    //
    //     fetchImages();
    // }, [isLoading]);

    // фильтруем список изображений
    const categoriesImageList = useMemo(() => {
        return images.filter((image) => image.name.includes(`CATEGORY_${clickedCategory.id}`));
    }, [images, clickedCategory]);

    const categoryImage = categoriesImageList.length > 0 && categoriesImageList[0].name;


    const renderCategories = useMemo(() => {
        return (
            <div>
                <div
                    className={`grid gap-3 grid-cols-1`}>
                    {CategoriesItems?.map((category, index) => (
                        <>
                            <CategoryCard
                                name={category.name}
                                id={category.id}
                                isUpload={true}
                                settingsDB_code={lowerCase_db_code}
                                images={images}
                                onClickUpload={() => clickCategory(category)}/>


                        </>
                    ))}
                </div>
            </div>
        );
    }, [CategoriesItems, images]);


    const handleClickDeleteImage = async (name) => {
        setIsLoading(true);
        try {
            await axios.delete('/images/delete-image/', {
                data: {
                    name: name,
                },
                params: {
                    db_code
                }

            });
            setIsLoading(false);
            dispatch(fetchImages({settingsDBcode: db_code}));
        } catch (error) {
            setIsLoading(true);
            console.error(error);
        }
    };


    const scrollToTop = () => {
        window.scrollTo(0, 0)
    }


    return (
        <>
            <div className='overflow-x-hidden'>
                <div
                    className={`bg-white shadow-none mb-1`}
                >
                    <Tabs fullWidth={true} size={"lg"}
                          className={'flex justify-center px-40 mt-5 sticky top-0 right-0 left-0 z-[1]'}>
                        <Tab onClick={scrollToTop} title={'Товары'}>
                            <div className={'container mx-auto mt-5'}>
                                <div>
                                    <div className={''}>
                                        <Tabs
                                            size={"lg"}
                                            className={'flex justify-center sticky top-0 right-0 left-0 z-[1]'}>
                                            <Tab title={'Вручную'}>
                                                <div className={'mt-10'}>
                                                    <InfiniteScroll
                                                        dataLength={productsItems.length}
                                                        next={() => {
                                                            setTimeout(() => {
                                                                setPage(page + 1)
                                                            }, [1000])

                                                        }}
                                                        hasMore={hasMore}
                                                        loader={<div className={'flex justify-center'}><Spinner/>
                                                        </div>}
                                                    >
                                                        <ProductList settingsDBcode={lowerCase_db_code}
                                                                     isUpload={true}/>
                                                    </InfiniteScroll>

                                                    {count >= limit &&
                                                        <Button fullWidth
                                                                size='lg'
                                                                variant={'light'}
                                                                color='primary'
                                                                className='font-bold text-lg'
                                                                onPress={() => setLimit(limit + 10)}>Показать
                                                            больше</Button>}
                                                </div>
                                            </Tab>
                                            <Tab title={'Авто'}>
                                                <div className={'mt-10'}>
                                                    <FilePond
                                                        server={{
                                                            process: {
                                                                url: `https://${currentDomain}/api/client/upload-images/products?db_code=${db_code}`,
                                                            },
                                                        }}
                                                        name='images'
                                                        labelFileProcessing='Загрузка'
                                                        labelFileProcessingComplete='Изображение успешно загружено!'
                                                        labelTapToCancel='Нажмите чтобы отменить'
                                                        labelFileProcessingError='Ошибка! Изображение не загружено!'
                                                        labelTapToRetry='Нажмите чтобы попробовать заново'
                                                        instantUpload={true}
                                                        allowMultiple={true}
                                                        allowImagePreview={false}
                                                        labelIdle={'' +
                                                            '<div class="font-bold flex gap-5 items-center justify-center">' +
                                                            '<span>Перетащите папку с картинками или нажмите</span>' +
                                                            '  <div class="bg-green-500 cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-white">' +
                                                            ' <span style="font-size: 35px; margin-top: -2px; margin-left: 1px">+</span> ' +
                                                            ' </div>  </div>'}
                                                        oninit={handleInitThree}
                                                        allowRevert={false}
                                                        className='my-filezone relative'
                                                        credits={false}
                                                        onprocessfiles={() => {
                                                            // All files are processed, call your fetchImages function here
                                                            dispatch(fetchImages({settingsDBcode: db_code}));
                                                        }}


                                                    />
                                                </div>


                                                <div className={'mt-10 grid'}>
                                                        <span className={'text-3xl font-bold'}>
                                                            Требования!
                                                        </span>
                                                    <span className={'text-2xl mb-5 font-semibold'}>
                                                          Названия файлов должны быть в виде :
                                                        </span>
                                                    <div
                                                        className={'h-fit w-full rounded-xl p-5 bg-warning-100 grid'}>
                                                            <span
                                                                className={'text-xl font-bold'}>Главная картинка</span>
                                                        <span
                                                            className={'text-lg font-normal'}> {'<Артикул товара>_MAIN.<Расширение файла ( png, jpg, jpeg )>'}</span>
                                                        <span
                                                            className={'text-lg font-bold'}> Пример : {'AK-625TD_MAIN.png'}</span>
                                                    </div>

                                                    <div
                                                        className={'mt-5 h-fit w-full rounded-xl p-5 bg-warning-100 grid'}>
                                                            <span
                                                                className={'text-xl font-bold'}>Основные картинки</span>
                                                        <span
                                                            className={'text-lg font-normal'}> {'<Артикул товара>_<Нумерация>.<Расширение файла ( png, jpg, jpeg )>'}</span>
                                                        <div className={'flex'}>
                                                                <span
                                                                    className={'text-lg font-bold'}> Пример : {'AK-625TD_1.png'}</span>
                                                            <span
                                                                className={'text-lg font-bold'}>, {'AK-625_2.png'} и
                                                                так далее...</span>
                                                        </div>
                                                    </div>

                                                </div>
                                            </Tab>
                                        </Tabs>

                                    </div>


                                </div>
                            </div>
                        </Tab>

                        <Tab title={'Категории'}>
                            <div className={'container mx-auto mt-10'}>
                                <div>
                                    {isCategoriesLoading || isCategoriesError ? (
                                        <div className='flex w-screen justify-center items-center'>
                                            <Spinner/>
                                        </div>
                                    ) : (
                                        renderCategories
                                    )}
                                </div>
                                <ModalWindow
                                    isOpen={isOpen}
                                    size='5xl'
                                    children={
                                        <div className='mb-24 grid w-full'>
                                            <div className='mx-auto'>
                                                <div className='mx-5 mt-6 grid'>
                                                        <span
                                                            className='text-3xl font-black'>{clickedCategory?.name}</span>

                                                </div>
                                                <div
                                                    className='absolute cursor-pointer right-1.5 top-2 bg-white/[.8] backdrop-blur-md p-2 shadow-large rounded-full'
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <IoCloseSharp className='text-2xl md:text-3xl'/>
                                                </div>
                                            </div>
                                            <div
                                                className='relative w-full flex gap-5 justify-center rounded-2xl pt-5'>
                                                {categoriesImageList.map((obj) => (
                                                    <>
                                                        <Dropdown placement="bottom" key={obj.name}>
                                                            <DropdownTrigger>
                                                                <Image
                                                                    shadow='sm'
                                                                    radius='lg'
                                                                    width='100vw'
                                                                    isLoading={categoriesImageList.length <= 0}
                                                                    className={`w-[400px] relative cursor-pointer z-0 object-cover h-[350px]`}
                                                                    src={`${API_URL_IMAGES}${obj.name}`}

                                                                />

                                                            </DropdownTrigger>
                                                            <DropdownMenu aria-label="Static Actions">
                                                                <DropdownItem
                                                                    onPress={() => handleClickDeleteImage(obj.name)}
                                                                    key="delete"
                                                                    className="text-danger"
                                                                    color="danger"
                                                                >
                                                                    Удалить
                                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </Dropdown>
                                                    </>

                                                ))}
                                            </div>

                                            <div className={'mt-10'}>
                                                {categoriesImageList.length < 1 ? (
                                                        <>
                                                            <div>
                                                                <FilePond
                                                                    server={{
                                                                        process: {
                                                                            url: `https://${currentDomain}/api/client/upload-images/category?id=${clickedCategory.id}&db_code=${lowerCase_db_code}`,
                                                                            headers: {
                                                                                'x-auth-token': accessToken,
                                                                            },
                                                                        },
                                                                    }}
                                                                    name='images'
                                                                    labelFileProcessing='Загрузка'
                                                                    labelFileProcessingComplete='Изображение успешно загружено!'
                                                                    labelTapToCancel='Нажмите чтобы отменить'
                                                                    labelFileProcessingError='Ошибка! Изображение не загружено!'
                                                                    labelTapToRetry='Нажмите чтобы попробовать заново'
                                                                    maxFiles={1}
                                                                    instantUpload={true}
                                                                    allowMultiple={false}
                                                                    allowImagePreview={false}
                                                                    labelIdle={'' +
                                                                        '<div class="bg-green-500 cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-white">' +
                                                                        '<span style="font-size: 35px; margin-top: -2px; margin-left: 1px">+</span>' +
                                                                        '</div> ' +
                                                                        ''}
                                                                    oninit={handleInitTwo}
                                                                    allowRevert={false}
                                                                    className='my-filezone relative'
                                                                    credits={false}
                                                                    onprocessfiles={() => {
                                                                        // All files are processed, call your fetchImages function here
                                                                        dispatch(fetchImages({settingsDBcode: db_code}));
                                                                    }}


                                                                />
                                                            </div>
                                                        </>
                                                    )
                                                    :
                                                    <div
                                                        className={'bg-red-400 w-full h-20 flex justify-center p-5 items-center rounded-lg'}>
                                                        <span className={'text-lg text-white w-80 font-semibold'}>
                                                           Чтобы установить новое <br/> сначала удалите это изображение!
                                                        </span>
                                                        <Button
                                                            onPress={() => handleClickDeleteImage(categoriesImageList[0].name)}
                                                            className={'bg-white'} variant={'flat'}>Удалить</Button>
                                                    </div>
                                                }


                                            </div>
                                        </div>
                                    }
                                />


                            </div>
                        </Tab>

                    </Tabs>

                </div>

            </div>

        </>
    )

};

export default ImageUploadForm;
