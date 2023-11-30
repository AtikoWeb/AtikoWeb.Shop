import React, { useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';

function Filter({ close, onFilterChange }) {
	const [checkedFilter, setCheckedFilter] = useState('');

	const onChecked = (value) => {
		setCheckedFilter(value);
	};

	const submit = () => {
		onFilterChange(checkedFilter);
		close();
	};

	const variants = [
		{ id: 0, name: 'Самые популярные', value: '' },
		{ id: 1, name: 'Cамые дорогие', value: 'maxPrice' },
		{ id: 2, name: 'Самые дешевые', value: 'minPrice' },
	];

	return (
		<div className='mx-3 mt-3'>
			<div className='flex justify-between mb-3'>
				<span className='text-2xl font-bold'>Показать сначала</span>

				<IoCloseSharp
					className='text-3xl'
					onClick={close}
				/>
			</div>

			<div className='form-control mb-3'>
				{variants.map((obj) => (
					<label
						key={obj.id}
						className='label'
						onClick={() => onChecked(obj.value)}
					>
						<span className='text-lg'>{obj.name}</span>
						<input
							type='radio'
							name='radio-10'
							className='radio checked:bg-primary'
							defaultChecked={obj.value === checkedFilter ? true : false}
						/>
					</label>
				))}
			</div>
			<div className='w-full bg-white/[.8] flex'>
				<button
					onClick={submit}
					className='btn btn-primary font-bold flex-1 normal-case text-lg'
				>
					Применить
				</button>
			</div>
		</div>
	);
}

export default Filter;
