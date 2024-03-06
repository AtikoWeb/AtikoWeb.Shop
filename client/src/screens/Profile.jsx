import {Avatar, Button, Input, Spinner} from '@nextui-org/react';
import axios from '../../axios';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {IoIosArrowBack, IoIosArrowForward} from 'react-icons/io';
import {LuLogOut} from 'react-icons/lu';
import {userLoggedOut} from '../../redux/slices/userSlice';
import ModalWindow from '../components/Modal';
import {BottomSheet} from 'react-spring-bottom-sheet';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FaEye, FaEyeSlash} from 'react-icons/fa';

function Profile() {
    const userId = useSelector((state) => state.user.userId);
    const [user, setUser] = useState({name: '', email: '', phone: ''});
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [isInView, setIsInView] = useState(true);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const [isLogOut, setIsLogOut] = useState(false);
    const [isChangePassword, setIsChangePassword] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const menuItems = [
        {
            name: 'Пароль',
            desc: 'Сменить пароль',
            onClick: () => handleChangePassword(),
        },
        {
            name: 'Мои заказы',
            desc: 'Посмотреть активные заказы',
            onClick: () => navigate('/my-orders')
        },
        {
            name: 'История заказов',
            desc: 'Посмотреть историю заказов',
        },
    ];

    useEffect(() => {
        const getUser = async () => {
            try {
                const {data} = await axios.get('/user/get-one', {
                    params: {id: userId},
                });
                console.log('API Response:', data);
                setUser({name: data.username, email: data.email, phone: data.phone});
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getUser();
    }, [userId]);

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


    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const logOut = () => {
        dispatch(userLoggedOut());
        localStorage.removeItem('userId');
        navigate('/');
    };

    const handleLogout = () => {
        setIsChangePassword(false);
        setIsLogOut(true);
        setIsOpen(true);
    };


    const data = {email: user.email, oldPassword, newPassword};

    const changePassword = async () => {
        try {
            const response = await axios.put('/user/change-password', data);
            toast.success(response.data.message, {
                position: 'top-right',
                autoClose: 3000,
                className: 'rounded-xl bg-base-100',
            });
            setIsOpen(false);
        } catch (error) {
            if (error.response.status === 401) {
                // Ошибка авторизации (неверный пароль)
                toast.error(error.response.data.error, {
                    position: 'top-right',
                    autoClose: 3000,
                    className: 'bg-base-100',
                });
            }
        }
    };

    const handleChangePassword = () => {
        setIsLogOut(false);
        setIsChangePassword(true);
        setIsOpen(true);
    };

    const handleShowOldPassword = () => {
        setShowOldPassword(!showOldPassword);
    };

    const handleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const firstNameChar = user.name.charAt(0);


    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const threshold = 80; //порог видимости

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
            <div className='grid bg-white h-screen place-content-center'>
                <Spinner/>
            </div>
        );
    }


    return (
        <div className='mx-auto overflow-x-hidden rounded-2xl bg-white lg:h-screen h-full w-full'>
            <div
                className={`flex lg:sticky 
					bg-white/[.5] backdrop-blur-lg fixed top-0 justify-between lg:mt-5 z-[1] h-16 rounded-xl w-full items-center`}
            >
                <Button
                    size='sm'
                    className='normal-case -ml-2 bg-transparent flex justify-start'
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowBack className='text-4xl'/>
                </Button>
                <span className={`text-xl font-bold`}>Профиль</span>

                <Button
                    size='sm'
                    className='bg-transparent -mr-1'
                ></Button>
            </div>

            <div>
                <div className='px-5 pt-14 grid place-content-center lg:px-32'>
                    <Avatar
                        isBordered
                        className={'mx-auto text-white bg-neutral-500/90 h-28 w-28 mt-5 text-4xl mb-5'}
                        name={firstNameChar}
                    />
                    <div className='mb-5 grid text-center'>
                        <span className='font-black text-3xl pb-1'>{user.name}</span>
                        <span className='text-md text-neutral-500'>
                            {getMaskPhone(user.phone)}
                        </span>
                        <span className='text-md text-neutral-500'>
							{user.email}
						</span>
                    </div>
                </div>
                <div className='w-full px-3'>
                    <div className='bg-neutral-100 rounded-xl p-2'>
                        {menuItems.map((obj, index) => (
                            <>
                                <Button
                                    onPress={obj.onClick}
                                    fullWidth
                                    className={`bg-neutral-100 px-3 h-16 flex items-center justify-between`}
                                >
                                    <div className='grid'>
										<span className='text-lg font-bold text-left'>
											{obj.name}
										</span>
                                        <span className='text-md text-neutral-400'>{obj.desc}</span>
                                    </div>
                                    <IoIosArrowForward className='text-xl'/>
                                </Button>
                                <hr className={`${index === 2 && 'hidden'}`}/>
                            </>
                        ))}
                    </div>
                    <Button
                        onPress={handleLogout}
                        fullWidth
                        className='bg-neutral-100 mb-3 mt-5 px-3 h-16 flex items-center justify-between'
                    >
                        <div className='grid'>
                            <span className='text-lg font-bold text-left'>Выйти</span>
                            <span className='text-md text-neutral-400'>
								Выйти из аккаунта
							</span>
                        </div>
                        <LuLogOut className='text-xl'/>
                    </Button>
                </div>
            </div>
            {isMobile ? (
                <BottomSheet
                    open={isOpen}
                    onDismiss={() => setIsOpen(false)}
                    defaultSnap={({maxHeight}) => maxHeight / 1.6}
                    snapPoints={({maxHeight}) => [
                        maxHeight - maxHeight / 1.6,
                        maxHeight - maxHeight / 1.6,
                    ]}
                    draggable={true}
                >
                    {isLogOut && (
                        <div className='mx-3 mt-3 mb-5'>
                            <div className='grid mb-5'>
                                <span className='text-2xl font-bold'>Выйти из аккаунта ?</span>
                            </div>

                            <div className='grid gap-3'>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Button
                                        size='lg'
                                        color='primary'
                                        onClick={logOut}
                                        className='font-bold flex-1 normal-case text-lg'
                                    >
                                        Выйти
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
                    )}

                    {isChangePassword && (
                        <div className='mx-3 mt-3 mb-5'>
                            <div className='grid gap-3'>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Input
                                        fullWidth
                                        isRequired
                                        type={showOldPassword ? 'text' : 'password'}
                                        label='Старый пароль'
                                        defaultValue=''
                                        value={oldPassword}
                                        onChange={handleOldPasswordChange}
                                        size='lg'
                                        className=''
                                        endContent={
                                            <Button
                                                onClick={handleShowOldPassword}
                                                size='sm'
                                                className='absolute right-3 top-4'
                                            >
                                                {showOldPassword ? (
                                                    <FaEyeSlash className='text-xl'/>
                                                ) : (
                                                    <FaEye className='text-xl'/>
                                                )}
                                            </Button>
                                        }
                                    />
                                </div>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Input
                                        fullWidth
                                        isRequired
                                        type={showNewPassword ? 'text' : 'password'}
                                        label='Новый пароль'
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        defaultValue=''
                                        size='lg'
                                        className='mb-5'
                                        endContent={
                                            <Button
                                                onClick={handleShowNewPassword}
                                                size='sm'
                                                className='absolute right-3 top-4'
                                            >
                                                {showNewPassword ? (
                                                    <FaEyeSlash className='text-xl'/>
                                                ) : (
                                                    <FaEye className='text-xl'/>
                                                )}
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                            <div className='w-full gap-3 bg-white/[.8] flex'>
                                <Button
                                    size='lg'
                                    onClick={() => setIsOpen(false)}
                                    className='font-bold bg-neutral-200/60 flex-1 normal-case text-lg'
                                >
                                    Отмена
                                </Button>
                                <Button
                                    color='primary'
                                    size='lg'
                                    onPress={changePassword}
                                    className='font-bold flex-1 normal-case text-lg'
                                >
                                    Готово
                                </Button>
                            </div>
                        </div>
                    )}
                </BottomSheet>
            ) : (
                <ModalWindow
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    size='2xl'
                >
                    {isLogOut && (
                        <div className='mx-3 mt-3 mb-5'>
                            <div className='grid mb-5'>
                                <span className='text-2xl font-bold'>Выйти из аккаунта ?</span>
                            </div>

                            <div className='grid gap-3'>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Button
                                        size='lg'
                                        color='primary'
                                        onClick={logOut}
                                        className='font-bold flex-1 normal-case text-lg'
                                    >
                                        Выйти
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
                    )}

                    {isChangePassword && (
                        <div className='mx-3 mt-3 mb-5'>
                            <div className='grid mb-5'>
                                <span className='text-2xl font-bold'>Смена пароля</span>
                            </div>

                            <div className='grid gap-3'>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Input
                                        fullWidth={true}
                                        isRequired
                                        type={showOldPassword ? 'text' : 'password'}
                                        label='Старый пароль'
                                        defaultValue=''
                                        value={oldPassword}
                                        onChange={handleOldPasswordChange}
                                        size='lg'
                                        className=''
                                        endContent={
                                            <Button
                                                onClick={handleShowOldPassword}
                                                size='sm'
                                                className='absolute right-3 top-4'
                                            >
                                                {showOldPassword ? (
                                                    <FaEyeSlash className='text-xl'/>
                                                ) : (
                                                    <FaEye className='text-xl'/>
                                                )}
                                            </Button>
                                        }
                                    />
                                </div>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Input
                                        fullWidth
                                        isRequired
                                        type={showNewPassword ? 'text' : 'password'}
                                        label='Новый пароль'
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
                                        defaultValue=''
                                        size='lg'
                                        className='mb-5'
                                        endContent={
                                            <Button
                                                onClick={handleShowNewPassword}
                                                size='sm'
                                                className='absolute right-3 top-4'
                                            >
                                                {showNewPassword ? (
                                                    <FaEyeSlash className='text-xl'/>
                                                ) : (
                                                    <FaEye className='text-xl'/>
                                                )}
                                            </Button>
                                        }
                                    />
                                </div>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Button
                                        color='primary'
                                        size='lg'
                                        onPress={changePassword}
                                        className='font-bold flex-1 normal-case text-lg'
                                    >
                                        Готово
                                    </Button>
                                </div>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Button
                                        color='primary'
                                        size='lg'
                                        variant={"flat"}
                                        onClick={() => setIsOpen(false)}
                                        className='font-bold flex-1 normal-case text-lg'
                                    >
                                        Отмена
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </ModalWindow>
            )}
        </div>
    );
}

export default Profile;
