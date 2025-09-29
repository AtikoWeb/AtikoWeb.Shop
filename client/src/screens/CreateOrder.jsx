import React, {useEffect, useState} from 'react';
import {IoIosArrowBack} from 'react-icons/io';
import {TbTrashX} from 'react-icons/tb';
import {useNavigate} from 'react-router-dom';
import CartItem from '../components/CartItem';
import {useDispatch, useSelector} from 'react-redux';
import {removeAll} from '../../redux/slices/cartSlice';
import {Button, Input, ScrollShadow, Spinner, Tab, Tabs} from '@nextui-org/react';
import ModalWindow from '../components/Modal';
import axios from "../../axios.js";
import Cookies from "js-cookie";
import {AnimatePresence, motion} from "framer-motion";

function Order() {
    const [isInView, setIsInView] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [yandexMapURL, setYandexMapURL] = useState('');
    const [email, setEmail] = useState('');
    const [buyerEmail, setBuyerEmail] = useState('');
    const [buyerName, setBuyerName] = useState('');
    const [buyerPhone, setBuyerPhone] = useState('');
    const navigate = useNavigate();
    const MASTER_DB_URL = process.env.REACT_APP_MASTER_DB_URL;
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
    const currentDomain = window.location.hostname === process.env.REACT_APP_LOCAL_IP ? process.env.REACT_APP_DOMAIN : window.location.hostname;
    const db_code = Cookies.get('db_code');
    const [selectedMethod, setSelectedMethod] = useState('delivery'); // Состояние для выбранного способа
    const ATIKOWEB_URL = localStorage.getItem('AtikowebURL');
    const API_URL = `https://${currentDomain}/api/client/`;
    const [deliveryAddress, setDeliveryAddress] = useState(''); // Состояние для адреса доставки
    const [statusMessage, setStatusMessage] = useState('');
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);


    const handleMethodChange = (method) => {
        setSelectedMethod(method);
    };

    const handleAddressChange = (event) => {
        setDeliveryAddress(event.target.value);
    };

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

    useEffect(() => {
        if (user?.email && user?.name && user?.phone) {
            setBuyerEmail(user.email);
            setBuyerName(user.name);
            setBuyerPhone(user.phone);
        }
    }, [user]);

    useEffect(() => {
        if (buyerEmail && buyerName && buyerPhone) {
            setUser((prevUser) => ({
                ...prevUser,
                email: buyerEmail,
                name: buyerName,
                phone: buyerPhone,
            }));
        }
    }, [buyerEmail, buyerName, buyerPhone]);


    console.log({user})


    // const handleBuyerNameChange = (e) => {
    //     setBuyerName(e.target.value.trim());
    // };
    //
    // const handleBuyerPhoneChange = (e) => {
    //     let formattedPhone = e.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
    //     if (formattedPhone.length > 10) {
    //         formattedPhone = formattedPhone.slice(0, 10); // Ограничиваем номер телефона 10 цифрами
    //     }
    //     if (formattedPhone.length >= 7) {
    //         // Форматируем номер как (XXX) XXX-XXXX
    //         formattedPhone = `(${formattedPhone.slice(0, 3)}) ${formattedPhone.slice(
    //             3,
    //             6
    //         )}-${formattedPhone.slice(6)}`;
    //     } else if (formattedPhone.length >= 4) {
    //         // Форматируем номер как (XXX) XXX
    //         formattedPhone = `(${formattedPhone.slice(0, 3)}) ${formattedPhone.slice(
    //             3
    //         )}`;
    //     }
    //     setBuyerPhone(formattedPhone);
    // };
    //
    //
    // const handleBuyerEmailChange = (e) => {
    //     setBuyerEmail(e.target.value);
    // };


    console.log({selectedMethod});


    useEffect(() => {
        const fetchData = async () => {
            try {
                const yandexURLResponse = await axios.get(`https://${MASTER_DB_URL}/shop/client/get-yandexURL`, {
                    params: {
                        db_code
                    },
                });

                axios
                    .get(`/settings?db_code=${db_code}`)
                    .catch((error) => {
                        setIsLoading(false);
                        console.error('Error fetching settings:', error);
                    });
                setYandexMapURL(yandexURLResponse.data.url);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching Yandex URL:', error);
            }
        };

        fetchData();

        return () => {

        };
    }, []);


    useEffect(() => {
        const fetchData = async () => {
            try {
                axios
                    .get(`/settings?db_code=${db_code}`)
                    .then((response) => {
                        setEmail(response.data.config.email);
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        console.error('Error fetching settings:', error);
                    });

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching Yandex URL:', error);
            }
        };

        fetchData();

        return () => {

        };
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


    const getMaskPhone = (phone) => {
        let formattedPhone = phone.replace(/[^\d]/g, ''); // Убираем все нецифровые символы

        if (formattedPhone.length >= 7) {
            // Форматируем номер как +7 (XXX) XXX-XXXX
            formattedPhone = `+7 (${formattedPhone.slice(1, 4)}) ${formattedPhone.slice(
                4,
                7
            )}-${formattedPhone.slice(7, 11)}`;
        } else if (formattedPhone.length >= 4) {
            // Форматируем номер как +7 (XXX) XXX
            formattedPhone = `+7 (${formattedPhone.slice(1, 4)}) ${formattedPhone.slice(
                4
            )}`;
        }

        return formattedPhone;
    };

    const createOrder = async () => {

        if (isAuth) {
            const order = items.map((obj) => ({
                id: obj.id,
                productId: obj.productId,
                price: obj.price,
                qty: obj.qty,
                sizeId: obj?.size?.sizeId,
                barcode: obj?.size?.barcode,
            }));

            const orderData = {
                userId: userId,
                totalAmount: totalPrice,
                domain: currentDomain,
                phone: `+7${user.phone}`,
                shippingAddress: deliveryAddress,
                order: order
            };

            console.log(orderData);

            try {
                // Создание заказа
                const response = await axios.post('/order/create', orderData, {
                    params: {db_code}
                });

                setIsLoading(true);

                if (response.status === 200 && response.data.success) {
                    const orderFile = response.data.orderFile; // "order_856661"
                    const redirectUrl = response.data.redirectUrl; // URL для оплаты
                    const orderNumber = orderFile.split('_')[1]; // Извлекаем номер заказа ("856661")

                    console.log('Номер заказа:', orderNumber);
                    console.log('URL для оплаты:', redirectUrl);

                    // Уведомление перед редиректом
                    setStatusMessage('Вы будете перенаправлены на страницу оплаты. Пожалуйста, завершите оплату.');
                    setTimeout(() => {
                        // Перенаправление пользователя на оплату
                        window.location.href = redirectUrl;
                    }, 3000);

                    // Начало проверки статуса заказа
                    const checkOrderStatus = async () => {
                        setIsCheckingStatus(true); // Показываем индикатор проверки
                        setStatusMessage('Ожидается подтверждение оплаты...');

                        try {
                            const statusResponse = await axios.post(`${API_URL}/order/get-one`, {
                                userId: userId,
                                orderId: orderNumber // Используем orderNumber
                            }, {
                                params: {db_code}
                            });

                            if (statusResponse.data.status === 'success') {
                                console.log('Заказ успешно оплачен');

                                // Уведомление об успехе
                                setStatusMessage('Оплата успешно подтверждена! Завершаем заказ...');

                                // Отправка запроса на ATIKOWEB_URL
                                const path = `${API_URL}/order/get/${orderFile}?db_code=${db_code}`;
                                await axios.get(`https://${ATIKOWEB_URL}/?code=${db_code}&action=SITE_NEW_ORDER&telefon=${user.phone}&email=${user.email}&fname=${path}`);

                                console.log('Заказ успешно отправлен в систему AtikoWeb');
                                setIsLoading(false);
                                removeCart();

                                // Отправка email-уведомления
                                const itemsList = items.map(item => `
                                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                                    <div style="display: flex; flex-direction: column; flex-grow: 1;">
                                        <span style="font-size: 16px; font-weight: 500; color: #333;">${item.name}</span>
                                        ${item?.size?.sizeName ? `<span style="font-size: 14px; margin-top: 5px; color: #555;">Размер: <span>${item.size.sizeName}</span></span>` : ''}
                                    </div>
                                    <div style="text-align: right; font-size: 15px; color: #9ea2a4;">
                                        <span>${item.qty} x ${item.price.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}₸</span>
                                    </div>
                                </div>
                            `).join('');

                                await axios.post('https://atikoweb.kz/atikoshop-mail', {
                                    emailTo: email,
                                    clientPhone: getMaskPhone(`+7${user.phone}`),
                                    websiteUrl: currentDomain,
                                    method_receiving: selectedMethod === 'delivery' ? `Доставка на ${deliveryAddress}` : 'Самовывоз',
                                    orderDetails: itemsList,
                                    totalAmount: totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')
                                });

                                console.log('Email уведомление отправлено');
                            } else {
                                console.log('Статус заказа:', statusResponse.data.status);
                                setTimeout(checkOrderStatus, 5000); // Проверяем снова через 5 секунд
                            }
                        } catch (statusError) {
                            console.error('Ошибка при проверке статуса заказа:', statusError);
                            setStatusMessage('Произошла ошибка при проверке статуса заказа. Попробуйте позже.');
                        }
                    };

                    // Запускаем проверку статуса
                    setTimeout(checkOrderStatus, 5000); // Даем время на завершение оплаты
                } else {
                    console.error('Произошла ошибка при создании заказа');
                    setStatusMessage('Ошибка при создании заказа. Пожалуйста, попробуйте снова.');
                }
            } catch (error) {
                console.error('Произошла ошибка при создании заказа или отправке запроса:', error);
                setStatusMessage('Произошла ошибка. Проверьте соединение и повторите попытку.');
            }
        } else {
            navigate('/signin');
        }
    };


    if (isLoading) {
        return (
            <div className={'grid place-items-center mt-20'}>
                <div className={'grid gap-5'}>
                    <Spinner/>
                    <span className={`text-xl font-semibold`}>{statusMessage}</span>
                </div>
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

                    <Button
                        onClick={() => navigate('/')}
                        color='primary'
                        size='lg'
                        className='btn btn-primary mt-5 hidden md:flex btn-block font-bold flex-1 normal-case text-lg'
                    >
                        Вернуться на главную
                    </Button>
                </div>


                <div
                    className='fixed md:relative md:hidden flex z-[1] right-0 left-0 bottom-0 bg-white font-bold w-screen md:w-full md:shadow-none h-24 shadow-black shadow-2xl px-3 pt-6 rounded-t-2xl'>
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
            <>
                <div className='md:pb-0 relative pb-5 dark:bg-[#0F0F0F] xl:rounded-2xl'>
                    <div
                        className={`flex justify-between z-[10] lg:sticky ${
                            !isInView && 'bg-white rounded-2xl shadow-black/20 shadow-2xl lg:shadow-none'
                        } fixed top-0 h-16 lg:h-28 w-full items-center`}
                    >
                        <Button
                            onClick={goBack}
                            size='sm'
                            className='bg-transparent lg:hidden -ml-2'
                        >
                            <IoIosArrowBack className='text-4xl'/>
                        </Button>

                        <span
                            className={`text-xl md:text-2xl xl:text-3xl mx-10 xl:mt-10 font-bold hidden lg:flex`}>
						Оформление заказа
					</span>

                        <span
                            className={`text-xl font-bold ${
                                isInView || !isMobile ? 'hidden' : 'flex'
                            }`}
                        >
						Оформление заказа
					</span>
                        <div className=''>
                            {isMobile ? (
                                <>
                                    <Button
                                        size='sm'
                                        className='bg-transparent'
                                        onClick={() => setIsOpen(true)}
                                    >
                                        <TbTrashX className='cursor-pointer text-3xl'/>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <TbTrashX
                                        onClick={() => setIsOpen(true)}
                                        className='cursor-pointer absolute right-3 top-0 text-4xl mx-5 mt-5'/>
                                </>
                            )}
                        </div>
                    </div>
                    <div className='w-full px-3 mb-5 md:hidden mt-20 flex justify-between'>
                        <span className='text-3xl font-bold w-80'>Оформление заказа</span>
                    </div>


                    {isMobile ? (
                        <>
                            <div className='w-full pb-40 px-3 md:overflow-y-scroll scrollbar-hide'>


                                <Tabs size={"lg"}
                                      className={'flex justify-center mt-3 mb-5'}>
                                    <Tab key="Корзина" title={'Корзина'}>
                                        <AnimatePresence mode={"popLayout"}>
                                            {items.map((obj) => (
                                                <motion.div
                                                    layout
                                                    animate={{scale: 1, opacity: 1}}
                                                    exit={{scale: 0.8, opacity: 0}}
                                                    transition={{type: "spring"}}
                                                    key={obj.productId}>
                                                    <CartItem key={obj.productId} item={obj}/>
                                                </motion.div>


                                            ))}
                                        </AnimatePresence>
                                    </Tab>

                                    {/*<Tab key="Ваши данные" title='Ваши данные'>*/}


                                    {/*    <div className={'grid mb-8 gap-5'}>*/}
                                    {/*        <Input*/}
                                    {/*            isRequired*/}
                                    {/*            fullWidth*/}
                                    {/*            type="text"*/}
                                    {/*            variant="flat"*/}
                                    {/*            label="Имя"*/}
                                    {/*            name="name"  // Добавляем name для идентификации*/}
                                    {/*            value={buyerName}*/}
                                    {/*            onChange={handleBuyerNameChange}  // Единый обработчик*/}
                                    {/*            size="lg"*/}
                                    {/*            className=""*/}
                                    {/*        />*/}

                                    {/*        <Input*/}
                                    {/*            isRequired*/}
                                    {/*            fullWidth*/}
                                    {/*            type="text"*/}
                                    {/*            variant="flat"*/}
                                    {/*            label="Телефон"*/}
                                    {/*            name="phone"*/}
                                    {/*            placeholder={'( XXX ) XXX XX'}*/}
                                    {/*            value={buyerPhone}*/}
                                    {/*            onChange={handleBuyerPhoneChange}*/}
                                    {/*            size="lg"*/}
                                    {/*            className=""*/}
                                    {/*            startContent={<span>+7</span>}*/}
                                    {/*        />*/}

                                    {/*        <Input*/}
                                    {/*            isRequired*/}
                                    {/*            fullWidth*/}
                                    {/*            type='text'*/}
                                    {/*            variant="flat"*/}
                                    {/*            label='Email'*/}
                                    {/*            value={buyerEmail}*/}
                                    {/*            onChange={handleBuyerEmailChange}*/}
                                    {/*            size='lg'*/}
                                    {/*            className='mt-3'*/}
                                    {/*        />*/}
                                    {/*    </div>*/}
                                    {/*</Tab>*/}

                                    <Tab key="Способ получения" title='Способ получения'>
                                        <div className="flex gap-3 rounded-xl">

                                            <div
                                                className={`grid place-content-center rounded-xl place-items-center w-screen h-24 cursor-pointer ${selectedMethod === 'delivery' ? 'bg-neutral-600 text-white' : 'bg-neutral-100'}`}
                                                onClick={() => handleMethodChange('delivery')}
                                            >
                                                <span className="text-xl font-bold text-left">Доставка</span>
                                                <span className="lg:text-lg text-neutral-400">Доставит курьер</span>
                                            </div>

                                            <div
                                                className={`grid place-content-center rounded-xl place-items-center w-screen h-24 cursor-pointer ${selectedMethod === 'pickup' ? 'bg-neutral-600 text-white' : 'bg-neutral-100'}`}
                                                onClick={() => handleMethodChange('pickup')}
                                            >
                                                <span className="text-xl font-bold text-left">Самовывоз</span>
                                                <span className="lg:text-lg text-neutral-400">Забираете сами</span>
                                            </div>

                                        </div>

                                        {selectedMethod === 'delivery' ? (
                                            <div className="mt-8">
                                                <Input
                                                    isRequired
                                                    fullWidth
                                                    type='text'
                                                    variant={'flat'}
                                                    label="Адрес доставки"
                                                    value={deliveryAddress}
                                                    onChange={handleAddressChange}
                                                    size='lg'
                                                    className=''
                                                />
                                            </div>
                                        ) : (
                                            <div className={'mt-8'}>
                                                <span
                                                    className={`text-lg md:text-lg pb-2 pt-3 font-bold`}>
						Вы можете забрать свой заказ отсюда
					</span>
                                                <iframe
                                                    src={yandexMapURL}
                                                    width='600'
                                                    height='450'
                                                    className='mx-auto mt-2 w-full'
                                                    allowFullScreen=''
                                                    style={{
                                                        borderRadius: '10px'
                                                    }}
                                                    loading='lazy'
                                                    onLoad={() => setIsLoading(false)}
                                                    referrerPolicy='no-referrer-when-downgrade'
                                                />
                                            </div>
                                        )}
                                    </Tab>
                                </Tabs>

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
                                        onClick={createOrder}
                                        color='primary'
                                        size='lg'
                                        className='btn p-7 btn-primary font-bold flex-1 normal-case text-lg'
                                    >
                                        Перейти к оплате
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>

                            <div className="gap-10">
                                <div className="flex justify-between mx-20">
                                    <div className="xl:w-1/2 md:w-2/4">
                                        <div
                                            className='bg-neutral-100 mb-10 h-fit rounded-3xl px-5 pt-8 mt-5'>
                                          <span
                                              className={`text-xl md:text-xl font-bold hidden lg:flex`}>
						1. Корзина
					</span>

                                            <ScrollShadow hideScrollBar className='w-full h-fit mt-5'>
                                                <AnimatePresence mode={"popLayout"}>
                                                    {items.map((obj) => (
                                                        <motion.div layout
                                                                    animate={{scale: 1, opacity: 1}}
                                                                    exit={{scale: 0.8, opacity: 0}}
                                                                    transition={{type: "spring"}}
                                                                    key={obj.productId}>
                                                            <CartItem key={obj.productId} item={obj}/>
                                                        </motion.div>


                                                    ))}
                                                </AnimatePresence>
                                            </ScrollShadow>
                                        </div>

                                        {/*                    <div*/}
                                        {/*                        className='bg-neutral-100 pb-10 h-fit rounded-3xl px-5 pt-8'>*/}
                                        {/*                      <span*/}
                                        {/*                          className={`text-xl md:text-xl font-bold hidden lg:flex`}>*/}
                                        {/*	2. Персональные данные*/}
                                        {/*</span>*/}

                                        {/*                        <div className={'grid grid-cols-2 mt-5 gap-5'}>*/}
                                        {/*                            <Input*/}
                                        {/*                                isRequired*/}
                                        {/*                                fullWidth*/}
                                        {/*                                type="text"*/}
                                        {/*                                variant="underlined"*/}
                                        {/*                                label="Имя"*/}
                                        {/*                                name="name"  // Добавляем name для идентификации*/}
                                        {/*                                value={buyerName}*/}
                                        {/*                                onChange={handleBuyerNameChange}  // Единый обработчик*/}
                                        {/*                                size="lg"*/}
                                        {/*                                className=""*/}
                                        {/*                            />*/}

                                        {/*                            <Input*/}
                                        {/*                                isRequired*/}
                                        {/*                                fullWidth*/}
                                        {/*                                type="text"*/}
                                        {/*                                variant="underlined"*/}
                                        {/*                                label="Телефон"*/}
                                        {/*                                name="phone"*/}
                                        {/*                                placeholder={'( XXX ) XXX XX'}*/}
                                        {/*                                value={buyerPhone}*/}
                                        {/*                                onChange={handleBuyerPhoneChange}*/}
                                        {/*                                size="lg"*/}
                                        {/*                                className=""*/}
                                        {/*                                startContent={<span>+7</span>}*/}
                                        {/*                            />*/}

                                        {/*                        </div>*/}

                                        {/*                        <Input*/}
                                        {/*                            isRequired*/}
                                        {/*                            fullWidth*/}
                                        {/*                            type='text'*/}
                                        {/*                            variant={'underlined'}*/}
                                        {/*                            label='Email'*/}
                                        {/*                            value={buyerEmail}*/}
                                        {/*                            onChange={handleBuyerEmailChange}*/}
                                        {/*                            size='lg'*/}
                                        {/*                            className='mt-3'*/}
                                        {/*                        />*/}

                                        {/*                    </div>*/}


                                        <div
                                            className='bg-neutral-100 pb-10 h-fit mt-10 mb-20 rounded-3xl px-5 pt-8'>
                                          <span
                                              className={`text-xl md:text-xl font-bold hidden lg:flex`}>
						2. Доставка / самовывоз
					</span>


                                            <Tabs selectedKey={selectedMethod} onSelectionChange={handleMethodChange}
                                                  size={"lg"}
                                                  className={'flex mt-5'}>
                                                <Tab key="Доставка" title={'Доставка'}>
                                                    <Input
                                                        isRequired
                                                        fullWidth
                                                        type='text'
                                                        variant={'underlined'}
                                                        label="Адрес доставки"
                                                        value={deliveryAddress}
                                                        onChange={handleAddressChange}
                                                        size='lg'
                                                        className=''
                                                    />
                                                </Tab>

                                                <Tab key="Самовывоз" title={'Самовывоз'}>

                                                    <span
                                                        className={`text-xl md:text-lg pb-2 pt-3 font-bold hidden lg:flex`}>
						Вы можете забрать свой заказ отсюда
					</span>
                                                    <iframe
                                                        src={yandexMapURL}
                                                        width='600'
                                                        height='450'
                                                        className='mx-auto mt-2 w-full'
                                                        allowFullScreen=''
                                                        style={{
                                                            borderRadius: '10px'
                                                        }}
                                                        loading='lazy'
                                                        onLoad={() => setIsLoading(false)}
                                                        referrerPolicy='no-referrer-when-downgrade'
                                                    />
                                                </Tab>
                                            </Tabs>


                                        </div>

                                    </div>


                                    <div className="bg-neutral-100 sticky top-32 h-fit w-96 mt-8 pt-8 rounded-3xl">
                                        <span className="text-xl mx-5 font-semibold">Итого:</span>
                                        <div className="pb-5 font-bold xl:rounded-2xl mx-5 rounded-t-2xl">
                <span className="text-3xl">
                    {totalPrice.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}{' '}
                    <span>₸</span>
                </span>
                                            <div className="w-full mt-10 flex">
                                                <Button
                                                    onClick={createOrder}
                                                    color="primary"
                                                    size="lg"
                                                    className="btn p-8 btn-primary font-bold flex-1 normal-case text-xl"
                                                >
                                                    Перейти к оплате
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </>
                    )}

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
									Очистить заказ ?
								</span>
                            </div>

                            <div className='grid gap-3'>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Button
                                        size='lg'
                                        onClick={removeCart}
                                        className='font-bold bg-red-500 text-white flex-1 normal-case text-lg'
                                    >
                                        Очистить
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
        </>
    );
}

export default Order;
