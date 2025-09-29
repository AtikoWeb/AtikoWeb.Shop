import React, {useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {Button, Radio, RadioGroup, Spinner} from "@nextui-org/react";
import {IoIosArrowBack} from "react-icons/io";
import {Rating, RoundedStar} from "@smastrom/react-rating";
import '@smastrom/react-rating/style.css'
import axios from "../../axios.js";
import {motion} from "framer-motion";
import {BottomSheet} from "react-spring-bottom-sheet";
import ModalWindow from "../components/Modal.jsx";
import {IoCloseSharp} from "react-icons/io5";
import Cookies from "js-cookie";

function Reviews() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [reviews, setReviews] = useState([]);
    const [checkedFilter, setCheckedFilter] = useState('max');
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const currentDomain = window.location.hostname || process.env.REACT_APP_DOMAIN;
    const db_code = Cookies.get('db_code');
    const [productRating, setProductRating] = useState();


    const variants = [
        {id: 0, name: 'С высоким рейтингом', value: 'max'},
        {id: 1, name: 'С низким рейтингом', value: 'min'},
    ];

    const goBack = () => {
        navigate(-1);
    }

    const fetchData = () => {
        axios
            .get(`/product/get-reviews`, {
                params: {
                    db_code,
                    productId: id,
                    sort: checkedFilter
                }
            })
            .then((res) => {
                setProductRating(res.data.productRating)
                setReviews(res.data.reviews);
                setIsLoading(false);

            })
            .catch((err) => {
                console.warn(err);
            });
    }

    useEffect(() => {
        setIsLoading(true);
        fetchData();
    }, []);

    const submit = () => {
        setIsLoading(true);
        fetchData();
        setIsOpen(false);

    };

    const customStyles = {
        itemShapes: RoundedStar,
        activeFillColor: '#fbbf24',
        inactiveFillColor: '#e5e5e5'
    };

    if (isLoading) {
        return (<div className={'flex justify-center items-center h-40'}><Spinner/></div>)
    }


    return (
        <div>
            <div
                className={`flex lg:sticky bg-white/[.7] backdrop-blur-lg fixed top-0 justify-between z-[2] h-16 rounded-xl bg-white w-full items-center`}
            >
                <Button
                    onPress={goBack}
                    size='sm'
                    className='normal-case -ml-2 bg-transparent flex justify-start'
                >
                    <IoIosArrowBack className='text-4xl'/>
                </Button>
                <span className={`text-xl font-bold flex`}>
                        Отзывы
                    </span>
                <Button onPress={() => setIsOpen(true)} size='sm' className='bg-transparent -mr-1'>
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

            <div className={'mt-20 lg:mt-8 mx-3'}>

                <span className={'text-3xl font-black'}>
                   Рейтинг товара
                </span>


                <div className="flex gap-3 mb-10 items-center mt-1">
                    <Rating
                        style={{maxWidth: 200}}
                        value={productRating}
                        readOnly={true}
                        itemStyles={customStyles}
                    />

                    <span className={'text-3xl font-bold flex gap-5'}>

                        {productRating}
                    </span>

                    <span className={'text-3xl flex gap-3 font-bold'}>
                        <span>
                            /
                        </span>
                        5
                    </span>
                </div>

                {isLoading ? <div className={'flex justify-center items-center h-40'}><Spinner/></div> : (
                    reviews.map((obj) => (
                        <motion.div
                            key='ReviewsCard'
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 1.2, delay: 0.2}}
                        >
                            <div className={'px-3 mb-5 pt-3 pb-5 rounded-xl grid bg-neutral-100'}>
                                <div className={'flex justify-between pb-3'}>
                                    <Rating style={{maxWidth: 100}}
                                            value={obj?.rating}
                                            readOnly={true}
                                            itemStyles={customStyles}
                                    />

                                    <span className={'text-lg font-semibold text-black/30'}>
                         {new Date(obj.createdAt).toLocaleDateString('ru-RU', {
                             month: 'long',
                             day: 'numeric',
                             year: 'numeric',
                         })}
                       </span>
                                </div>
                                <div className={'mb-5'}>
                       <span className={'text-xl font-bold'}>
                            {obj?.user?.username}
                       </span>
                                </div>

                                <div>
                       <span className={'text-lg font-semibold text-black/40'}>
                           Комментарий
                       </span>
                                </div>

                                <div>
                       <span className={'text-lg font-medium text-black'}>
                          {obj.content}
                       </span>
                                </div>
                            </div>
                        </motion.div>

                    ))
                )}


            </div>

            {isMobile ?
                <BottomSheet
                    open={isOpen}
                    onDismiss={() => setIsOpen(false)}
                    defaultSnap={({maxHeight}) => maxHeight / 2}
                    snapPoints={({maxHeight}) => [
                        maxHeight - maxHeight / 2,
                        maxHeight - maxHeight / 2,
                    ]}
                    header={false}
                    draggable={true}
                >
                    <div className='pt-10 mx-3 mb-3'>
                        <span className='text-3xl font-bold'>Показать сначала</span>

                        <div className={'bg-neutral-200 cursor-pointer absolute right-2 top-2.5 p-1 rounded-full'}>
                            <IoCloseSharp
                                className='text-2xl'
                                onClick={() => setIsOpen(false)}
                            /></div>

                        <RadioGroup
                            className={'mx-3 mt-5 mb-5'}
                            value={checkedFilter}
                            defaultValue={'popular'}
                            onValueChange={setCheckedFilter}
                            size={"lg"}
                        >
                            {variants.map((obj) => (
                                <Radio
                                    className={'mb-1'}
                                    size={'lg'}
                                    key={obj.id}
                                    value={obj.value}>{obj.name}
                                </Radio>
                            ))}
                        </RadioGroup>

                        <Button
                            color='primary'
                            fullWidth={true}
                            size='lg'
                            onPress={submit}
                            className='btn btn-primary font-bold flex-1 normal-case text-md'
                        >
                            Применить
                        </Button>
                    </div>
                </BottomSheet>
                :
                <ModalWindow
                    size={'xl'}
                    scrollBehavior={'outside'}
                    isOpen={isOpen}
                    children={
                        <div className='pt-10 mx-3 mb-3'>
                            <span className='text-2xl font-bold'>Сортировка</span>

                            <div className={'bg-neutral-200 cursor-pointer absolute right-2 top-2.5 p-1 rounded-full'}>
                                <IoCloseSharp
                                    className='text-2xl'
                                    onClick={() => setIsOpen(false)}
                                /></div>

                            <RadioGroup
                                className={'mx-3 mt-5 mb-5'}
                                value={checkedFilter}
                                defaultValue={'popular'}
                                onValueChange={setCheckedFilter}
                            >
                                {variants.map((obj) => (
                                    <Radio
                                        className={'mb-1'}
                                        size={'lg'}
                                        key={obj.id}
                                        value={obj.value}>{obj.name}
                                    </Radio>
                                ))}
                            </RadioGroup>

                            <Button
                                color='primary'
                                fullWidth={true}
                                size='lg'
                                onPress={submit}
                                className='btn btn-primary font-bold flex-1 normal-case text-md'
                            >
                                Применить
                            </Button>
                        </div>}/>}
        </div>
    )
}

export default Reviews
