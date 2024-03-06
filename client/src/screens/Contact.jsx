import { Button } from '@nextui-org/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoLogoWhatsapp } from 'react-icons/io5';

function Contact() {
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

	const navigate = useNavigate();

	return (
		<div className='mx-auto overflow-x-hidden mt-14 md:mt-0 rounded-2xl bg-white lg:h-screen h-full w-full'>
			<div
				className={`flex lg:sticky 
					bg-white/[.5] backdrop-blur-lg fixed top-0 justify-between lg:mt-5 z-[1] h-16 rounded-xl w-full items-center`}
			>
				<Button
					size='sm'
					className='normal-case -ml-2 bg-transparent flex justify-start'
					onClick={() => navigate(-1)}
				>
					<IoIosArrowBack className='text-4xl' />
				</Button>
				<span className={`text-xl font-bold`}>Контакты</span>

				<Button
					size='sm'
					className='bg-transparent -mr-1'
				></Button>
			</div>
			<iframe
				src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2906.908716938562!2d76.92060601165777!3d43.232373479426506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x388369546ff87397%3A0x88f6f626eb8a19d7!2sAtikoWeb!5e0!3m2!1sru!2skz!4v1690374899794!5m2!1sru!2skz'
				width='600'
				height='450'
				className='mx-auto px-5 w-full mt-5'
				allowFullScreen=''
				loading='lazy'
				referrerPolicy='no-referrer-when-downgrade'
			/>

			<div className='w-full mt-5 px-5'>
				<div className='flex gap-5 rounded-xl justify-center'>
					<div className='grid place-content-center rounded-xl place-items-center w-40 bg-neutral-100 cursor-pointer hover:bg-neutral-200 h-28'>
						<span className='text-2xl font-bold text-left'>
							<a href='tel:+77086001010'>
								<FaPhoneAlt className='text-5xl md:text-5xl' />
							</a>
						</span>
					</div>
					<div className='grid place-content-center rounded-xl place-items-center w-40 bg-green-500 hover:bg-green-600 h-28'>
						<span className='text-2xl font-bold text-left'>
							<a href='https://wa.me/+77086001010?text=Здравствуйте! Хочу задать вопрос об автоматизации'>
								<IoLogoWhatsapp className='text-5xl md:text-6xl text-white' />
							</a>
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Contact;
