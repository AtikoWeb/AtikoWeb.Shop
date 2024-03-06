import React, {useEffect, useState} from 'react';
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
import ProductCard from "../components/ProductCard.jsx";
import axios from "../../axios.js";
import ModalWindow from "../components/Modal.jsx";
import {IoCloseSharp} from "react-icons/io5";
import {FilePond, registerPlugin} from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import CategoryCard from "../components/CategoryCard.jsx";
import {fetchProducts} from "../../redux/slices/productSlice.js";


const ImageUploadForm = () => {
    const products = useSelector((state) => state.products);
    const isProductsLoading = products.products.status === 'loading';
    const isProductsError = products.products.status === 'error';
    const productsItems = products.products.items;
    const categories = useSelector((state) => state.categories);
    const isCategoriesLoading = categories.categories.status === 'loading';
    const isCategoriesError = categories.categories.status === 'error';
    const CategoriesItems = categories.categories.items.category;
    const [isOpen, setIsOpen] = useState(false); // Состояние открытия/закрытия боттом-шита
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [clickedProduct, setClickedProduct] = useState({}); // Выбранный продукт
    const [clickedCategory, setClickedCategory] = useState({}); // Выбранный продукт
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([]);
    const count = products.products.count;
    const [limit, setLimit] = useState(10);
    const dispatch = useDispatch();

    const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;
    const API_URL = process.env.REACT_APP_API_URL;
    const accessToken = process.env.REACT_APP_API_TOKEN;

    useEffect(() => {
        dispatch(fetchProducts());
    }, []);

    const clickProduct = (product) => {
        setClickedProduct(product);
        setIsOpen(true);
    };

    const clickCategory = (category) => {
        setClickedCategory(category);
        setIsOpen(true);
    };

    registerPlugin(FilePondPluginImagePreview);

    const handleInitOne = () => {
        console.log('FilePond is ready');
    };

    const handleInitTwo = () => {
        console.log('FilePond is ready');
    };

    const handleInitThree = () => {
        console.log('FilePond is ready');
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
    }


    useEffect(() => {

        fetchImages();
    }, [isLoading]);

    // фильтруем список изображений
    const productImageList = images.filter((image) => image.name.includes(`${clickedProduct.art}`));
    const categoriesImageList = images.filter((image) => image.name.includes(`category_${clickedCategory.id}`))


    const renderProducts = () => {
        return (
            <div>
                <div
                    className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4`}>
                    {productsItems.map((product, index) => (
                        <>

                            <ProductCard
                                key={index}
                                art={product.art}
                                name={product.name}
                                price={product.price}
                                productId={product.productId}
                                images={images}
                                category={product.category}
                                onClick={() => clickProduct(product)}
                                isLoading={isLoading}
                                weight={'w-60'}
                                isUpload={true}

                            />
                        </>
                    ))}
                </div>
            </div>
        );
    };

    const renderCategories = () => {
        return (
            <div>
                <div
                    className={`grid gap-3 grid-cols-1`}>
                    {CategoriesItems.map((category, index) => (
                        <>
                            <CategoryCard
                                name={category.name}
                                id={category.id}
                                images={images}
                                onClick={() => clickCategory(category)}/>


                        </>
                    ))}
                </div>
            </div>
        );
    };


    const handleClickDeleteImage = async (name) => {
        setIsLoading(true);
        try {
            await axios.delete('/images/delete-image/', {
                data: {
                    name: name,
                },
            });
            setIsLoading(false);
            fetchImages();
        } catch (error) {
            setIsLoading(true);
            console.error(error);
        }
    };

    const handleClickSetMainImage = async (name) => {
        setIsLoading(true);
        try {
            await axios.put('/images/set-main-image/', {
                name: name, // передача параметра напрямую, без обертки в data
            });
            setIsLoading(false);
            fetchImages();
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
                          className={'flex justify-center sticky top-0 right-0 left-0 z-[1]'}>
                        <Tab onClick={scrollToTop} title={'Товары'}>
                            <div className={'container mx-auto mt-5'}>
                                <div>
                                    {isProductsLoading || isProductsError ? (
                                        <div className='flex w-screen justify-center items-center'>
                                            <Spinner/>
                                        </div>
                                    ) : (
                                        <div className={''}>
                                            <Tabs
                                                size={"lg"}
                                                className={'flex justify-center sticky top-0 right-0 left-0 z-[1]'}>
                                                <Tab title={'Вручную'}>
                                                    <div className={'mt-10'}>
                                                        {renderProducts()}
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
                                                                    url: `https://aokia.kz/api/upload-images/products`,
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
                                                                fetchImages();
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
                                    )}

                                    <ModalWindow
                                        isOpen={isOpen}
                                        size='5xl'
                                        children={
                                            <div className='mb-24 grid w-full'>
                                                <div className='mx-auto'>
                                                    <div className='mx-5 mt-6 grid'>
                                                        <span
                                                            className='text-3xl font-black'>{clickedProduct?.name}</span>
                                                        <span
                                                            className='text-lg mb-2 text-center'>{clickedProduct?.art}</span>
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
                                                    {isLoading ? (
                                                        <Spinner/>
                                                    ) : (
                                                        productImageList.map((obj) => (
                                                            <>
                                                                <Dropdown placement="bottom" key={obj.name}>
                                                                    <DropdownTrigger>
                                                                        <Image
                                                                            shadow='sm'
                                                                            radius='lg'
                                                                            width='100vw'
                                                                            isLoading={productImageList.length <= 0}
                                                                            className={`w-[400px] relative cursor-pointer z-0 object-contain h-[350px]`}
                                                                            src={`${API_URL_IMAGES}${obj.name}?timestamp=${new Date().getTime()}`}

                                                                        />

                                                                    </DropdownTrigger>
                                                                    <DropdownMenu aria-label="Static Actions">
                                                                        <DropdownItem
                                                                            className={`${productImageList.length < 2 && 'hidden'}`}
                                                                            onPress={() => handleClickSetMainImage(obj.name)}
                                                                            isDisabled={obj.isMainImage === true}
                                                                            key="new">Сделать
                                                                            главным
                                                                        </DropdownItem>
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

                                                                {obj.isMainImage === true && productImageList.length > 1 ?
                                                                    <div
                                                                        className='absolute top-5 left-0 bg-white  shadow-xl backdrop-blur-sm p-5 rounded-2xl gap-2 grid place-content-center place-items-center font-semibold'>
                                                        <span
                                                            className='text-lg font-bold'>Главная</span>
                                                                    </div> :
                                                                    ''
                                                                }
                                                            </>

                                                        ))
                                                    )}
                                                </div>


                                                <div className={'mt-10'}>

                                                    {productImageList.length < 3 ? (
                                                        <>
                                                            <div>
                                                                <FilePond
                                                                    server={{
                                                                        process: {
                                                                            url: `https://aokia.kz/api/upload-images/product?id=${clickedProduct.productId}`,
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
                                                                    maxFiles={4}
                                                                    instantUpload={true}
                                                                    allowMultiple={true}
                                                                    allowImagePreview={false}
                                                                    labelIdle={'' +
                                                                        '<div class="bg-green-500 cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-white">' +
                                                                        '<span style="font-size: 35px; margin-top: -2px; margin-left: 1px">+</span>' +
                                                                        '</div> ' +
                                                                        ''}
                                                                    oninit={handleInitOne}
                                                                    allowRevert={false}
                                                                    className='my-filezone relative'
                                                                    credits={false}
                                                                    onprocessfiles={() => {
                                                                        // All files are processed, call your fetchImages function here
                                                                        fetchImages();
                                                                    }}


                                                                />
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div
                                                                className={'bg-red-400 w-full h-20 flex justify-center items-center rounded-lg'}>
                                                                <div className={'grid'}>
                                                            <span className={'text-lg text-white font-semibold'}>
                                                          Максимальное количество изображений : 3
                                                        </span>
                                                                    <span
                                                                        className={'text-md text-white font-normal'}>
                                                                        Чтобы загрузить новое удалите одно!
                                                                </span>
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}

                                                </div>
                                            </div>
                                        }
                                    />


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
                                        renderCategories()
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
                                                {isLoading ? (
                                                    <Spinner/>
                                                ) : (
                                                    categoriesImageList.map((obj) => (
                                                        <>
                                                            <Dropdown placement="bottom" key={obj.name}>
                                                                <DropdownTrigger>
                                                                    <Image
                                                                        shadow='sm'
                                                                        radius='lg'
                                                                        width='100vw'
                                                                        isLoading={categoriesImageList.length <= 0}
                                                                        className={`w-[400px] relative cursor-pointer z-0 object-contain h-[350px]`}
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

                                                    ))
                                                )}
                                            </div>

                                            <div className={'mt-10'}>
                                                {categoriesImageList.length < 1 ? (
                                                        <>
                                                            <div>
                                                                <FilePond
                                                                    server={{
                                                                        process: {
                                                                            url: `https://aokia.kz/api/upload-images/category?id=${clickedCategory.id}`,
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
                                                                        fetchImages();
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
        ;
};

export default ImageUploadForm;
