import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../axios';
import { userLoggedIn } from '../../redux/slices/userSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function SignIn() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const handlePhoneChange = (e) => {
		console.log('Phone:', e.target.value);
		setPhone(e.target.value);
	};

	const handlePasswordChange = (e) => {
		console.log('Password:', e.target.value);
		setPassword(e.target.value);
	};

	const showToast = (message) => {
		toast.error(message, {
			position: 'top-right',
			autoClose: 3000,
			className: 'rounded-xl bg-base-100',
		});
	};

	const user = { phone, password };

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
				showToast('Неверный телефон или пароль!');
			} else {
				// Другие ошибки
				showToast('Ошибка входа: ' + error.response.data.message);
			}
		}
	};

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
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
					<span>Вход в аккаунт</span>
				</div>

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
