import React, {useEffect, useState} from 'react';
import {IoIosArrowBack} from 'react-icons/io';
import {TbTrashX} from 'react-icons/tb';
import {useNavigate} from 'react-router-dom';
import CartItem from '../components/CartItem';
import {useDispatch, useSelector} from 'react-redux';
import {removeAll} from '../../redux/slices/cartSlice';
import {BottomSheet} from 'react-spring-bottom-sheet';
import {Button, ScrollShadow, Spinner} from '@nextui-org/react';
import ModalWindow from '../components/Modal';
import axios from "../../axios.js";

function Cart() {
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
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const getUser = async () => {
            try {
                const {data} = await axios.get('/user/get-one', {
                    params: {id: userId},
                });
                setUser({name: data.username, email: data.email, phone: data.phone});
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getUser();
    }, []);

    const db_code = process.env.REACT_APP_DB_CODE;

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

    const createOrder = async () => {
        if (isAuth) {
            const order = items.map((obj) => ({
                productId: obj.productId,
                price: obj.price,
                qty: obj.qty,
                sizeId: obj?.size?.sizeId,
                barcode: obj?.size?.barcode,
            }));

            await axios.post('/order/create', {order, db_code})
                .then(async response => {
                    setIsLoading(true);
                    if (response.status === 200) {
                        const fileName = response.data.order;
                        const path = `${API_URL}order/get?orderName=${fileName}`;
                        await axios.get(`https://mpos.atikoweb.ru/?code=${db_code}&action=SITE_NEW_ORDER&fname=${path}&telefon=${user.phone}&email=${user.email}`)
                            .then((anotherResponse) => {
                                if (response.status === 200) {
                                    console.log('Заказ успешно отправлен');
                                    setIsLoading(false);
                                }

                            });
                        console.log('Заказ успешно создан');
                    } else {
                        console.error('Произошла ошибка при выполнении запроса');
                    }
                })
                .catch(error => {
                    console.error('Произошла ошибка:', error);
                });
        } else {
            navigate('/signin');
        }
    };


    if (isLoading) {
        return (
            <div className={'flex xl:w-80 justify-center mt-20'}>
                <Spinner/>
            </div>
        )
    }


    if (items.length < 1) {
        return (
            <div className='mx-3 text-center bg-white h-screen rounded-xl'>
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
            <div className='md:pb-0 pb-5 bg-white rounded-2xl'>
                <div
                    className={`flex justify-between z-[2] lg:sticky ${
                        !isInView && 'bg-white/[.5] backdrop-blur-lg'
                    } fixed top-0  h-16 w-full items-center`}
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
                        className='w-full lg:h-[550px] md:pb-10 mt-3 pb-36'
                    >
                        {items.map((obj) => (
                            <>
                                <CartItem item={obj}/>
                            </>
                        ))}
                    </ScrollShadow>
                </div>
            </div>

            <div
                className={`overflow-y-scroll fixed lg:absolute bottom-0 lg:bottom-14 z-[1] xl:shadow-none shadow-2xl shadow-black right-0 left-0 pb-5 bg-white font-bold h-32 lg:h-40 px-3 pt-5 rounded-t-2xl`}
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
                        onClick={createOrder}
                        color='primary'
                        size='lg'
                        className='btn p-7 btn-primary font-bold flex-1 normal-case text-lg'
                    >
                        Заказать
                    </Button>
                </div>
            </div>

            {isMobile ? (
                <BottomSheet
                    open={isOpen}
                    onDismiss={() => setIsOpen(false)}
                    defaultSnap={({maxHeight}) => maxHeight / 1.5}
                    snapPoints={({maxHeight}) => [
                        maxHeight - maxHeight / 1.5,
                        maxHeight - maxHeight / 1.5,
                    ]}
                    draggable={true}
                >
                    <div className='mx-3 mt-3 mb-5'>
                        <div className='grid mb-5'>
                            <span className='text-2xl font-bold'>Удалить всю корзину ?</span>
                        </div>

                        <div className='grid gap-3'>
                            <div className='w-full bg-white/[.8] flex'>
                                <Button
                                    size={"lg"}
                                    color='primary'
                                    onClick={removeCart}
                                    className='font-bold mx-5 flex-1 normal-case text-lg'
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
                                    className='font-bold flex-1 normal-case text-lg'
                                >
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    </div>
                </BottomSheet>
            ) : (
                <ModalWindow
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    size='xl'
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
                                        color='primary'
                                        onClick={removeCart}
                                        className='font-bold flex-1 normal-case text-lg'
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
                                        className='font-bold flex-1 normal-case text-lg'
                                    >
                                        Отмена
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
                />
            )}
        </>
    );
}

export default Cart;
