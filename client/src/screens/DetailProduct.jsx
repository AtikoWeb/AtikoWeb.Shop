import React, {useEffect, useMemo, useState} from 'react';
import {IoCloseSharp} from 'react-icons/io5';
import {addToCart, showCart} from '../../redux/slices/cartSlice';
import {useDispatch} from 'react-redux';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Spinner,} from '@nextui-org/react';
import axios from '../../axios';
import {Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {useLocation, useNavigate} from "react-router-dom";
import {GiRoundStar} from "react-icons/gi";
import {LuStarOff} from "react-icons/lu";
import Cookies from "js-cookie";
import {FilePond, registerPlugin} from "react-filepond";
import {fetchImages} from "../../redux/slices/imageSlice.js";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

function DetailProduct({
                           close = () => {
                           }, images, id, settingsDBcode, isUpload
                       }) {
    const [count, setCount] = useState(1);
    const [sizes, setSizes] = useState([]);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const dispatch = useDispatch();
    const token = process.env.REACT_APP_API_TOKEN;
    const [barcodes, setBarcodes] = useState([]);
    const [sizeNames, setSizeNames] = useState([]);
    const [activeSize, setActiveSize] = useState();
    const [activeBarcode, setActiveBarcode] = useState(barcodes[0]);
    const [page, setPage] = useState(1);
    const [updateKey, setUpdateKey] = useState(0);
    const location = useLocation();
    const rowsPerPage = 1; // Одно изображение на странице
    const [product, setProduct] = useState({id: '', productId: '', name: '', art: '', price: 0, desc: '',});
    const API_URL = process.env.REACT_APP_API_URL;
    const accessToken = process.env.REACT_APP_API_TOKEN;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const currentDomain = window.location.hostname === 'localhost' ? process.env.REACT_APP_DOMAIN : window.location.hostname;
    const db_code = Cookies.get('db_code') || settingsDBcode;
    const API_URL_IMAGES = `https://${currentDomain}/api/images/${db_code}/images/`;
    const [rating, setRating] = useState(0);
    const [reviewsLength, setReviewsLength] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    registerPlugin(FilePondPluginImagePreview);

    const selectSize = (size) => {
        setActiveSize(size);
    };

    const handleInitOne = () => {
        console.log('FilePond is ready');
    };

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

    const handleClickSetMainImage = async (name) => {
        setIsLoading(true);
        try {
            await axios.put('/images/set-main-image/', {
                name: name, // передача параметра напрямую, без обертки в data
            }, {
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


    const handleClose = () => {

        close();

    }

    const formatItems = (count) => {
        const cases = [2, 0, 1, 1, 1, 2];
        const titles = ['отзыв', 'отзыва', 'отзывов'];

        const titleIndex =
            count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)];

        const formattedCount = `${count}`;
        const formattedTitle = titles[titleIndex];

        return (
            <span className={'text-[16px]'}>
				{formattedCount}
                <span className='pl-1.5'>{formattedTitle}</span>
			</span>
        );
    };


    const regex = new RegExp(`^${product.art}_`);
    const imageList = useMemo(() => images.filter((image) => regex.test(image.name)), [images, product.art]);


    useEffect(() => {
        setIsLoading(true);
        axios
            .get(`/product/products/${id}`, {
                headers: {
                    'x-auth-token': token
                },
                params: {
                    db_code
                }
            })
            .then((res) => {
                setSizes(res.data.sizes);
                setProduct(res.data.product);
                setRating(res.data.product.rating);
                setReviewsLength(res.data.reviewsLength);
                setIsLoading(false);
            })
            .catch((err) => {
                console.warn(err);
            });
    }, [id, token]);

    useEffect(() => {
        if (sizes.length > 0) {
            setActiveSize(sizes[0]);
        }
    }, [sizes]);

    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        setCount(count - 1);
    };

    useEffect(() => {
        const sizNamesList = sizes.map((obj) => {
            return obj.sizeName;
        });
        setSizeNames(sizNamesList);

        const barcodeList = sizes.map((obj) => {
            return obj.barcode;
        });
        setBarcodes(barcodeList);
    }, []);


    const cartItem = {
        productId: product?.productId,
        name: product?.name,
        price: product?.price,
        image: `${API_URL_IMAGES}${imageList.length > 0 && imageList[0].name}`,
        qty: count,
        size: activeSize,
    };

    console.log(activeSize);

    // Функция добавления
    const add = () => {
        dispatch(addToCart({...cartItem}));
        dispatch(showCart());
        handleClose();
        setCount(1);
    };

    useEffect(() => {
        // Сбрасываем updateKey при изменении продукта
        setUpdateKey(0);
    }, [product]);

    const onInit = () => {
        console.log('lightGallery has been initialized');
    };


    if (isLoading) {
        return (<div className={'flex justify-center items-center h-40'}><Spinner/></div>)
    }

    if (isUpload) {
        return (
            <div className='mb-24 grid w-full'>
                <div className='mx-auto'>
                    <div className='mx-5 mt-6 grid'>
                                                        <span
                                                            className='text-3xl font-black'>{product?.name}</span>
                        <span
                            className='text-lg mb-2 text-center'>{product?.art}</span>
                    </div>
                    <div
                        className='absolute cursor-pointer right-1.5 top-2 bg-white/[.8] backdrop-blur-md p-2 shadow-large rounded-full'
                        onClick={handleClose}
                    >
                        <IoCloseSharp className='text-2xl md:text-3xl'/>
                    </div>
                </div>
                <div
                    className='relative w-full flex gap-5 justify-center rounded-2xl pt-5'>
                    {isLoading ? (
                        <Spinner/>
                    ) : (
                        imageList.map((obj) => (
                            <>
                                <Dropdown placement="bottom" key={obj.name}>
                                    <DropdownTrigger>
                                        <div>
                                            <Image
                                                shadow='sm'
                                                radius='lg'
                                                width='100vw'
                                                isLoading={imageList.length <= 0}
                                                src={`${API_URL_IMAGES}${obj.name}`}
                                                className={`w-[400px] relative cursor-pointer z-0 object-cover h-[350px]`}

                                            />

                                            {obj.isMainImage === true && imageList.length > 1 ?
                                                <div
                                                    className='absolute top-0 bg-white  shadow-xl backdrop-blur-sm p-5 rounded-2xl gap-2 grid place-content-center place-items-center font-semibold'>
                                                        <span
                                                            className='text-lg font-bold'>Главная</span>
                                                </div> :
                                                ''
                                            }
                                        </div>

                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Static Actions">
                                        <DropdownItem
                                            className={`${imageList.length < 2 && 'hidden'}`}
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


                            </>

                        ))
                    )}
                </div>


                <div className={'mt-10'}>

                    {imageList.length < 3 ? (
                        <>
                            <div>
                                <FilePond
                                    server={{
                                        process: {
                                            url: `https://${currentDomain}/api/client/upload-images/product?id=${product.productId}&db_code=${db_code}`,
                                        },
                                    }}
                                    name='images'
                                    labelFileProcessing='Загрузка'
                                    labelFileProcessingComplete='Изображение успешно загружено!'
                                    labelTapToCancel='Нажмите чтобы отменить'
                                    labelFileProcessingError='Ошибка! Изображение не загружено!'
                                    labelTapToRetry='Нажмите чтобы попробовать заново'
                                    maxFiles={3}
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
                                        dispatch(fetchImages({settingsDBcode: db_code}));
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
        )
    }


    return (
        <>


            {isMobile ? (
                <div className='mb-24 z-10 bg-neutral-100 w-screen relative'>

                    <div className={'bg-fixed bg-neutral-100 relative'}>
                        {imageList.length === 0 ?
                            <div
                                className={'w-screen grid place-items-center place-content-center h-[450px]'}>
                                <Image
                                    shadow='none'
                                    radius='none'
                                    className='w-screen rounded-t-2xl h-full'
                                    src={`/not_img.jpg`}
                                />
                            </div> : (
                                <>
                                    <Swiper
                                        pagination={{
                                            dynamicBullets: true,
                                        }}
                                        modules={[Pagination]}
                                        slidesPerView={1}


                                    >

                                        {imageList.map((obj, index) => (
                                            <SwiperSlide>
                                                <Image
                                                    key={obj.name}
                                                    shadow='none'
                                                    radius={'none'}
                                                    isLoading={imageList.length <= 0}
                                                    className={`w-screen rounded-t-2xl h-[400px]`}
                                                    src={`${API_URL_IMAGES}${obj.name}`}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </>)}

                    </div>

                    <div className='mx-auto'>
                        <div
                            className='fixed mt-3 z-10 top-2 left-2 bg-white shadow-xl backdrop-blur-sm p-5 rounded-2xl grid place-items-center place-content-center font-semibold'>
                            {product?.brand?.name &&
                                <>
                             <span className='text-lg font-bold'>{product?.brand?.name}
                                </span>
                                </>
                            }
                            <span className='text-md text-neutral-500 font-bold'>{product.art}</span>
                        </div>
                    </div>

                    <div
                        className='fixed z-10 mt-3 right-1.5 p-3 top-2 bg-white backdrop-blur-sm shadow-2xl shadow-black rounded-full'
                        onClick={handleClose}
                    >
                        <IoCloseSharp className='text-2xl'/>
                    </div>

                    <div className={'bg-white rounded-2xl pt-3'}>
                        <div className='mx-3 flex justify-between'>
                            <span className='text-[22px] font-black'>{product?.name}</span>
                        </div>

                        <div className={'flex gap-3 px-3 w-full'}>
                            <div
                                className={'bg-neutral-100 w-full rounded-xl h-14 px-3 mt-4 flex justify-between items-center'}>
                            <span className='text-[26px] font-black'>
								{product?.price
                                    .toString()
                                    .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}{' '}
                                <span className='text-[23px]'>₸</span>
							</span>

                            </div>

                            <div
                                onClick={rating === 0 ? '' : () => navigate(`/detailview/${product.id}/reviews`)}
                                className={'bg-neutral-100 rounded-xl h-14 pt-[2px] px-10 mt-4 grid place-items-center'}>
                                <div className={'flex gap-2 -mt-1 w-24 font-bold justify-center items-center'}>

                                    {reviewsLength === 0 ? (
                                        <LuStarOff className={'text-amber-400 text-2xl'}/>
                                    ) : <GiRoundStar className={'text-amber-400 text-2xl'}/>}


                                    <span className={'pt-1 text-[22px]'}>
                                  {rating}
                              </span>
                                </div>
                                <span className={'text-[14px] -mt-2.5'}>
                                   {reviewsLength === 0 ? 'нет отзывов' : formatItems(reviewsLength)}
                                </span>
                            </div>
                        </div>


                        <div className={`${sizes.length === 0 && 'hidden'} mt-4 `}>

                            <span className='font-semibold mx-3 text-black/70 text-lg'>Размеры</span>

                            <div
                                className={'mt-1.5 px-3 flex overflow-scroll scrollbar-hide gap-5'}
                            >

                                {sizes.map((obj) => (
                                    <>
                                        <Button
                                            onClick={() => selectSize(obj)}
                                            color={activeSize === obj && 'primary'}
                                            variant={"bordered"}
                                            size={"lg"}
                                        >
                                            {obj.sizeName}
                                        </Button>
                                    </>
                                ))}
                            </div>
                        </div>

                        {product.desc && (
                            <>
                                <div className='mt-1'>
                                    <div className={`px-3 w-full`}>
                                        <div className='grid mt-5'>
                                            <span className='font-black text-black/70 text-xl'>Описание</span>
                                            {product.desc.split('\n').map((line, index) => (
                                                <React.Fragment key={index}>
                                                    {line}
                                                    <br/>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}


                        <div className='fixed bottom-0 p-3 w-full bg-white/[.8] flex justify-between'>
                            <div className='flex gap-3 pr-3'>
                                <Button
                                    size='md'
                                    className='btn normal-case text-lg mt-1 disabled:bg-gray-100 flex-1'
                                    onClick={decrement}
                                    disabled={count === 1 && true}
                                >
                                    -
                                </Button>
                                <span className='mt-3 flex-1 text-center font-bold'>
									{count}
								</span>
                                <Button
                                    size='md'
                                    className='btn normal-case mt-1 text-lg flex-1'
                                    onClick={increment}
                                >
                                    +
                                </Button>
                            </div>

                            <Button
                                onClick={add}
                                color='primary'
                                size='lg'
                                className='btn btn-primary font-bold flex-1 normal-case text-md'
                            >
                                Добавить
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    className='xl:h-[80vh] 2xl:h-[70vh] overflow-x-hidden w-full'>
                    <div
                        className='absolute cursor-pointer right-1.5 top-2 bg-white/[.8] backdrop-blur-md p-2 shadow-large rounded-full'
                        onClick={handleClose}
                    >
                        <IoCloseSharp className='text-2xl md:text-3xl'/>
                    </div>

                    <div className={'flex justify-around w-full'}>
                        <div className='relative mt-5 bg-neutral-100 overflow-hidden rounded-2xl'>
                            {imageList.length === 0 ? (
                                    <Image
                                        shadow='none'
                                        radius='lg'
                                        className='h-[450px]'
                                        src={`/not_img.jpg`}
                                    />
                                )
                                : (
                                    <div className={'w-[400px]'}>
                                        <Swiper
                                            navigation={{
                                                enabled: true,
                                            }}
                                            modules={[Navigation]}
                                            slidesPerView={1}


                                        >
                                            {imageList.map((obj, index) => (
                                                <SwiperSlide className={''}>
                                                    <Image
                                                        key={obj.name}
                                                        shadow='none'
                                                        radius='lg'
                                                        className={'h-[450px]'}
                                                        isLoading={imageList.length <= 0}
                                                        src={`${API_URL_IMAGES}${obj.name}`}
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>)}

                        </div>


                        <div className='w-[550px]'>
                            <div className='mx-5 mt-6 grid'>
                                <span className='text-3xl w-96 font-black'>{product?.name}</span>
                                <div className={'flex w-80 gap-1'}>

                             <span className='text-lg mb-2'>{product?.brand?.name}
                                </span>
                                    <span className='text-lg mb-2'>{product?.art}</span>
                                </div>
                                <div className='flex gap-3'>
								<span className='text-3xl pt-1 font-black'>
									{product.price
                                        .toString()
                                        .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}{' '}
                                    <span className='text-2xl'>₸</span>
								</span>
                                    <div className='px-5 bg-white/[.8] flex'>
                                        <div className='flex pt-1 gap-3 pr-3'>
                                            <Button
                                                size='sm'
                                                className='btn normal-case text-lg disabled:bg-gray-100'
                                                onClick={decrement}
                                                disabled={count === 1 && true}
                                            >
                                                -
                                            </Button>
                                            <span className='mt-1 text-center font-bold'>{count}</span>
                                            <Button
                                                size='sm'
                                                className='btn normal-case text-lg'
                                                onClick={increment}
                                            >
                                                +
                                            </Button>
                                        </div>

                                        <Button
                                            onClick={add}
                                            color='primary'
                                            className='font-bold normal-case text-md'
                                        >
                                            Добавить
                                        </Button>
                                    </div>
                                </div>
                                <hr className='mt-5'/>

                                <div
                                    onClick={rating === 0 ? '' : () => navigate(`/detailview/${product.id}/reviews`)}
                                    className={'bg-neutral-100 cursor-pointer hover:!bg-neutral-200 rounded-xl h-14 pt-[2px] px-10 mt-4 grid place-items-center'}>
                                    <div className={'flex gap-2 -mt-1 w-24 font-bold justify-center items-center'}>

                                        {reviewsLength === 0 ? (
                                            <LuStarOff className={'text-amber-400 text-2xl'}/>
                                        ) : <GiRoundStar className={'text-amber-400 text-2xl'}/>}


                                        <span className={'pt-1 text-[22px]'}>
                                  {rating}
                              </span>
                                    </div>
                                    <span className={'text-[14px] -mt-2.5'}>
                                   {reviewsLength === 0 ? 'нет отзывов' : formatItems(reviewsLength)}
                                </span>
                                </div>


                                <div className={sizes.length === 0 && 'hidden'}>
                                    <div className='pb-3 pt-5'>
                                        <span className='font-bold text-xl'>Выберите размер</span>
                                    </div>
                                    <div
                                        className={'mt-1 grid grid-cols-4 gap-5'}
                                    >

                                        {sizes.map((obj) => (
                                            <>
                                                <Button
                                                    onClick={() => selectSize(obj)}
                                                    color={activeSize === obj && 'primary'}
                                                    className={`px-3`}
                                                    variant={"bordered"}
                                                    size={"lg"}
                                                >
                                                    {obj.sizeName}
                                                </Button>
                                            </>
                                        ))}
                                    </div>
                                </div>


                                {product.desc && (
                                    <>
                                        <hr className={`mt-5 ${sizes.length === 0 ? 'block' : 'hidden'}`}/>
                                        <div
                                            className={`scrollbar-hide`}
                                        >
                                            <div
                                                className={`grid ${sizes.length === 0 ? 'block' : 'hidden'} mt-5`}>
                                                <span className='font-bold text-xl'>Описание</span>
                                                <span
                                                    className='text-lg mb-2'>
                                                {product.desc.split('\n').map((line, index) => (
                                                    <React.Fragment key={index}>
                                                        {line}
                                                        <br/>
                                                    </React.Fragment>
                                                ))}
                                            </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>


                    {product.desc && sizes.length !== 0 && (
                        <>
                            <div className={`border-t-1.5 mt-5 z-10 left-5`}>
                                <div
                                    className={`px-5 w-full scrollbar-hide`}
                                >
                                    <div className={`grid ${sizes.length === 0 ? 'hidden' : 'block'} mt-3`}>
                                        <span className='font-bold text-xl'>Описание</span>
                                        <span
                                            className='text-lg mb-2'>
                                                 {product.desc.split('\n').map((line, index) => (
                                                     <React.Fragment key={index}>
                                                         {line}
                                                         <br/>
                                                     </React.Fragment>
                                                 ))}
                                            </span>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                </div>
            )
            }
        </>
    )

}

export default DetailProduct;
