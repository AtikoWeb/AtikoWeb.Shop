import React, { useEffect, useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { showCart, addToCart } from '../../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';
import { RiScales2Line } from 'react-icons/ri';
import {
	Button,
	Image,
	Pagination,
	Radio,
	RadioGroup,
	ScrollShadow,
} from '@nextui-org/react';
import axios from '../../axios';

function DetailProduct({ close, product, images, isLoading }) {
	const [count, setCount] = useState(1);
	const [sizes, setSizes] = useState([]);
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	const dispatch = useDispatch();
	const token = process.env.REACT_APP_API_TOKEN;
	const [barcodes, setBarcodes] = useState([]);
	const [sizeNames, setSizeNames] = useState([]);
	const [activeSize, setActiveSize] = useState(sizeNames[0]);
	const [activeBarcode, setActiveBarcode] = useState(barcodes[0]);

	const selectSize = (size) => {
		setActiveSize(size);
	};

	useEffect(() => {
		axios
			.get(`/product/products/${product.productId}`, {
				headers: {
					'x-auth-token': token,
				},
			})
			.then((res) => {
				setSizes(res.data.sizes);
			})
			.catch((err) => {
				console.warn(err);
			});
	}, [product.productId, token]);

	const increment = () => {
		setCount(count + 1);
	};

	const decrement = () => {
		setCount(count - 1);
	};

	useEffect(() => {
		const sizNamesList = sizes.map((obj) => {
			return obj.sizeName;
		});
		setSizeNames(sizNamesList);

		const barcodeList = sizes.map((obj) => {
			return obj.barcode;
		});
		setBarcodes(barcodeList);
	}, []);

	const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;
	// фильтруем список изображений по артикулу продукта
	const imageList = images.filter((image) => image.name.includes(product.art));
	const image = imageList.length > 0 ? imageList[0].name : '';

	const cartItem = {
		productId: product.productId,
		name: product?.name,
		price: product?.price,
		image: `${API_URL_IMAGES}${image}`,
		qty: count,
		size: activeSize,
		barcode: activeBarcode,
	};

	// Функция добавления
	const add = () => {
		dispatch(addToCart({ ...cartItem }));
		dispatch(showCart());
		close();
		setCount(1);
	};

	return (
		<>
			{isMobile ? (
				<div className='mb-24'>
					<div className='relative rounded-2xl'>
						<Image
							shadow='sm'
							radius='lg'
							width='100%'
							isLoading={isLoading}
							className='w-full rounded-2xl z-0 object-contain h-[350px]'
							src={`${API_URL_IMAGES}${image}`}
						/>
						<div className='absolute top-2 left-2 bg-white  shadow-xl backdrop-blur-sm p-5 rounded-2xl gap-2 grid place-content-center place-items-center font-semibold'>
							<span className='text-lg font-bold'>{product.art}</span>
						</div>
					</div>

					<div
						className='absolute right-1.5 p-3 top-2 bg-white backdrop-blur-sm shadow-2xl shadow-black rounded-full'
						onClick={close}
					>
						<IoCloseSharp className='text-2xl' />
					</div>

					<div>
						<div className='mx-3 mt-5 flex justify-between'>
							<span className='text-xl w-52 font-black'>{product?.name}</span>
							<span className='text-[20px] text-black font-black'>
								{product?.price
									.toString()
									.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}{' '}
								<span className='text-lg'>₸</span>
							</span>
						</div>
						<div className='mt-1'>
							<div className={`px-3 w-full`}>
								<div className='grid mt-5'>
									<span className='font-black text-lg'>Описание</span>
									<span className='text-lg'>{product.desc}</span>
								</div>
							</div>
						</div>

						<div className='fixed bottom-0 p-3 w-full bg-white/[.8] flex justify-between'>
							<div className='flex gap-3 pr-3'>
								<Button
									size='md'
									className='btn normal-case text-lg mt-1 disabled:bg-gray-100 flex-1'
									onClick={decrement}
									disabled={count === 1 && true}
								>
									-
								</Button>
								<span className='mt-3 flex-1 text-center font-bold'>
									{count}
								</span>
								<Button
									size='md'
									className='btn normal-case mt-1 text-lg flex-1'
									onClick={increment}
								>
									+
								</Button>
							</div>

							<Button
								onClick={add}
								color='primary'
								size='lg'
								className='btn btn-primary font-bold flex-1 normal-case text-md'
							>
								Добавить
							</Button>
						</div>
					</div>
				</div>
			) : (
				<div className='mb-24 flex w-full'>
					<div className='relative rounded-2xl pt-5'>
						<Image
							shadow='sm'
							radius='lg'
							width='100%'
							isLoading={isLoading}
							className='w-[400px] z-0 object-contain h-[350px]'
							src={`${API_URL_IMAGES}${image}`}
						/>
						<Pagination
							total={2}
							initialPage={1}
							color='primary'
							className='flex justify-center mt-3'
						/>
					</div>

					<div
						className='absolute cursor-pointer right-1.5 top-2 bg-white/[.8] backdrop-blur-md p-2 shadow-large rounded-full'
						onClick={close}
					>
						<IoCloseSharp className='text-2xl md:text-3xl' />
					</div>

					<div className='w-[550px]'>
						<div className='mx-5 mt-6 grid'>
							<span className='text-3xl font-black'>{product?.name}</span>
							<span className='text-lg w-60 mb-2'>{product?.art}</span>
							<div className='flex gap-3'>
								<span className='text-3xl pt-1 font-black'>
									{product.price
										.toString()
										.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}{' '}
									<span className='text-2xl'>₸</span>
								</span>
								<div className='px-5 bg-white/[.8] flex'>
									<div className='flex pt-1 gap-3 pr-3'>
										<Button
											size='sm'
											className='btn normal-case text-lg disabled:bg-gray-100'
											onClick={decrement}
											disabled={count === 1 && true}
										>
											-
										</Button>
										<span className='mt-1 text-center font-bold'>{count}</span>
										<Button
											size='sm'
											className='btn normal-case text-lg'
											onClick={increment}
										>
											+
										</Button>
									</div>

									<Button
										onClick={add}
										color='primary'
										className='font-bold normal-case text-md'
									>
										Добавить
									</Button>
								</div>
							</div>
							{/* <hr className='mt-3' /> */}
							{/* <div>
								<div className='pb-3 pt-3'>
									<span className='font-bold text-xl'>Выберите размер</span>
								</div>
								<RadioGroup
									size='lg'
									color='warning'
									defaultValue='S'
									orientation='horizontal'
								>
									{sizes.map((obj) => (
										<>
											<Radio
												onClick={() => selectSize(obj)}
												className='px-3'
												value={obj.sizeName}
											>
												{obj.sizeName}
											</Radio>
										</>
									))}
								</RadioGroup>
							</div> */}
						</div>
						<hr className='mt-3' />

						<ScrollShadow
							className={`px-5 w-full h-[280px] overflow-y-scroll scrollbar-hide`}
						>
							<div className='grid mt-5'>
								<span className='font-bold text-xl'>Описание</span>
								<span className='text-lg mb-2'>{product.desc}</span>
							</div>
						</ScrollShadow>
					</div>
				</div>
			)}
		</>
	);
}

export default DetailProduct;
