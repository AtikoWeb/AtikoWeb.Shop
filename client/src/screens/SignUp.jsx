import {Button, Input} from '@nextui-org/react';
import React, {useState} from 'react';
import {IoIosArrowBack} from 'react-icons/io';
import {Link, useNavigate} from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import Cookies from "js-cookie";
import axios from "../../axios.js";

function SignUp() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [touchedFields, setTouchedFields] = useState({
        name: false,
        email: false,
        phone: false,
        password: false
    });
    const currentDomain = window.location.hostname || process.env.REACT_APP_DOMAIN;
    const db_code = Cookies.get('db_code');

    const handleNameChange = (e) => {
        setName(e.target.value.trim());
        setTouchedFields({...touchedFields, name: true});
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

        setTouchedFields({...touchedFields, phone: true});
    };


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setTouchedFields({...touchedFields, email: true});
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setTouchedFields({...touchedFields, password: true});
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const newUser = {
        name,
        email,
        phone: `${phone.replace(/\D/g, '')}`,
        password,
        domain: currentDomain
    };

    console.log(newUser);

    const register = async () => {
        setIsLoading(true);
        try {
            await axios.post('/user/signup', newUser, {
                params: {
                    db_code
                }
            });

            navigate('/verify', {
                state: {
                    email,
                    name,
                    phone: `${phone.replace(/\D/g, '')}`,
                    password
                }
            })

        } catch (error) {
            setErrorMessage(error.response.data);
            setIsError(true);
            setEmail('');
            setPhone('');
            setName('');
            setPassword('');
            setIsLoading(false);
        }
    };


    return (
        <div className='bg-white lg:w-8/12  mx-auto mt-5 rounded-2xl lg:h-screen h-full w-full'>
            <Button
                onPress={() => navigate('/')}
                size='sm'
                className='normal-case absolute lg:left-5 top-3 -ml-2 bg-transparent flex justify-start'
            >
                <IoIosArrowBack className='text-4xl'/>
            </Button>

            <div className='px-5 lg:px-32 pt-20'>

                <div className='mb-5 text-center text-2xl font-black'>
                    <span>Регистрация</span>
                </div>

                {isError && (
                    <div
                        className='mb-5 text-danger text-center text-xl'>
                        <span>Ошибка регистрации: {errorMessage}</span>
                    </div>
                )}

                <Input
                    isRequired
                    fullWidth
                    type='text'
                    label='Имя'
                    isInvalid={!name && touchedFields.name}
                    errorMessage={!name && touchedFields.name && "Пожалуйста введите имя!"}
                    defaultValue=''
                    value={name.trim()}
                    onChange={handleNameChange}
                    size='lg'
                    className='mb-5'
                />

                <Input
                    isRequired
                    fullWidth
                    type='text'
                    isInvalid={!email && touchedFields.email}
                    errorMessage={!email && touchedFields.email && "Пожалуйста введите email!"}
                    value={email}
                    onChange={handleEmailChange}
                    label='Email'
                    defaultValue=''
                    size='lg'
                    className='mb-5'
                />

                <Input
                    isRequired
                    fullWidth
                    type='tel'
                    value={phone}
                    isInvalid={phone.length < 10 && touchedFields.phone}
                    errorMessage={phone.length < 10 && touchedFields.phone && "Пожалуйста введите телефон!"}
                    onChange={handlePhoneChange}
                    label='Телефон'
                    defaultValue=''
                    placeholder={'( XXX ) XXX XX'}
                    size='lg'
                    className={`mb-5 invalid:placeholder-red-500`}
                    startContent={<span
                        className={`${phone.length < 10 && touchedFields.phone && 'text-danger'}`}>+7</span>}
                />

                <Input
                    fullWidth
                    isRequired
                    isInvalid={password.length < 5 && touchedFields.password}
                    errorMessage={password.length < 5 && "Пароль должен быть не меньше 5 символов!"}
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

                <Button
                    fullWidth
                    onPress={register}
                    size='lg'
                    isLoading={isLoading}
                    color='primary'
                    isDisabled={email.length < 1 || name.length < 1 || phone.length < 5 || password.length < 5}
                    className='font-bold text-lg'
                >
                    Зарегистрироваться
                </Button>

                <div className='flex mb-5 pt-5 justify-between'>
                    <span>Уже есть аккаунт ?</span>
                    <Link
                        className='text-primary'
                        to='/signin'
                    >
                        Войти
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignUp;
