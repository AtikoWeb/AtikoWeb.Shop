import React, { useState } from 'react';
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenuItem,
	NavbarMenu,
	Link,
	Button,
	NavbarMenuToggle,
} from '@nextui-org/react';

import { SiCashapp } from 'react-icons/si';
import { MdContactPhone } from 'react-icons/md';
import { FaPercent, FaUser } from 'react-icons/fa';
import { HiReceiptRefund } from 'react-icons/hi';
import { GiShop } from 'react-icons/gi';
import { BsFillPeopleFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userLoggedOut } from '../../redux/slices/userSlice';
import ModalWindow from './Modal';

export default function Header() {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

	const isAuth = useSelector((state) => state.user.isAuthenticated);

	const onPressButton = () => {
		// Перенаправить на домашнюю страницу, если не аутентифицирован, иначе остаться на текущей странице
		if (!isAuth) {
			navigate('/signin');
		}
	};

	const menuItems = [
		{
			name: 'О компании',
			icon: <BsFillPeopleFill />,
			link: '/about',
		},
		{
			name: 'Наши магазины',
			icon: <GiShop />,
			link: '/shops',
		},
		{
			name: 'Способы оплаты',
			icon: <SiCashapp />,
			link: '/payment-methods/',
		},
		{
			name: 'Политика возврата',
			icon: <HiReceiptRefund style={{ fontSize: 28 }} />,
			link: '/refund',
		},
		{
			name: 'Контакты',
			icon: <MdContactPhone style={{ fontSize: 28 }} />,
			link: '/contacts',
		},
		{
			name: 'Скидки',
			icon: <FaPercent />,
			link: '/sales',
		},
	];

	return (
		<Navbar className='rounded-xl z-[2] bg-white mt-0 lg:mt-5'>
			<NavbarContent
				className='sm:hidden'
				justify='start'
			>
				<NavbarMenuToggle />
			</NavbarContent>

			<NavbarContent
				className='lg:hidden pr-3'
				justify='center'
			>
				<img
					src='/aokia_logo.png'
					alt=''
					className='h-8'
				/>
			</NavbarContent>

			<NavbarContent className='hidden sm:flex gap-3'>
				{menuItems.map((obj) => (
					<NavbarItem>
						<Link
							color='foreground'
							href='#'
							className='text-sm'
						>
							{obj.name}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>

			<NavbarContent justify='end'>
				<NavbarItem className='hidden lg:flex'></NavbarItem>
				<NavbarItem>
					<Button
						onPress={onPressButton}
						size='sm'
						href='#'
						color='primary'
						variant={isAuth ? 'bordered' : 'solid'}
						className='font-bold'
					>
						{isAuth ? 'Мой профиль' : 'Войти'}
					</Button>
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu className='pt-5'>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link
							className='w-full flex text-xl mb-5 gap-3'
							color={'foreground'}
							href='#'
							size='lg'
						>
							<span className='text-neutral-500'>{item.icon}</span>
							{item.name}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
}
