import { useState, useEffect } from 'react';
import axios from '../../axios';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { BsImage } from 'react-icons/bs';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import { Delete, Edit } from 'react-icons/md';
import CircularProgress from '../components/CircularProgress';
import Dialog from '../components/Dialog';

const ImageUploadForm = () => {
	const accessToken = process.env.REACT_APP_API_TOKEN;
	const [activeIndex, setActiveIndex] = useState(0);
	const [images, setImages] = useState([]);
	const [isLoading, setIsloading] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const [selectedImage, setSelectedImage] = useState('');
	const [openDialogDeleteOne, setOpenDialogDeleteOne] = useState(false);
	const [openDialogDeleteAll, setOpenDialogDeleteAll] = useState(false);

	const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;
	const API_URL = process.env.REACT_APP_API_URL;

	registerPlugin(FilePondPluginImagePreview);

	const handleClickUpload = () => {
		setActiveIndex(0);
	};

	const fetchImages = async () => {
		setIsloading(true);
		try {
			const { data } = await axios.get('/api/images/get-images/');
			setImages(data);
			setIsloading(false);
		} catch (error) {
			setIsloading(true);
			console.error(error);
		}
	};

	const handleClickDeleteImage = async (name) => {
		setIsloading(true);
		try {
			await axios.delete('/api/images/delete-image/', {
				data: {
					name: name,
				},
			});
			handleCloseDialogDeleteOne();
			setIsloading(false);
			setSelectedImage('');
			fetchImages();
		} catch (error) {
			setIsloading(true);
			console.error(error);
		}
	};

	const handleClickDeleteImages = async () => {
		setIsloading(true);
		try {
			await axios.delete('/api/images/delete-images/');
			handleCloseDialogDeleteAll();
			setIsloading(false);
			fetchImages();
		} catch (error) {
			setIsloading(true);
			console.error(error);
		}
	};

	const handleClickGetImages = () => {
		setActiveIndex(1);
		fetchImages();
	};

	const menuItems = [
		{
			name: 'Загрузить',
			icon: <AiOutlineCloudUpload style={{ fontSize: 30 }} />,
			onClick: handleClickUpload,
		},
		{
			name: 'Мои загрузки',
			icon: <BsImage />,
			onClick: handleClickGetImages,
		},
	];

	const handleInit = () => {
		console.log('FilePond is ready');
	};

	const handleClickImage = (event, name) => {
		setAnchorEl(event.currentTarget);
		setSelectedImage(name);
	};

	const handleOpenDialogDeleteOne = () => {
		setOpenDialogDeleteOne(true);
	};

	const handleCloseDialogDeleteAll = () => {
		setOpenDialogDeleteAll(false);
	};

	const handleOpenDialogDeleteAll = () => {
		setOpenDialogDeleteAll(true);
	};

	const handleCloseDialogDeleteOne = () => {
		setOpenDialogDeleteOne(false);
	};

	useEffect(() => {
		if (activeIndex === 1) {
			fetchImages();
		}
	}, [activeIndex]);

	return (
		<>
			<div className='container mx-auto'>
				<div
					className={`${
						activeIndex === 0 ? 'h-70' : 'h-120'
					} bg-white shadow-none border-b border-gray-200 flex justify-center mb-1`}
				>
					<div className='flex mb-1 mt-2'>
						{menuItems.map((obj, index) => (
							<button
								key={index}
								className={`${
									index === activeIndex ? 'bg-orange-400' : 'bg-gray-200'
								} m-1 w-[28%] sm:w-[100%] rounded-md focus:outline-none hover:bg-orange-400 transition-all duration-300`}
								onClick={obj.onClick}
							>
								<span className='text-lg font-semibold text-black'>
									{obj.icon}
									{obj.name}
								</span>
							</button>
						))}
					</div>
					{activeIndex === 1 && (
						<div className='flex justify-between items-center m-1'>
							<p className='text-black font-semibold text-1.2rem'>
								Всего: {images.length}
							</p>
							<button
								onClick={images.length === 0 ? null : handleOpenDialogDeleteAll}
								className={`${
									images.length === 0 ? 'cursor-not-allowed' : ''
								} text-red-500 text-1rem font-semibold hover:bg-red-50 focus:outline-none`}
							>
								<Delete className='mr-1' />
								Удалить все
							</button>
						</div>
					)}
				</div>
				<div className='mb-5 mt-12'>
					{activeIndex === 0 ? (
						<div>
							<FilePond
								server={{
									process: {
										url: `${API_URL}/api/upload-images`,
										headers: {
											'x-auth-token': accessToken,
										},
									},
								}}
								name='images'
								labelFileProcessing='Загрузка'
								labelFileProcessingComplete='Изображение успешно загружено!'
								labelTapToCancel='Нажмите чтобы отменить'
								labelFileProcessingError='Ошибка! Изображение не загружено!'
								labelTapToRetry='Нажмите чтобы попробовать заново'
								maxFiles={10}
								instantUpload={true}
								allowMultiple={true}
								allowImagePreview={false}
								labelIdle='Перетащите изображения или <span class="filepond--label-action">нажмите здесь</span>'
								oninit={handleInit}
								allowRevert={false}
								className='my-filezone'
							/>
						</div>
					) : (
						<>
							{isLoading ? (
								<div className='flex mx-auto mt-20 justify-center items-center'>
									<CircularProgress color='warning' />
								</div>
							) : (
								<div className='mt-18 overflow-x-hidden'>
									<div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2'>
										{images.map((obj) => (
											<div
												key={obj.name}
												className='mb-2'
											>
												<div
													className='mb-1 mx-1'
													onClick={(event) => handleClickImage(event, obj.name)}
												>
													<img
														src={`${API_URL_IMAGES}${obj.name}`}
														alt=''
														className='h-40 w-full object-cover bg-gray-100 rounded-md cursor-pointer'
													/>
												</div>
												<p className='text-1.1rem text-left mx-2 overflow-hidden whitespace-nowrap overflow-ellipsis'>
													{obj.name}
												</p>
											</div>
										))}
									</div>
								</div>
							)}
						</>
					)}
				</div>
				<Dialog
					title='Вы точно хотите удалить все изображения ?'
					onOpen={openDialogDeleteAll}
					onClose={handleCloseDialogDeleteAll}
					onClickButtonCancel={handleCloseDialogDeleteAll}
					onClickButtonDelete={handleClickDeleteImages}
				/>
				{selectedImage && (
					<Dialog
						title='Вы точно хотите удалить это изображение ?'
						onOpen={openDialogDeleteOne}
						onClose={handleCloseDialogDeleteOne}
						onClickButtonCancel={handleCloseDialogDeleteOne}
						onClickButtonDelete={() => handleClickDeleteImage(selectedImage)}
					/>
				)}
			</div>
		</>
	);
};

export default ImageUploadForm;
