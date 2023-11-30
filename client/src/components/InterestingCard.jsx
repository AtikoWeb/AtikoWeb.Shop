import { Card, CardHeader, Image } from '@nextui-org/react';
import React from 'react';
import { Link } from 'react-router-dom';

function InterestingCard({ image, id, name }) {
	const isFullWidth = id === 0 || id === 3;

	return (
		<Link
			to={`/category/${name}`}
			className={`${isFullWidth ? 'col-span-2' : ''}`}
		>
			<Card className={`h-36 lg:h-52`}>
				<CardHeader className='absolute bg-black/10 h-full z-[1] flex-col !items-start'>
					<span className='text-lg lg:text-xl text-white -mt-1 font-bold'>
						{name}
					</span>
				</CardHeader>
				<Image
					removeWrapper
					alt='Card background'
					className='z-0 w-full h-full object-top object-cover'
					src={image}
				/>
			</Card>
		</Link>
	);
}

export default InterestingCard;
