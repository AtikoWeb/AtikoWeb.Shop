import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack, IoIosWarning } from 'react-icons/io';
import { Button } from '@nextui-org/react';

function Refund() {
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
				<span className={`text-xl font-bold`}>Политика возврата</span>

				<Button
					size='sm'
					className='bg-transparent -mr-1'
				></Button>
			</div>

			<div className='flex mx-3 lg:mx-5 mt-5 text-2xl gap-2'>
				<IoIosWarning className='text-warning-500 mt-1' />
				<span className='font-bold'>Важно!</span>
			</div>
		</div>
	);
}

export default Refund;
