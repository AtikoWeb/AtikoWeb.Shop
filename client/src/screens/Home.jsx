import React, { useEffect, useState } from 'react';
import CategoriesList from '../components/CategoriesList';
import 'react-spring-bottom-sheet/dist/style.css';
import InterestingCard from '../components/InterestingCard';
import Search from '../components/Search';
import ProductList from '../components/ProductList';
import Header from '../components/Header';
import { Button } from '@nextui-org/react';
import { FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { setSelectedCategory } from '../../redux/slices/categorySlice';

function Home() {
	const [isScroll, setIsScroll] = useState(false);
	const [isInView, setIsInView] = useState(true);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

	const interesting = [
		{
			imageUrl:
				'https://img.freepik.com/free-psd/3d-render-sale-background-design_23-2149879175.jpg?w=2000&t=st=1700734626~exp=1700735226~hmac=59fc2c426084cb010d4758cc221469ab07bb6019ad7553ba5ea58ca536431289',
			name: 'Черная пятница',
		},
		{
			imageUrl:
				'https://img.freepik.com/free-photo/image-unrecognizable-man-makes-thumb-up-gesture_273609-25537.jpg?w=2000&t=st=1700735492~exp=1700736092~hmac=4ac23f82dc38d80424bb1344fb48e55a35aeac652a54a267590c7e7406dfec51',
			name: 'Топы',
		},
		{
			imageUrl:
				'https://img.freepik.com/free-psd/shopping-vertical-background_23-2150409475.jpg?w=826&t=st=1700735061~exp=1700735661~hmac=7dfd3e775b808c8ee176d6d371502a760280f42279a9aca6225c0903ff2f31fb',
			name: 'Скидки',
		},
		{
			imageUrl:
				'https://img.freepik.com/free-photo/3d-render-wallet-with-plastic-cards-gold-coins_107791-16642.jpg?w=1800&t=st=1700735581~exp=1700736181~hmac=6e5a24e6f9088057111bec6e2360018cf0b5036af94b50d7c73ad2e51b0b0f2f',
			name: 'В кредит и рассрочку',
		},
	];

	const handleScroll = (event) => {
		setIsScroll(event.target.scrollTop > 0);
	};

	useEffect(() => {
		dispatch(setSelectedCategory(null));
	}, []);

	return (
		<>
			<div
				onScroll={handleScroll}
				onTouchMove={handleScroll}
			>
				<div>
					<Header />
				</div>

				<div
					className={`bg-white pt-1 px-3 pb-3 sticky top-0 z-[2] lg:pt-3 lg:mt-5 lg:rounded-t-3xl ${
						isScroll && 'lg:shadow-lg rounded-b-3xl'
					}`}
				>
					<Search />
				</div>

				<div className='bg-white rounded-b-3xl px-3 pt-3 z-[1]'>
					<span className='text-2xl lg:text-3xl font-black'>Это интересно</span>
					<div className='grid grid-cols-3 pt-3 gap-2 w-full pb-6'>
						{interesting.map((obj, index) => (
							<InterestingCard
								key={index}
								image={obj.imageUrl}
								id={index}
								name={obj.name}
							/>
						))}
					</div>
				</div>
				<div className='lg:hidden'>
					<div className='flex mx-3 justify-between'>
						<span className='text-2xl mb-1 font-black'>Категории</span>
						<Button
							onClick={() => navigate('/search')}
							size='sm'
							variant='flat'
							endContent={<FaChevronRight />}
							className='text-md font-semibold bg-neutral-200/60'
						>
							Все
						</Button>
					</div>
					<div className='mt-3'>
						<CategoriesList display={'flex'} />
					</div>
				</div>
				<div className={`bg-white lg:mt-5 rounded-3xl pt-5`}>
					<span className='text-2xl lg:text-3xl mx-3 font-black'>
						Часто покупают
					</span>
					<div className='pb-10'>
						{isMobile ? <ProductList display='flex' /> : <ProductList />}
					</div>
				</div>
			</div>
		</>
	);
}

export default Home;
