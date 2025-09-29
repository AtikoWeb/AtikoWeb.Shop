import React, {useEffect, useRef, useState} from 'react';
import {Button, Input} from '@nextui-org/react';
import {toast} from 'react-toastify';
import axios from '../../axios';
import {useLocation, useNavigate} from 'react-router-dom';
import Cookies from 'js-cookie';
import {useDispatch} from "react-redux";
import {userLoggedIn} from "../../redux/slices/userSlice.js";

const Verify = () => {
    const inputRefs = Array(4).fill(0).map(() => useRef(null));
    const [isLoadingVerify, setIsLoadingVerify] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isDisabledVerify, setIsDisabledVerify] = useState(true);
    const [isLoadingNewCode, setIsLoadingNewCode] = useState(false);
    const dispatch = useDispatch();
    const [isResendDisabled, setIsResendDisabled] = useState(true); // Состояние для блокировки кнопки "Отправить еще код"
    const [remainingTime, setRemainingTime] = useState(60); // Изначально 60 секунд
    const [intervalId, setIntervalId] = useState(null); // Состояние для идентификатора интервала

    const navigate = useNavigate();
    const location = useLocation();
    const ATIKOWEB_URL = localStorage.getItem('AtikowebURL');
    const currentDomain = window.location.hostname || process.env.REACT_APP_DOMAIN;
    const db_code = Cookies.get('db_code');
    const {phone, name, email, password} = location.state;

    const showToast = (message) => {
        toast.error(message, {
            position: 'top-right',
            autoClose: 3000,
            className: 'rounded-xl bg-base-100',
        });
    };


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

    const handleInputChange = (index, event) => {
        const value = event.target.value;
        let updatedCode = '';
        if (!isNaN(value) && value !== '' && value.length === 1) {
            // Обновляем соответствующий символ в состоянии verificationCode
            updatedCode = verificationCode.slice(0, index) + value + verificationCode.slice(index + 1);
            // Проверяем, достигла ли длина текущего инпута максимального значения
            if (index < 3) {
                inputRefs[index + 1].current.focus();
            }
        } else {
            // Удаляем соответствующий символ из состояния verificationCode
            updatedCode = verificationCode.slice(0, index) + verificationCode.slice(index + 1);
            // Проверяем, нажат ли Backspace и находится ли курсор в начале строки
            if (event.key === 'Backspace' && event.target.selectionStart === 0 && index > 0) {
                inputRefs[index - 1].current.focus();
            }
        }
        setVerificationCode(updatedCode);
    };


    console.log(verificationCode);

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && index > 0 && event.target.value === '') {
            // Переход к предыдущему инпуту
            inputRefs[index - 1].current.focus();
        }
    };


    const handleVerify = async () => {
        setIsLoadingVerify(true);
        try {
            const data = {
                phone,
                code: verificationCode,
            };

            const response = await axios.post('/user/verify', data, {
                params: {
                    db_code
                }
            });

            const userId = response.data.userId;

            if (userId) {
                const res = await axios.post(`https://${ATIKOWEB_URL}/?code=${db_code}&action=SITE_NEW_USER&user=${name}&email=${email}&telefon=${phone}&pwd=${password}`);
                if (res.status === 200) {
                    dispatch(userLoggedIn(userId));
                    Cookies.set('userId', userId);
                    navigate('/');
                }
            }
        } catch (error) {
            if (error.response.status === 401) {
                showToast('Неверный код!');
                setIsLoadingVerify(false);
            } else {
                showToast('Ошибка входа: ' + error.response.data.message);
            }
        }
    };

    const handleResendCode = async () => {
        setIsLoadingNewCode(true);
        try {
            // Очистка предыдущего интервала перед установкой нового
            clearInterval(intervalId);

            // Создание нового интервала для таймера
            const timerId = setInterval(() => {
                setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);

            // Сохранение идентификатора нового интервала
            setIntervalId(timerId);

            const response = await axios.post('user/send-new-code', {
                phone,
                domain: currentDomain,
            });

            if (response.status === 200) {
                setIsLoadingNewCode(false);
                setIsResendDisabled(true);
                setRemainingTime(60);

            }
        } catch (error) {
            setIsLoadingNewCode(false);
            showToast('Ошибка при отправке кода');
        }
    };


    useEffect(() => {
        // Обновление таймера каждую секунду
        const timerId = setInterval(() => {
            setRemainingTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0)); // Проверка на минимальное значение времени
        }, 1000);

        // Проверка, достигло ли время 0, и возврат функции очистки интервала
        if (remainingTime === 0) {
            clearInterval(timerId);
            setIsResendDisabled(false);
        }

        // Возвращение функции очистки интервала
        return () => {
            clearInterval(timerId);
        };
    }, [remainingTime]); // Зависимостью должно быть remainingTime, а не isResendDisabled

    useEffect(() => {
        setIsDisabledVerify(verificationCode.length < 4);
    }, [verificationCode]);

    const inputsValue = verificationCode.split('');


    return (
        <div className='bg-white lg:mt-5 rounded-xl lg:h-60 pt-5'>
            <form className='grid place-content-center'>

                    <span
                        id='helper-text-explanation'
                        className='pt-5 text-3xl px-3 text-gray-500 dark:text-gray-400'
                    >
                       Введите код из 4-х цифр, отправленный на WhatsApp
                    </span>

                <span
                    className={'text-3xl pt-3 px-3 text-gray-700 font-semibold'}>
                        {getMaskPhone(`+7${phone}`)
                        }</span>

                <div className='mb-10 mt-10 mx-5 flex justify-center space-x-2 rtl:space-x-reverse'>
                    {inputRefs.map((ref, index) => (
                        <div key={index}>
                            <Input
                                classNames={{
                                    input: [
                                        "text-3xl text-center",
                                    ],
                                }}
                                type='number'
                                maxLength={1}
                                value={inputsValue[index] || ''} // Добавляем проверку на пустое значение, чтобы не возникало ошибки
                                onChange={(e) => handleInputChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                ref={ref}
                                variant={'underlined'}
                                required
                            />
                        </div>
                    ))}
                </div>


                <div className='mx-3 grid gap-5 mt-5'>
                    <Button isDisabled={isDisabledVerify} isLoading={isLoadingVerify} color={"primary"}
                            size={"lg"}
                            onPress={handleVerify}>Проверить</Button>
                    <Button isLoading={isLoadingNewCode} size={"lg"} onPress={handleResendCode}
                            isDisabled={isResendDisabled}>Отправить
                        еще
                        код</Button>

                    {isResendDisabled && remainingTime > 0 &&
                        <p>Вы можете отправить еще код через: {remainingTime} секунд</p>
                    }
                </div>
            </form>
        </div>
    );
};

export default Verify;
