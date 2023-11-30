import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../redux/slices/productSlice';

function Search({ isScreen = false }) {
	return (
		<Link
			className='text-gray-400 bg-neutral-200/60 hover:bg-neutral-200 gap-2 items-center flex justify-center font-semibold text-lg rounded-xl h-10  mt-3 w-full px-3'
			to={!isScreen && '/search'}
		>
			<BsSearch className='text-xl text-gray-400' />
			<span>Поиск</span>
		</Link>
	);
}

export default Search;
