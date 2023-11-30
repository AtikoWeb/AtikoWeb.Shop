import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { Button, Spinner } from '@nextui-org/react';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const colors = [
	'#0f172a',
	'#dc2626',
	'#f59e0b',
	'#84cc16',
	'#22c55e',
	'#06b6d4',
	'#0ea5e9',
	'#3b82f6',
	'#6366f1',
	'#a855f7',
	'#ec4899',
];

const columnCounts = [2, 3];

const Settings = () => {
	const [selectedColor, setSelectedColor] = useState('');
	const [selectedColumnCount, setSelectedColumnCount] = useState();
	const [isLoading, setIsLoading] = useState();

	const showToast = (message) => {
		toast.success(message, {
			position: 'top-right',
			autoClose: 3000,
			className: 'rounded-xl bg-base-100',
		});
	};

	const getData = () =>
		axios
			.get(`/settings/`)
			.then((response) => {
				setSelectedColumnCount(response.data.config.column_count || 2);
				setSelectedColor(response.data.config.main_color || '#0f172a');
			})
			.catch((error) => {
				setIsLoading();
				console.error('Error fetching settings:', error);
				handleOpen('error', 'Ошибка! Данные не получены!');
			});

	useEffect(() => {
		getData();
	}, []);

	const handleOpen = (color, message) => {
		setColorAlert(color);
		setMessageAlert(message);
		setOpen(true);
	};

	const handleColorChange = (color) => {
		setSelectedColor(color);
	};

	const handleColumnCountChange = (count) => {
		setSelectedColumnCount(count);
	};

	const handleSaveSettings = () => {
		const data = {
			mainColor: selectedColor,
			columnCount: selectedColumnCount,
		};

		axios
			.post(`/settings/`, data)
			.then(() => {
				setIsLoading();
				showToast('Настройки успешно сохранены!');
				getData();
			})
			.catch((error) => {
				console.error('Error saving settings:', error);
				handleOpen('error', 'Ошибка! Настройки не сохранены!');
			});
	};

	return (
		<>
			<div className='w-screen'>
				<div className='grid place-content-center mt-5'>
					{isLoading ? (
						<Spinner color='warning' />
					) : (
						<>
							<span className='text-xl font-bold mb-5'>
								Выберите главный цвет
							</span>

							<div className='grid md:grid-cols-5 grid-cols-4 gap-5 mb-5'>
								{colors.map((color) => (
									<Button
										variant='solid'
										className=''
										style={{ backgroundColor: color }}
										onClick={() => handleColorChange(color)}
									>
										{color === selectedColor && (
											<FaCheck className='text-white' />
										)}
									</Button>
								))}
							</div>

							<span className='text-xl font-bold mb-5'>
								Выберите кол-во колонок
							</span>
							<div className='mb-5 flex gap-5'>
								{columnCounts.map((item) => (
									<Button
										variant={selectedColumnCount === item && 'bordered'}
										key={item}
										onClick={() => handleColumnCountChange(item)}
										className='border-black'
									>
										{item}
									</Button>
								))}
							</div>

							<div>
								<Button
									fullWidth
									color='warning'
									size='lg'
									className='font-bold'
									onClick={handleSaveSettings}
								>
									{isLoading ? <Spinner /> : 'Сохранить'}
								</Button>
							</div>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default Settings;
