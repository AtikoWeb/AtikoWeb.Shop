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

function SignIn() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selected, setSelected] = useState("Email");


    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
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

    const user = {email, phone: `+7${phone.replace(/\D/g, '')}`, password};

    const handleLogIn = async () => {
        try {
            const response = await axios.post('/user/signin', user);
            const userId = response.data.userId;
            dispatch(userLoggedIn(userId));
            localStorage.setItem('userId', userId);
            navigate('/');
        } catch (error) {
            if (error.response.status === 401) {
                // Ошибка авторизации (неверный пароль)
                if (selected === 'Телефон') {
                    showToast('Неверный телефон или пароль!');
                } else {
                    showToast('Неверный email или пароль!');
                }
            } else {
                // Другие ошибки
                showToast('Ошибка входа: ' + error.response.data.message);
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
        <div className='bg-white mx-auto mt-5 rounded-2xl lg:h-screen h-full w-full'>
            <Button
                onPress={() => navigate('/')}
                size='sm'
                className='normal-case absolute top-3 -ml-2 bg-transparent flex justify-start'
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
                        <Input
                            isRequired
                            fullWidth
                            type='text'
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            label='Email'
                            defaultValue=''
                            size='lg'
                            className='mb-5'

                        />

                        <Input
                            fullWidth
                            isRequired
                            type={showPassword ? 'text' : 'password'}
                            value={password}
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
                    </Tab>
                    <Tab key="Телефон" title={'Телефон'}>
                        <Input
                            isRequired
                            fullWidth
                            type='tel'
                            value={phone}
                            onChange={handlePhoneChange}
                            label='Телефон'
                            defaultValue=''
                            placeholder={'( XXX ) XXX XX'}
                            size='lg'
                            className='mb-5'
                            startContent={<span>+7</span>}
                        />

                        <Input
                            fullWidth
                            isRequired
                            type={showPassword ? 'text' : 'password'}
                            value={password}
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
                    </Tab>
                </Tabs>
                
                <Button
                    fullWidth
                    onPress={handleLogIn}
                    size='lg'
                    color='primary'
                    className='font-bold text-lg'
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
