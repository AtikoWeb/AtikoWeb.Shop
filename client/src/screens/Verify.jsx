import { Button } from '@nextui-org/react';
import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../../axios';
import { userRegistered } from '../../redux/slices/userSlice';

const Verify = () => {
	const inputRefs = Array(4)
		.fill(0)
		.map(() => useRef(null));
	const [verificationCode, setVerificationCode] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	const phone = location.state.phone;
	const email = location.state.email;

	const handleInputChange = (index, event) => {
		const value = event.target.value;
		if (value !== '' && !isNaN(value)) {
			const nextIndex = index < 3 ? index + 1 : index;
			inputRefs[nextIndex].current.focus();
		}

		const updatedCode = inputRefs.map((ref) => ref.current.value).join('');
		setVerificationCode(updatedCode);
	};

	const handleKeyDown = (index, event) => {
		if (event.key === 'Backspace' && index > 0) {
			if (event.target.value === '') {
				inputRefs[index - 1].current.focus();
			}
		}
	};

	const showToast = (message) => {
		toast.error(message, {
			position: 'top-right',
			autoClose: 3000,
			className: 'rounded-xl bg-base-100',
		});
	};

	const data = {
		phone,
		code: verificationCode,
	};

	const handleVerify = async () => {
		try {
			const response = await axios.post('/user/verify', data);
			const userId = response.data.userId;
			dispatch(userRegistered(userId));
			localStorage.setItem('userId', userId);
			navigate('/');
		} catch (error) {
			if (error.response.status === 401) {
				// Ошибка авторизации (неверный пароль)
				showToast('Неверный код!');
			} else {
				// Другие ошибки
				showToast('Ошибка входа: ' + error.response.data.message);
			}
		}
	};

	return (
		<div className='bg-white lg:mt-5 rounded-xl lg:h-60 pt-5'>
			<form className='grid place-content-center'>
				<div className='mb-2 flex justify-center space-x-2 rtl:space-x-reverse'>
					{inputRefs.map((ref, index) => (
						<div key={index}>
							<input
								type='number'
								maxLength='1'
								onChange={(e) => handleInputChange(index, e)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								ref={ref}
								style={{ appearance: 'textfield' }}
								className='block w-14 h-14 py-3 text-lg font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
								required
							/>
						</div>
					))}
				</div>
				<p
					id='helper-text-explanation'
					className='pt-5 pb-5 text-lg px-3 text-gray-500 dark:text-gray-400'
				>
					Введите код из 4-х цифр, который был отправлен на {email}
				</p>
				<div className='mx-3'>
					<Button
						fullWidth
						color='primary'
						size='lg'
						className='font-bold'
						onPress={handleVerify}
					>
						Проверить
					</Button>
				</div>
			</form>
		</div>
	);
};

export default Verify;
