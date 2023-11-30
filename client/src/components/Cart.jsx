import React from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Cart({ visible = false }) {
	const itemCount = useSelector((state) => state.cart.count);
	const totalPrice = useSelector((state) => state.cart.totalPrice);

	// форматирует количество товаров в виде текста
	const formatItems = (count) => {
		const cases = [2, 0, 1, 1, 1, 2];
		const titles = ['товар', 'товара', 'товаров'];

		const titleIndex =
			count % 100 > 4 && count % 100 < 20 ? 2 : cases[Math.min(count % 10, 5)];

		const formattedCount = `${count}`;
		const formattedTitle = titles[titleIndex];

		return (
			<span>
				{formattedCount}
				<span className='text-gray-100/[.6] pl-1.5'>{formattedTitle}</span>
			</span>
		);
	};

	return (
		<Link to={'/cart'}>
			<div
				className={`fixed bottom-0 z-[1] px-2 w-screen bg-white pt-5 h-24 shadow-black shadow-2xl ${
					visible ? 'block' : 'hidden'
				}`}
			>
				<div
					className={`bg-primary text-white font-semibold h-16 flex justify-between items-center px-3 rounded-xl`}
				>
					<div className='text-xl flex items-center'>
						<span>{formatItems(itemCount)}</span>
					</div>
					<span className='text-xl -ml-9'>
						{totalPrice
							.toString()
							.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}{' '}
						₸
					</span>
					<FaArrowRightLong className='text-xl text-gray-100/[.6]' />
				</div>
			</div>
		</Link>
	);
}

export default Cart;
