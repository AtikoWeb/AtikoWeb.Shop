import React, {useEffect, useState} from 'react';
import {IoCloseSharp} from 'react-icons/io5';
import {addToCart, showCart} from '../../redux/slices/cartSlice';
import {useDispatch} from 'react-redux';
import {Button, Image, Radio, RadioGroup, ScrollShadow, Spinner,} from '@nextui-org/react';
import axios from '../../axios';
import {Navigation, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {useLocation, useNavigate, useParams} from "react-router-dom";


function DetailProduct({
                           close = () => {
                           }, desktopProduct, images
                       }) {
    const [count, setCount] = useState(1);
    const {id} = useParams();
    const [newImages, setNewImages] = useState(images || []);
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
    const [product, setProduct] = useState({productId: '', name: '', art: '', price: 0, desc: '',});
    const [imageList, setImageList] = useState([]);
    const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;
    const API_URL = process.env.REACT_APP_API_URL;
    const accessToken = process.env.REACT_APP_API_TOKEN;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);


    const selectSize = (size) => {
        setActiveSize(size);
    };

    const fetchImages = async () => {
        try {
            const {data} = await axios.get('/images/get-images/', {
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });

            setNewImages(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClose = () => {

        navigate(-1);

    }


    useEffect(() => {
        const filteredImages = newImages.filter((image) => image.name.includes(`${product.art}`));
        setImageList(filteredImages);
    }, [newImages, product.art]);

    const image = imageList.length > 0 && imageList[0].name;


    useEffect(() => {
        setIsLoading(true);
        axios
            .get(`/product/products/${id ? id : desktopProduct.productId}`, {
                headers: {
                    'x-auth-token': token
                },
            })
            .then((res) => {
                setSizes(res.data.sizes);
                setProduct(res.data.product);
                setIsLoading(false);
                fetchImages();
            })
            .catch((err) => {
                console.warn(err);
            });
    }, [id, token]);

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
        image: `${API_URL_IMAGES}${image}`,
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
        setNewImages([]);
        // Сбрасываем updateKey при изменении продукта
        setUpdateKey(0);
    }, [product]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) {
        return (<div className={'flex justify-center items-center h-40'}><Spinner/></div>)
    }

    return (
        <>


            {isMobile ? (
                <div className='mb-24 relative'>

                    <div className={'mx-auto'}>
                        {imageList.length === 0 ?
                            <div
                                className={'w-screen grid place-items-center place-content-center h-[450px]'}>
                                <Spinner/>
                            </div> : (
                                <>
                                    <Swiper
                                        pagination={{
                                            dynamicBullets: true,
                                        }}
                                        modules={[Pagination]}
                                        slidesPerView={1}
                                        style={{display: 'flex', overflowX: 'scroll'}}

                                    >

                                        {imageList.map((obj, index) => (
                                            <SwiperSlide className={''}>
                                                <Image
                                                    key={obj.name}
                                                    shadow='none'
                                                    radius='lg'
                                                    isLoading={newImages.length <= 0}
                                                    className='w-screen h-[450px] z-20 pb-10'
                                                    src={`${API_URL_IMAGES}${obj.name}`}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </>)}

                    </div>

                    <div className='mx-auto rounded-2xl'>
                        <div
                            className='fixed z-10 top-2 left-2 bg-white  shadow-xl backdrop-blur-sm p-5 rounded-2xl grid place-items-center place-content-center font-semibold'>
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
                        className='fixed z-10 right-1.5 p-3 top-2 bg-white backdrop-blur-sm shadow-2xl shadow-black rounded-full'
                        onClick={handleClose}
                    >
                        <IoCloseSharp className='text-2xl'/>
                    </div>

                    <div>
                        <div className='mx-3 mt-5 flex justify-between'>
                            <span className='text-xl w-52 font-black'>{product?.name}</span>
                            <span className='text-[20px] text-black font-black'>
								{product?.price
                                    .toString()
                                    .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}{' '}
                                <span className='text-lg'>₸</span>
							</span>
                        </div>

                        <div className={`${sizeNames.length === 0 && ''} mx-3 `}>
                            <RadioGroup
                                size='lg'
                                color='primary'
                                defaultValue='S'
                                orientation='horizontal'
                                className={'mt-5'}
                            >
                                {sizes.map((obj) => (
                                    <>
                                        <Radio
                                            onClick={() => selectSize(obj)}
                                            className='px-3'
                                            value={obj.sizeName}
                                        >
                                            {obj.sizeName}
                                        </Radio>
                                    </>
                                ))}
                            </RadioGroup>
                        </div>

                        <div className='mt-1'>
                            <div className={`px-3 w-full`}>
                                <div className='grid mt-5'>
                                    <span className='font-black text-black/70 text-lg'>Описание</span>
                                    <span className='text-lg text-black/60'>{product.desc}</span>
                                </div>
                            </div>
                        </div>


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
                <div className='mb-24 flex justify-around w-full'>
                    <div className='relative rounded-2xl pt-5'>
                        {imageList.length === 0 ? (<div
                            className={'w-96 grid place-items-center place-content-center h-[450px]'}>
                            <Spinner/>
                        </div>) : (<div className={'w-[500px]'}>
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
                                            className={'h-[500px]'}
                                            isLoading={newImages.length <= 0}
                                            src={`${API_URL_IMAGES}${obj.name}`}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>)}

                    </div>

                    <div
                        className='absolute cursor-pointer right-1.5 top-2 bg-white/[.8] backdrop-blur-md p-2 shadow-large rounded-full'
                        onClick={handleClose}
                    >
                        <IoCloseSharp className='text-2xl md:text-3xl'/>
                    </div>

                    <div className='w-[550px]'>
                        <div className='mx-5 mt-6 grid'>
                            <span className='text-3xl font-black'>{product?.name}</span>
                            <div className={'flex w-60 gap-1'}>

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
                            <hr className='mt-3'/>
                            <div className={sizeNames.length === 0 && ''}>
                                <div className='pb-3 pt-3'>
                                    <span className='font-bold text-xl'>Выберите размер</span>
                                </div>
                                <RadioGroup
                                    size='lg'
                                    color='primary'
                                    defaultValue='S'
                                    orientation='horizontal'
                                >
                                    {sizes.map((obj) => (
                                        <>
                                            <Radio
                                                onClick={() => selectSize(obj)}
                                                className='px-3'
                                                value={obj.sizeName}
                                            >
                                                {obj.sizeName}
                                            </Radio>
                                        </>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                        <hr className='mt-3'/>

                        <ScrollShadow
                            className={`px-5 w-full h-[580px] overflow-y-scroll scrollbar-hide`}
                        >
                            <div className='grid mt-5'>
                                <span className='font-bold text-xl'>Описание</span>
                                <span className='text-lg mb-2'>{product.desc}</span>
                            </div>
                        </ScrollShadow>
                    </div>
                </div>
            )}
        </>
    );
}

export default DetailProduct;
