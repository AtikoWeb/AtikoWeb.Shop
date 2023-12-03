import { Button, Image, Spinner } from '@nextui-org/react';
import axios from '../../axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import { LuLogOut } from 'react-icons/lu';
import { userLoggedOut } from '../../redux/slices/userSlice';
import ModalWindow from '../components/Modal';
import { BottomSheet } from 'react-spring-bottom-sheet';

function Profile() {
	const userId = useSelector((state) => state.user.userId);
	const [user, setUser] = useState({ name: '', phone: '' });
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const [isInView, setIsInView] = useState(true);
	const dispatch = useDispatch();
	const [isOpen, setIsOpen] = useState(false);
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

	const menuItems = [
		{
			name: 'Пароль',
			desc: 'Сменить пароль',
		},
		{
			name: 'Мои заказы',
			desc: 'Посмотреть активные заказы',
		},
		{
			name: 'История заказов',
			desc: 'Посмотреть историю заказов',
		},
	];

	useEffect(() => {
		const getUser = async () => {
			try {
				const { data } = await axios.get('/user/get-one', {
					params: { id: userId },
				});
				setUser({ name: data.username, phone: data.phone });
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching user data:', error);
			}
		};
		getUser();
	}, [userId]);

	// Логика для отображения обновленного состояния user
	useEffect(() => {
		console.log(user);
	}, [user]);

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
				<Spinner />
			</div>
		);
	}

	const logOut = () => {
		dispatch(userLoggedOut());
		localStorage.removeItem('userId');
		navigate('/');
	};

	const handleLogout = () => {
		setIsOpen(true);
	};

	return (
		<div className='mx-auto lg:mt-5 rounded-2xl bg-white lg:h-screen h-full w-full'>
			<div
				className={`flex lg:sticky ${
					!isInView && 'bg-white/[.5] backdrop-blur-lg'
				} fixed top-0 justify-between lg:mt-5 z-[1] h-16 rounded-xl w-full items-center`}
			>
				<Button
					size='sm'
					className='normal-case -ml-2 bg-transparent flex justify-start'
					onClick={() => navigate(-1)}
				>
					<IoIosArrowBack className='text-4xl' />
				</Button>
				<span className={`text-xl font-bold ${isInView ? 'hidden' : 'flex'}`}>
					Профиль
				</span>

				<Button
					size='sm'
					className='bg-transparent -mr-1'
				></Button>
			</div>

			<div>
				<div className='px-5 pt-3 grid place-content-center lg:px-32'>
					<Image
						className='h-44 z-0'
						src='/avatar.png'
					/>
					<div className='mb-5 grid text-center'>
						<span className='font-black text-3xl pb-1'>{user.name}</span>
						<span className='text-md text-neutral-500'>{user.phone}</span>
					</div>
				</div>
				<div className='w-full px-3'>
					{menuItems.map((obj) => (
						<Button
							fullWidth
							className='bg-neutral-100 mb-3 px-3 h-16 rounded-lg flex items-center justify-between'
						>
							<div className='grid'>
								<span className='text-lg font-bold text-left'>{obj.name}</span>
								<span className='text-md text-neutral-400'>{obj.desc}</span>
							</div>
							<IoIosArrowForward className='text-xl' />
						</Button>
					))}
					<Button
						onPress={handleLogout}
						fullWidth
						className='bg-neutral-100 mb-3 px-3 h-16 rounded-lg flex items-center justify-between'
					>
						<div className='grid'>
							<span className='text-lg font-bold text-left'>Выйти</span>
							<span className='text-md text-neutral-400'>
								Выйти из аккаунта
							</span>
						</div>
						<LuLogOut className='text-xl' />
					</Button>
				</div>
			</div>
			{isMobile ? (
				<BottomSheet
					open={isOpen}
					onDismiss={() => setIsOpen(false)}
					defaultSnap={({ maxHeight }) => maxHeight / 1.5}
					snapPoints={({ maxHeight }) => [
						maxHeight - maxHeight / 1.5,
						maxHeight - maxHeight / 1.5,
					]}
					draggable={true}
				>
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
									onClick={() => setIsOpen(false)}
									className='font-bold bg-white flex-1 normal-case text-lg'
								>
									Отмена
								</Button>
							</div>
						</div>
					</div>
				</BottomSheet>
			) : (
				<ModalWindow
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					size='xl'
					children={
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
										onClick={() => setIsOpen(false)}
										className='font-bold bg-white flex-1 normal-case text-lg'
									>
										Отмена
									</Button>
								</div>
							</div>
						</div>
					}
				/>
			)}
		</div>
	);
}

export default Profile;
