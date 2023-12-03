import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignUp() {
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const handleNameChange = (e) => {
		setName(e.target.value);
	};

	const handlePhoneChange = (e) => {
		setPhone(e.target.value);
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

	const newUser = { name, phone, password };

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

		register();
		navigate('/verify', { state: { phone, email } });
	};

	return (
		<div className='bg-white mx-auto mt-5 rounded-2xl lg:h-screen h-full w-full'>
			<Button
				onPress={() => navigate('/')}
				size='sm'
				className='normal-case absolute top-3 lg:top-10 -ml-2 bg-transparent flex justify-start'
			>
				<IoIosArrowBack className='text-4xl' />
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
					type='number'
					value={phone}
					onChange={handlePhoneChange}
					label='Телефон'
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
								<FaEyeSlash className='text-xl' />
							) : (
								<FaEye className='text-xl' />
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
