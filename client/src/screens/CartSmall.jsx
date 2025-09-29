import React, {useEffect, useState} from 'react';
import {IoIosArrowBack} from 'react-icons/io';
import {TbTrashX} from 'react-icons/tb';
import {useNavigate} from 'react-router-dom';
import CartItem from '../components/CartItem';
import {useDispatch, useSelector} from 'react-redux';
import {removeAll} from '../../redux/slices/cartSlice';
import {Button, ScrollShadow, Spinner} from '@nextui-org/react';
import ModalWindow from '../components/Modal';
import axios from "../../axios.js";
import Cookies from "js-cookie";

function CartSmall() {
    const [isInView, setIsInView] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const itemCount = useSelector((state) => state.cart.count);
    const totalPrice = useSelector((state) => state.cart.totalPrice);
    const items = useSelector((state) => state.cart.items);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isAuth = useSelector((state) => state.user.isAuthenticated);
    const [count, setCount] = useState();
    const userId = useSelector((state) => state.user.userId);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({name: '', email: '', phone: ''});
    const currentDomain = window.location.hostname || process.env.REACT_APP_DOMAIN;
    const db_code = Cookies.get('db_code');
    const ATIKOWEB_URL = localStorage.getItem('AtikowebURL');
    const API_URL = `https://${currentDomain}/api/client/`;

    useEffect(() => {
        const getUser = async () => {
            try {
                const {data} = await axios.get('/user/get-one', {
                    params: {id: userId, db_code},
                });
                setUser({name: data.username, email: data.email, phone: data.phone});
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getUser();
    }, []);

    const goBack = () => {
        navigate(-1);
    };

    const removeCart = () => {
        dispatch(removeAll());
        setIsOpen(false);
    };

    // форматирует количество товаров в виде текста
    const formatItems = (count) => {
        const cases = [2, 0, 1, 1, 1, 2];
        const titles = ['товар', 'товара', 'товаров'];

        const titleIndex =
            count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)];

        const formattedCount = `${count}`;
        const formattedTitle = titles[titleIndex];

        return (
            <span>
				{formattedCount}
                <span className='text-gray-500/[.6] pl-1.5'>{formattedTitle}</span>
			</span>
        );
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const threshold = 41; //порог видимости

            // Проверяем, находится ли элемент в видимой части viewport
            if (scrollY >= threshold) {
                setIsInView(false);
            } else {
                setIsInView(true);
            }
        };

        // Добавляем слушателя события прокрутки страницы
        window.addEventListener('scroll', handleScroll);

        // Убираем слушателя события при размонтировании компонента
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    if (isLoading) {
        return (
            <div className={'flex xl:w-80 justify-center mt-20'}>
                <Spinner/>
            </div>
        )
    }


    if (items.length < 1) {
        return (
            <div className='mx-3 xl:h-[85vh] text-center bg-white h-screen rounded-xl'>
                <div className='flex lg:hidden justify-between z-[2] sticky top-0 h-16 w-full items-center'>
                    <Button
                        onClick={goBack}
                        size='sm'
                        variant='light'
                        className='bg-white normal-case lg:hidden -ml-5 flex justify-star'
                    >
                        <IoIosArrowBack className='text-4xl'/>
                    </Button>
                </div>
                <div className='flex justify-center'>
                    <img
                        src='/emptyCart.png'
                        alt=''
                        className='h-52'
                    />
                </div>
                <div className='grid place-content-center'>
                    <span className={`text-2xl font-bold`}>Корзина пуста</span>
                    <span className={`text-sm flex xl:hidden font-normal`}>
						Вернитесь на главную для добавления товаров
					</span>
                </div>

                <div
                    className='fixed md:relative flex z-[1] xl:hidden right-0 left-0 bottom-0 bg-white font-bold w-screen md:w-full md:shadow-none h-24 shadow-black shadow-2xl px-3 pt-6 rounded-t-2xl'>
                    <Button
                        onClick={() => navigate('/')}
                        color='primary'
                        size='lg'
                        className='btn btn-primary btn-block font-bold flex-1 normal-case text-lg'
                    >
                        Вернуться на главную
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='md:pb-0 relative xl:h-[80vh] pb-5 bg-white xl:rounded-2xl'>
                <div
                    className={`flex justify-between z-[2] lg:sticky ${
                        !isInView && 'bg-white rounded-2xl shadow-black/20 shadow-2xl lg:shadow-none'
                    } fixed top-0 h-16 w-full items-center`}
                >
                    <Button
                        onClick={goBack}
                        size='sm'
                        className='bg-transparent lg:hidden -ml-2'
                    >
                        <IoIosArrowBack className='text-4xl'/>
                    </Button>

                    <span className={`text-xl lg:pl-3 font-bold hidden lg:flex`}>
						Мой заказ
					</span>
                    <span
                        className={`text-xl font-bold ${
                            isInView || !isMobile ? 'hidden' : 'flex'
                        }`}
                    >
						Мой заказ
					</span>
                    <div className=''>
                        <Button
                            size='sm'
                            className='bg-transparent'
                            onClick={() => setIsOpen(true)}
                        >
                            <TbTrashX className='text-4xl cursor-pointer'/>
                        </Button>
                    </div>
                </div>
                <div className='w-full px-3 mb-5 md:hidden mt-20 flex justify-between'>
                    <span className='text-3xl font-bold w-80'>Мой заказ</span>
                </div>
                <div className='w-full px-3 md:overflow-y-scroll scrollbar-hide'>
                    <ScrollShadow
                        hideScrollBar
                        className='w-full lg:h-[80vh] md:pb-36 mt-3 pb-36'
                    >
                        {items.map((obj) => (
                            <>
                                <CartItem isCartSmall={true} item={obj}/>
                            </>
                        ))}
                    </ScrollShadow>
                </div>
            </div>

            <div
                className={`overflow-y-scroll fixed xl:relative bottom-0 xl:bottom-14 z-[1] lg:shadow-none shadow-2xl shadow-black right-0 left-0 pb-5 font-bold bg-white xl:rounded-2xl px-3 pt-5 rounded-t-2xl`}
            >
                <div className='flex justify-between mb-2'>
                    <div className='text-xl'>
                        <span>{formatItems(itemCount)}</span>
                    </div>
                    <span className='text-xl'>
						{totalPrice
                            .toString()
                            .replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}{' '}
                        <span className='text-gray-500/[.6]'>₸</span>
					</span>
                </div>

                <div className='w-full flex'>
                    <Button
                        onClick={() => navigate('/cart')}
                        color='primary'
                        size='lg'
                        className='btn p-7 btn-primary font-bold flex-1 normal-case text-lg'
                    >
                        Перейти в корзину
                    </Button>
                </div>
            </div>


            <ModalWindow
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                size='xl'
                scrollBehavior={isMobile ? 'normal' : 'outside'}
                children={
                    <div className='mx-3 mt-3 mb-5'>
                        <div className='grid mb-5'>
								<span className='text-2xl font-bold'>
									Удалить всю корзину ?
								</span>
                        </div>

                        <div className='grid gap-3'>
                            <div className='w-full bg-white/[.8] flex'>
                                <Button
                                    size='lg'
                                    onClick={removeCart}
                                    className='font-bold bg-red-500 text-white flex-1 normal-case text-lg'
                                >
                                    Удалить
                                </Button>
                            </div>
                            <div className='w-full bg-white/[.8] flex'>
                                <Button
                                    size='lg'
                                    color={"primary"}
                                    variant={"flat"}
                                    onClick={() => setIsOpen(false)}
                                    className='font-bold text-red-500 flex-1 normal-case text-lg'
                                >
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    </div>
                }
            />

        </>
    );
}

export default CartSmall;
