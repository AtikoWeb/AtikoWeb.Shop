import {Button, Input} from '@nextui-org/react';
import React, {useState} from 'react';
import {IoIosArrowBack} from 'react-icons/io';
import {Link, useNavigate} from 'react-router-dom';
import axios from '../../axios';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {FaEye, FaEyeSlash} from 'react-icons/fa';

function SignUp() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleNameChange = (e) => {
        setName(e.target.value);
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


    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const showToast = (message) => {
        toast.error(message, {
            position: 'top-right',
            autoClose: 3000,
            className: 'rounded-xl bg-base-100',
        });
    };

    const newUser = {name, phone: `+7${phone.replace(/\D/g, '')}`, email, password};

    console.log(newUser);

    const register = async () => {
        try {
            await axios.post('/user/signup', newUser);
        } catch (error) {
            // Обработка ошибок регистрации, если необходимо
        }
    };

    const check = () => {
        if (!name || name.length < 3) {
            showToast('Введите корректное имя!');
            return true; // Возвращаем true, чтобы показать, что есть ошибка
        }

        if (!email) {
            showToast('Введите email!');
            return true;
        }

        if (!phone) {
            showToast('Введите телефон!');
            return true;
        }

        if (!password) {
            showToast('Введите пароль!');
            return true;
        }

        return false; // Возвращаем false, если ошибок нет
    };

    const handleRegister = () => {
        if (check()) {
            // Если есть ошибки, прекращаем выполнение handleRegister
            return;
        }

        register().then(r => navigate('/verify', {
            state: {
                email,
                name,
                phone: `+7${phone.replace(/\D/g, '')}`,
                password
            }
        }));
    };

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
                    <span>Регистрация</span>
                </div>
                <Input
                    isRequired
                    fullWidth
                    type='text'
                    label='Имя'
                    defaultValue=''
                    value={name}
                    onChange={handleNameChange}
                    size='lg'
                    className='mb-5'
                />

                <Input
                    isRequired
                    fullWidth
                    type='text'
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

                <Button
                    fullWidth
                    onPress={handleRegister}
                    size='lg'
                    color='primary'
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
