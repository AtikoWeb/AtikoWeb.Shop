import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { IoIosArrowBack } from 'react-icons/io';
import { BottomSheet } from 'react-spring-bottom-sheet';
import DetailProduct from './DetailProduct';
import Filter from '../components/Filter';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice';
import { Button } from '@nextui-org/react';
import ProductList from '../components/ProductList';
import { fetchCategory } from '../../redux/slices/categorySlice';

function Category() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const [isFilter, setIsFilter] = useState(false);
	const dispatch = useDispatch();
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	const [isInView, setIsInView] = useState(true);
	const categories = useSelector((state) => state.categories);
	const isCategoriesLoading = categories.categories.status === 'loading';
	const isCategoriesError = categories.categories.status === 'error';
	const CategoriesItems = categories.categories.items.category;
	const [category, setCategory] = useState({ id: '', name: '' });

	useEffect(() => {
		dispatch(fetchCategory());
	}, []);

	useEffect(() => {
		if (!isCategoriesLoading || !isCategoriesError) {
			const foundCategory = CategoriesItems.find((obj) => obj.id === id);
			setCategory(foundCategory || { id: '', name: '' });
		}
	}, [isCategoriesLoading, isCategoriesError, CategoriesItems, id]);

	const goBack = () => {
		if (isMobile) {
			navigate(-1);
		}
		navigate('/');
		dispatch(fetchProducts());
	};

	useEffect(() => {
		dispatch(fetchProducts({ categoryId: id }));
	}, [id]);

	const sort = (value) => {
		dispatch(fetchProducts({ filter: value }));
	};

	const clickFilter = () => {
		setIsProduct(false);
		setIsFilter(true);
		setIsOpen(true);
	};

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

	return (
		<div className='overflow-x-hidden lg:h-screen'>
			<div
				className={`flex lg:sticky ${
					!isInView && 'bg-white/[.5] backdrop-blur-lg'
				} fixed top-0 justify-between lg:mt-5 z-[2] h-16 rounded-xl bg-white w-full items-center`}
			>
				<Button
					size='sm'
					className='normal-case -ml-2 bg-transparent flex justify-start'
					onClick={goBack}
				>
					<IoIosArrowBack className='text-4xl' />
				</Button>
				<span className={`text-xl font-bold ${isInView ? 'hidden' : 'flex'}`}>
					{category && category.name}
				</span>

				<Button
					size='sm'
					className='bg-transparent -mr-1'
					onClick={clickFilter}
				>
					<svg
						width='30px'
						height='30px'
						viewBox='0 0 24 24'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M10 8L20 8'
							stroke='#222222'
							stroke-linecap='round'
							stroke-width='1.5'
						/>
						<path
							d='M4 16L14 16'
							stroke='#222222'
							stroke-linecap='round'
							stroke-width='1.5'
						/>
						<ellipse
							cx='7'
							cy='8'
							rx='3'
							ry='3'
							transform='rotate(90 7 8)'
							stroke='#222222'
							stroke-linecap='round'
							stroke-width='1.5'
						/>
						<ellipse
							cx='17'
							cy='16'
							rx='3'
							ry='3'
							transform='rotate(90 17 16)'
							stroke='#222222'
							stroke-linecap='round'
							stroke-width='1.5'
						/>
					</svg>
				</Button>
			</div>

			<div className='mt-20 lg:mt-8'>
				<div className='w-full mx-3 mt-3 mb-3 lg:mb-5 flex justify-between'>
					<span className='text-2xl lg:text-3xl font-black w-80'>
						{category && category.name}
					</span>
				</div>

				<div className=''>
					<ProductList display='grid' />
				</div>
			</div>
		</div>
	);
}

export default Category;
