import { Spinner } from '@nextui-org/react';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import axios from '../../axios';
import { BottomSheet } from 'react-spring-bottom-sheet';
import DetailProduct from '../screens/DetailProduct';
import ModalWindow from './Modal';

function ProductList({ display = 'grid' }) {
	const products = useSelector((state) => state.products);
	const [isOpen, setIsOpen] = useState(false); // Состояние открытия/закрытия боттом-шита
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	const [clickedProduct, setClickedProduct] = useState({}); // Выбранный продукт
	const isProductsLoading = products.products.status === 'loading';
	const isProductsError = products.products.status === 'error';
	const productsItems = products.products.items.products;
	const [images, setImages] = useState([]);
	const categoryRefs = useRef({});
	const [isLoading, setIsLoading] = useState(true);
	const [columnCount, setColumnCount] = useState(3);

	useEffect(() => {
		axios
			.get(`/images/get-images`)
			.then((res) => {
				setImages(res.data);
				setIsLoading(false);
			})
			.catch((err) => {
				console.warn(err);
			});
	}, []);

	useEffect(() => {
		axios
			.get(`/settings/`)
			.then((res) => {
				setColumnCount(res.data.config.column_count);
			})
			.catch((err) => {
				console.warn(err);
			});
	}, []);

	const clickProduct = (product) => {
		setClickedProduct(product);
		setIsOpen(true);
	};

	const renderProducts = () => {
		return (
			<div>
				<div
					className={`${display === 'grid' && 'grid'} ${
						isMobile ? 'grid-cols-2' : 'grid-cols-3'
					} ${
						display === 'flex' && 'flex px-3'
					} snap-x overflow-x-scroll gap-3`}
				>
					{productsItems.map((product, index) => (
						<>
							<ProductCard
								key={index}
								art={product.art}
								name={product.name}
								price={product.price}
								images={images}
								category={product.category}
								onClick={() => clickProduct(product)}
								isLoading={isLoading}
								weight={display === 'flex' ? 'w-44' : 'w-full'}
							/>
						</>
					))}
				</div>
			</div>
		);
	};

	return (
		<div>
			{isProductsLoading || isProductsError ? (
				<div className='flex w-screen justify-center items-center'>
					<Spinner />
				</div>
			) : (
				renderProducts()
			)}

			{isMobile ? (
				<BottomSheet
					open={isOpen}
					onDismiss={() => setIsOpen(false)}
					defaultSnap={({ maxHeight }) => maxHeight / 800}
					snapPoints={({ maxHeight }) => [
						maxHeight - maxHeight / 800,
						maxHeight - maxHeight / 800,
					]}
					draggable={true}
				>
					<DetailProduct
						product={clickedProduct}
						close={() => setIsOpen(false)}
						images={images}
						isMobile={true}
						isLoading={isLoading}
					/>
				</BottomSheet>
			) : (
				<ModalWindow
					isOpen={isOpen}
					size='5xl'
					children={
						<DetailProduct
							product={clickedProduct}
							close={() => setIsOpen(false)}
							images={images}
							isLoading={isLoading}
						/>
					}
				/>
			)}
		</div>
	);
}

export default ProductList;
