import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategory } from '../../redux/slices/categorySlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import { useNavigate } from 'react-router-dom';
import { transliterate } from 'transliteration';
import { FaChevronRight } from 'react-icons/fa';

function CategoriesList({ display, isSearch }) {
	const containerRef = useRef(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

	const categories = useSelector((state) => state.categories);
	const isCategoriesLoading = categories.categories.status === 'loading';
	const isCategoriesError = categories.categories.status === 'error';
	const CategoriesItems = categories.categories.items.category;
	const selectedCategory = useSelector(
		(state) => state.categories.selectedCategory
	);

	const onClick = (category) => {
		dispatch(setSelectedCategory(category));
		dispatch(fetchProducts({ categoryId: category.id }));

		if (selectedCategory != category) {
			navigate(`/category/${category.id}`);
		}
	};

	const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;

	const transLiterate = (name) => {
		const categoryNameEnglish = transliterate(name, { unknown: '-' });
		const categoryNameSlug = categoryNameEnglish.replace(/\s+/g, '-');
		return categoryNameSlug;
	};
	return (
		<>
			{isSearch ? (
				<div className='grid lg:grid-cols-1'>
					{isCategoriesLoading || isCategoriesError ? (
						<></>
					) : (
						CategoriesItems &&
						CategoriesItems.map((obj, index) =>
							isCategoriesLoading || isCategoriesError ? (
								''
							) : (
								<>
									<div className='flex items-center justify-between w-full'>
										<button
											key={obj.id}
											onClick={() => onClick(obj)}
											className={`relative flex items-center gap-2 text-left w-full text-md font-semibold rounded-xl h-14`}
											data-id={obj.id}
										>
											<img
												src={`${API_URL_IMAGES}/${transLiterate(obj.name)}.jpg`}
												alt=''
												className='h-14 object-contain'
											/>
											{obj.name}
										</button>
										<FaChevronRight className='text-neutral-400' />
									</div>
									<hr />
								</>
							)
						)
					)}
				</div>
			) : (
				<div
					className={`overflow-x-scroll scrollbar-hide z-10 rounded-b-3xl ${
						display === 'flex' && 'flex'
					} lg:grid lg:grid-cols-1 gap-3 overflow-hidden px-3`}
					ref={containerRef}
				>
					{isCategoriesLoading || isCategoriesError ? (
						<></>
					) : (
						CategoriesItems &&
						CategoriesItems.map((obj, index) =>
							isCategoriesLoading || isCategoriesError ? (
								''
							) : (
								<>
									<div
										key={obj.id}
										className=''
									>
										<button
											onClick={() => onClick(obj)}
											className={`relative ${
												display === 'flex'
													? 'w-52 bg-neutral-200/60'
													: 'w-full text-left'
											} px-3 flex  items-center gap-2 text-md font-semibold rounded-xl h-12 mb-3`}
											data-id={obj.id}
										>
											<img
												src={`${API_URL_IMAGES}/${transLiterate(obj.name)}.jpg`}
												alt=''
												className='h-10'
											/>
											{obj.name}
										</button>
									</div>
								</>
							)
						)
					)}
				</div>
			)}
		</>
	);
}

export default CategoriesList;
