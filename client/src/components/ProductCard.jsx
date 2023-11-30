import { Card, CardBody, CardFooter, Image } from '@nextui-org/react';
import React from 'react';

function ProductCard({
	images,
	art,
	price = 0,
	name,
	onClick,
	isLoading,
	category,
	weight = 'w-40',
}) {
	const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;
	// фильтруем список изображений по артикулу продукта
	const imageList = images.filter((image) => image.name.includes(art));
	const image = imageList.length > 0 ? imageList[0].name : '';

	return (
		<Card
			shadow='none'
			isPressable
			className={`mb-3 z-0 snap-normal snap-start shrink-0 ${weight}`}
			onPress={onClick}
		>
			<CardBody className=''>
				<Image
					shadow='none'
					radius='lg'
					loading='lazy'
					width='100%'
					isLoading={isLoading}
					disableSkeleton={false}
					className='w-full object-cover h-44'
					src={`${API_URL_IMAGES}${image}`}
				/>
			</CardBody>
			<CardFooter className='text-small grid'>
				<span className='text-left text-xs md:text-sm'>{art}</span>
				<span className='text-left text-ellipsis truncate text-[15px] md:text-lg font-bold'>
					{name}
				</span>
				<span className='text-left text-ellipsis truncate text-neutral-400 w-36 md:w-44 text-[15px] md:text-lg font-bold'>
					{category.name}
				</span>
				<span className='flex md:text-lg text-[17px] font-bold'>
					{price.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')} ₸
				</span>
			</CardFooter>
		</Card>
	);
}

export default ProductCard;
