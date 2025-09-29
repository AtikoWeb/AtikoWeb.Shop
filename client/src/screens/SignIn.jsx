import {Button, Input, Tab, Tabs} from '@nextui-org/react';
import React, {useEffect, useState} from 'react';
import {IoIosArrowBack} from 'react-icons/io';
import {Link, useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../axios';
import {userLoggedIn} from '../../redux/slices/userSlice';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import Cookies from "js-cookie";

function SignIn() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selected, setSelected] = useState("Email");
    const currentDomain = window.location.hostname || process.env.REACT_APP_DOMAIN;
    const db_code = Cookies.get('db_code');
    const [isErrorEmail, setIsErrorEmail] = useState(false);
    const [isErrorPhone, setIsErrorPhone] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const handlePasswordChange = (e) => {
        setPassword(e.target.value.trim());
    };

    const handlePhoneChange = (e) => {
        let formattedPhone = e.target.value.replace(/\D/g, ''); // Удаляем все нецифровые символы
        if (formattedPhone.length > 10) {
            formattedPhone = formattedPhone.slice(0, 10); // Ограничиваем номер телефона 10 цифрами
        }
        if (formattedPhone.length >= 7) {
            // Форматируем номер как (XXX) XXX-XXXX
            formattedPhone = `(${formattedPhone.slice(0, 3)}) ${formattedPhone.slice(
                3,
                6
            )}-${formattedPhone.slice(6)}`;
        } else if (formattedPhone.length >= 4) {
            // Форматируем номер как (XXX) XXX
            formattedPhone = `(${formattedPhone.slice(0, 3)}) ${formattedPhone.slice(
                3
            )}`;
        }
        setPhone(formattedPhone);
    };


    const showToast = (message) => {
        toast.error(message, {
            position: 'top-right',
            autoClose: 3000,
            className: 'rounded-xl bg-base-100',
        });
    };

    const user = {email, phone: `${phone.replace(/\D/g, '')}`, password};

    const handleLogIn = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('/user/signin', user, {
                params: {
                    db_code
                }
            });
            const userId = response.data.userId;
            dispatch(userLoggedIn(userId));
            Cookies.set('userId', userId);
            navigate('/');
        } catch (error) {
            if (error.response.status === 401) {
                // Ошибка авторизации (неверный пароль)
                if (selected === 'Телефон') {
                    setIsErrorPhone(true);
                    setIsLoading(false);
                } else {
                    setIsErrorEmail(true);
                    setIsLoading(false);
                }
            } else {
                // Другие ошибки
                showToast('Ошибка входа: ' + error.response.data.message);
                setIsLoading(true);
            }
        }
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='bg-white mx-auto lg:w-8/12  mt-5 rounded-2xl lg:h-screen h-full w-full'>
            <Button
                onPress={() => navigate('/')}
                size='sm'
                className='normal-case absolute top-3 lg:left-5 -ml-2 bg-transparent flex justify-start'
            >
                <IoIosArrowBack className='text-4xl'/>
            </Button>

            <div className='px-5 lg:px-32 pt-20'>
                <div className='mb-5 text-center text-2xl font-black'>
                    <span>Вход в аккаунт</span>
                </div>

                <Tabs selectedKey={selected} onSelectionChange={setSelected} size={"lg"}
                      className={'flex justify-center sticky mb-3 top-5'}>
                    <Tab key="Email" title={'Email'}>

                        {isErrorEmail && (
                            <div
                                className='mb-5 text-danger text-center text-xl'>
                                <span>Неправильный email или пароль!</span>
                            </div>
                        )}

                        <Input
                            isRequired
                            fullWidth
                            type='text'
                            isInvalid={isErrorEmail}
                            value={email}
                            onChange={(event) => setEmail(event.target.value.trim())}
                            label='Email'
                            defaultValue=''
                            size='lg'
                            className='mb-5'

                        />

                    </Tab>
                    <Tab key="Телефон" title={'Телефон'}>

                        {isErrorPhone && (
                            <div
                                className='mb-5 text-danger text-center text-xl'>
                                <span>Неправильный телефон или пароль!</span>
                            </div>
                        )}

                        <Input
                            isRequired
                            fullWidth
                            type='tel'
                            value={phone}
                            isInvalid={isErrorPhone}
                            onChange={handlePhoneChange}
                            label='Телефон'
                            defaultValue=''
                            placeholder={'( XXX ) XXX XX'}
                            size='lg'
                            className={`mb-5 ${isErrorPhone && 'placeholder-danger'}`}
                            startContent={<span className={`${isErrorPhone && 'text-danger'}`}>+7</span>}
                        />
                    </Tab>

                </Tabs>


                <Input
                    fullWidth
                    isRequired
                    type={showPassword ? 'text' : 'password'}
                    value={password.trim()}
                    isInvalid={isErrorEmail || isErrorPhone}
                    onChange={handlePasswordChange}
                    label='Пароль'
                    defaultValue=''
                    size='lg'
                    className='mb-5'
                    endContent={
                        <Button
                            onClick={handleShowPassword}
                            size='sm'
                            className='absolute right-3 top-4'
                        >
                            {showPassword ? (
                                <FaEyeSlash className='text-xl'/>
                            ) : (
                                <FaEye className='text-xl'/>
                            )}
                        </Button>
                    }
                />

                <Button
                    fullWidth
                    isLoading={isLoading}
                    onPress={handleLogIn}
                    isDisabled={email.length < 5 && phone.length < 5 || password.length < 5}
                    size='lg'
                    color='primary'
                    className='font-semibold disabled:bg-primary/50 text-lg'
                >
                    Войти
                </Button>

                <div className='flex mb-5 pt-5 justify-between'>
                    <span>Еще нет аккаунта ?</span>
                    <Link
                        className='text-primary'
                        to='/signup'
                    >
                        Зарегистрироваться
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignIn;
