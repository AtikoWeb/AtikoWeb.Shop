import React, {useCallback, useEffect, useRef, useState} from 'react';
import axios from '../../axios';
import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Input,
    Spinner,
    Switch,
    Tab,
    Tabs,
    Textarea
} from '@nextui-org/react';
import {FaCheck, FaRegStar} from 'react-icons/fa';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {TbCategory2} from "react-icons/tb";
import ModalWindow from "../components/Modal.jsx";
import {motion} from 'framer-motion';
import SettingsInterestingCard from "../components/SettingsInterestingCard.jsx";
import {FilePond, registerPlugin} from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import {IoCloseSharp} from "react-icons/io5";
import {v4} from 'uuid'
import {FaPencil} from "react-icons/fa6";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchImages} from "../../redux/slices/imageSlice.js";

const colors = [
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#eab308',
    '#84cc16',
    '#22c55e',
    '#10b981',
    '#14b8a6',
    '#06b6d4',
    '#0ea5e9',
    '#3b82f6',
    '#6366f1',
    '#8b5cf6',
    '#a855f7',
    '#d946ef',
    '#ec4899',
    '#f43f5e'
];

const columnCounts = [1, 2];

const Settings = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const images = useSelector(state => state.image.images.items);
    const token = queryParams.get('token');
    const db_code = queryParams.get('db_code');
    const accessToken = '48199878-7c84-4dae-9480-7e98b5d0f763'
    const [selectedColor, setSelectedColor] = useState('#0f172a');
    const navigate = useNavigate();
    const [selectedColumnCount, setSelectedColumnCount] = useState(2);
    const [shopName, setShopName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState();
    const [selectedMenuItem, setSelectedMenuItem] = useState('Основные');
    const [addIsInteresting, setAddIsInteresting] = useState(false);
    const [isCreateInterestingOpen, setIsCreateInterestingOpen] = useState(false);
    const [isClickedInterestingOpen, setIsClickedInterestingOpen] = useState(false);
    const [interesting, setInteresting] = useState([]);
    const [isModalImageUpload, setIsModalImageUpload] = useState(false);
    const [newInteresting, setNewInteresting] = useState({name: '', id: ''.toUpperCase()});
    const [newInterestingName, setNewInterestingName] = useState('')
    const [isOpenDeleteInteresting, setIsOpenDeleteInteresting] = useState(false);
    const [clickedInterestingCard, setClickedInterestingCard] = useState({});
    const pondLogoRef = useRef(null);
    const pondFaviconRef = useRef(null);
    const [yandexMapURL, setYandexMapURL] = useState();
    const [isRename, setIsRename] = useState({});
    const [newNames, setNewNames] = useState({});
    const dispatch = useDispatch();
    const [logoIsLoading, setLogoIsLoading] = useState(false);
    const [faviconIsLoading, setFaviconIsLoading] = useState(false);
    const currentDomain = window.location.hostname === 'localhost' ? process.env.REACT_APP_DOMAIN : window.location.hostname;
    const [desc, setDesc] = useState('');
    const [refund_policy, setRefundPolicy] = useState('');
    const MASTER_DB_URL = process.env.REACT_APP_MASTER_DB_URL;
    const lowerCase_db_code = db_code.toString().toLowerCase();
    const API_URL_IMAGES = `https://${currentDomain}/api/images/${lowerCase_db_code}/images/`
    const [menuItems, setMenuItems] = useState([
        {
            title: 'Основные',
            icon: <TbCategory2/>
        },
    ]);

    const handlePhoneChange = (e) => {
        let formattedPhone = e.target.value.replace(/\D/g, '');
        if (formattedPhone.length > 10) {
            formattedPhone = formattedPhone.slice(0, 10); // Ограничиваем номер телефона 10 цифрами
        }
        if (formattedPhone.length >= 7) {
            // Форматируем номер как (XXX) XXX-XXXX
            formattedPhone = `(${formattedPhone.slice(0, 3)}) ${formattedPhone.slice(
                3,
                6
            )}-${formattedPhone.slice(6)}`;
        } else if (formattedPhone.length >= 4) {
            // Форматируем номер как (XXX) XXX
            formattedPhone = `(${formattedPhone.slice(0, 3)}) ${formattedPhone.slice(
                3
            )}`;
        }
        setPhone(formattedPhone);
    };

    useEffect(() => {

        if (!token || token !== accessToken) {
            navigate('/');
        }

    }, []);

    registerPlugin(FilePondPluginImagePreview);

    const showToast = (message, status) => {
        toast(message, {
            position: 'top-right',
            autoClose: 3000,
            type: status,
            className: 'rounded-xl bg-base-100',
        });
    };


    const getData = async () => {
        try {
            const settingsResponse = await axios.get(`/settings?db_code=${db_code}`);
            const yandexURLResponse = await axios.get(`https://${MASTER_DB_URL}/api/client/get-yandexURL`, {
                params: {
                    db_code: lowerCase_db_code
                }
            });

            const configData = settingsResponse.data.config || {}; // Проверяем наличие объекта config
            setSelectedColumnCount(configData.column_count || 2); // Если configData не определен, используем значение по умолчанию
            setSelectedColor(configData.main_color || '#0f172a');
            setAddIsInteresting(configData.isInteresting || false);
            setShopName(configData.shop_name || 'AtikoWeb.Shop');
            setPhone(configData.phone || '7086001010');
            setDesc(configData.desc || '');
            setRefundPolicy(configData.refund_policy || '');
            setYandexMapURL(yandexURLResponse.data.url);
        } catch (error) {
            setIsLoading(false);
            console.error('Error fetching settings:', error);
            showToast('error', 'Ошибка! Данные не получены!', 'danger');
        }
    };

    const getInteresting = useCallback(async () => {
        await axios
            .get(`/interesting/get-all`, {
                params: {
                    db_code,
                }
            })
            .then((response) => {
                setInteresting(response.data);
            })
            .catch((error) => {
                console.error('Error fetching settings:', error);
            });
    }, [db_code]);

    useEffect(() => {
        getData();
        getInteresting();
        dispatch(fetchImages({settingsDBcode: db_code}));
    }, [isLoading]);


    const handleColorChange = (color) => {
        setSelectedColor(color);
    };

    const handleColumnCountChange = (count) => {
        setSelectedColumnCount(count);
    };

    const handleInitOne = () => {
        console.log('FilePond is ready');
    };

    const handleInitTwo = () => {
        console.log('FilePond is ready');
    };

    const handleInitThree = () => {
        console.log('FilePond is ready');
    };

    const handleInitFour = () => {
        console.log('FilePond is ready');
    };

    const handleSaveSettings = () => {
        const settingsData = {
            mainColor: selectedColor,
            columnCount: selectedColumnCount,
            isInteresting: addIsInteresting,
            shopName: shopName,
            desc,
            refund_policy,
            phone: `${phone.replace(/\D/g, '')}`,
        };

        const updateYandexMapURL = axios.put(`https://dashboard.atikoweb.kz/api/client/update-yandexURL?db_code=${lowerCase_db_code}`, {
            yandexMapURL
        });

        const saveSettings = axios.post(`/settings/`, settingsData, {
            params: {
                db_code
            }
        });

        Promise.all([updateYandexMapURL, saveSettings])
            .then(() => {
                setIsLoading(false);
                getData();
                showToast('Настройки успешно сохранены!', 'success');
            })
            .catch((error) => {
                console.error('Error saving settings:', error);
                showToast('Настройки не сохранены!', 'error');
            });
    };


    const handleChangeIsModalImageUpload = () => {
        if (!newInterestingName || newInterestingName.length < 3) {
            showToast('Неверный формат имени!', 'warning');
        } else {
            setNewInteresting({name: newInterestingName, id: v4()});
            setIsModalImageUpload(true);

        }
    }

    const handleDeleteInteresting = async () => {
        setIsLoading(true);
        try {
            await axios.delete('/interesting/delete-all', {
                headers: {
                    'x-auth-token': accessToken,
                },
                params: {
                    db_code
                }
            });
            setIsLoading(false);
            setIsOpenDeleteInteresting(false);
        } catch (error) {
            setIsLoading(true);
            console.error(error);
        }
    }

    const handleOpenDeleteInteresting = () => {
        setIsOpenDeleteInteresting(true);
    }

    const clickInterestingCard = (obj) => {
        setClickedInterestingCard(obj);
        setIsClickedInterestingOpen(true);
    }

    let interestingImages;
    let mainImage;
    let otherImages;
    let logoImage;
    let faviconImage;

    if (Array.isArray(images)) {
        interestingImages = images.filter((image) => image.name.includes(`${clickedInterestingCard.id}`));
        mainImage = interestingImages.find((obj) => obj.isMainImage === true);
        otherImages = interestingImages.filter((obj) => obj.isMainImage !== true);
        logoImage = images.find((image) => image.name === 'LOGO.PNG');
        faviconImage = images.find((image) => image.name === 'FAVICON.ICO');
    } else {
        // images не является массивом
        console.error('images не является массивом');
    }


    const handleCreateInterestingClose = () => {
        setIsCreateInterestingOpen(false);
        setIsModalImageUpload(false);
        setNewInterestingName('');
        setNewInteresting({});
    }

    const handleDeleteInterestingOne = async (name) => {
        setIsLoading(true);
        try {
            await axios.delete('/images/delete-image/', {
                data: {
                    name: name,
                },
                params: {
                    db_code
                }
            });
            setIsLoading(false);
            dispatch(fetchImages({settingsDBcode: db_code}));
        } catch (error) {
            setIsLoading(true);
            console.error(error);
        }
    };


    const handleClickDelete = async (id) => {
        setIsLoading(true);
        try {
            await axios.delete('/interesting/delete-one/', {
                headers: {
                    'x-auth-token': accessToken,
                },
                params: {
                    id: id,
                    db_code

                }
            });
            getInteresting();
            dispatch(fetchImages({settingsDBcode: db_code}));
            setIsLoading(false);
            setIsClickedInterestingOpen(false);
        } catch (error) {
            setIsLoading(true);
            console.error(error);
        }
    }

    const handleInputChange = (id, value) => {
        setNewNames(prevState => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleIsRename = (id, value) => {
        setIsRename(prevState => ({
            ...prevState,
            [id]: value,
        }));
    };

    const handleRenameInterestingCard = async (id, name) => {
        console.log(clickedInterestingCard.id, newNames[clickedInterestingCard?.id])
        try {
            await axios.put('/interesting/rename/', null, {
                headers: {
                    'x-auth-token': accessToken,
                },
                params: {
                    id,
                    name,
                    db_code
                },
            });
            showToast('Карточка успешно переименована!', 'success');
            handleIsRename(id, false)
            getInteresting();
            dispatch(fetchImages({settingsDBcode: db_code}));
            setIsLoading(false);
        } catch (error) {
            setIsLoading(true);
            console.error(error);
            showToast('Карточка не переименована!', 'error');
        }
    }

    const changeIcon = () => {
        return (<FaPencil/>)
    }

    const handleUploadLogoComplete = () => {
        if (pondLogoRef.current) {
            // Reset FilePond to initial state
            pondLogoRef.current.removeFiles();
        }

        // Fetch images or perform other actions after successful upload
        dispatch(fetchImages({settingsDBcode: db_code}));
        setLogoIsLoading(false);
    };

    const handleUploadFaviconComplete = () => {
        if (pondFaviconRef.current) {
            // Reset FilePond to initial state
            pondFaviconRef.current.removeFiles();
        }

        // Fetch images or perform other actions after successful upload
        dispatch(fetchImages({settingsDBcode: db_code}));
        setFaviconIsLoading(false);
    };

    console.log(selectedColor)

    const getMaskPhone = (phone) => {
        let formattedPhone = phone.replace(/\D/g, '');
        if (formattedPhone.length > 10) {
            formattedPhone = formattedPhone.slice(0, 10); // Ограничиваем номер телефона 10 цифрами
        }
        if (formattedPhone.length >= 7) {
            // Форматируем номер как (XXX) XXX-XXXX
            formattedPhone = `(${formattedPhone.slice(0, 3)}) ${formattedPhone.slice(
                3,
                6
            )}-${formattedPhone.slice(6)}`;
        } else if (formattedPhone.length >= 4) {
            // Форматируем номер как (XXX) XXX
            formattedPhone = `(${formattedPhone.slice(0, 3)}) ${formattedPhone.slice(
                3
            )}`;
        }

        return formattedPhone;
    };


    return (
        <>


            <div className="flex bg-white h-screen overflow-x-hidden">
                <div className="w-1/4 sticky top-0 bg-white shadow-lg p-4">
                    <span className={'text-3xl px-2 font-bold'}>
                                        Настройки
                                    </span>

                    <div className={'px-5 grid pt-5 gap-3'}>
                        {menuItems.map((obj) => (
                            <>
                                <Button

                                    onClick={() => setSelectedMenuItem(obj.title)}
                                    className={`${obj.title === selectedMenuItem ? 'bg-neutral-200 hover:bg-neutral-200' : 'bg-white hover:bg-neutral-100'} cursor-pointer h-14 px-3 flex gap-2 rounded-xl justify-start items-center`}>
                                                <span className={'text-xl'}>
                                                     {obj.icon}
                                                </span>

                                    <span className={'text-lg font-semibold'}>
                                                     {obj.title}
                                                </span>
                                </Button>
                            </>
                        ))}
                        {addIsInteresting && (
                            <Button

                                onClick={() => setSelectedMenuItem('Блок "Это интересно"')}
                                className={`${selectedMenuItem === 'Блок "Это интересно"' ? 'bg-neutral-200 hover:bg-neutral-200' : 'bg-white hover:bg-neutral-100'} cursor-pointer h-14 px-3 flex gap-2 rounded-xl justify-start items-center`}>
                                                <span className={'text-xl'}>
                                                    <FaRegStar/>
                                                </span>

                                <span className={'text-lg font-semibold'}>
                                                    Блок "Это интересно"
                                                </span>
                            </Button>
                        )}

                    </div>
                </div>

                {/* Контент справа */}
                <div className="w-3/4">

                    {
                        selectedMenuItem === 'Основные' && (
                            <>
                                <motion.div
                                    key='Search'
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    exit={{opacity: 0}}
                                    transition={{duration: 1, delay: 0.2}}
                                >
                                    <div>
                                        {isLoading ? (
                                            <Spinner color='warning'/>
                                        ) : (
                                            <div className={'relative'}>

                                                <div
                                                    className={'bg-white h-20 z-[1] fixed top-0 mx-3 w-full'}>
                                                    <Button
                                                        onPress={handleSaveSettings}
                                                        size='lg'
                                                        color={"warning"}
                                                        isLoading={isLoading}
                                                        className={`font-semibold fixed top-0 mt-5 z-30 right-10 text-lg`}
                                                    >
                                                        Сохранить
                                                    </Button>
                                                </div>


                                                <Tabs
                                                    className={'sticky mx-10 top-5 pb-10 z-10'}
                                                    size={"lg"}>


                                                    <Tab title={'Информация'}>
                                                        <div className={'mb-10 mx-10'}>

                                                            <div className={'mb-10 grid gap-3  mt-5'}>
                                                                <span
                                                                    className={'text-xl font-bold'}>Название магазина</span>
                                                                <Input classNames={{
                                                                    input: [
                                                                        "text-3xl w-72",
                                                                    ],
                                                                }}
                                                                       type="text"
                                                                       spellCheck={false}
                                                                       value={shopName}
                                                                       onChange={(e) => setShopName(e.target.value)}
                                                                       variant={'underlined'}
                                                                />
                                                            </div>

                                                            <div className={'mb-10 grid gap-3 '}>
                                                                <span
                                                                    className={'text-xl font-bold'}>Контактный телефон</span>
                                                                <Input classNames={{
                                                                    input: [
                                                                        "text-3xl w-72",
                                                                    ],
                                                                }}
                                                                       type="text"
                                                                       spellCheck={false}
                                                                       value={getMaskPhone(phone)}
                                                                       onChange={handlePhoneChange}
                                                                       variant={'underlined'}
                                                                       startContent={<span
                                                                           className={'text-3xl'}>+7</span>}
                                                                />
                                                            </div>

                                                            <div className={'mb-10 grid gap-3 w-full mt-5'}>
                                                        <span
                                                            className={'text-xl font-bold'}>Описание магазина</span>
                                                                <Textarea classNames={{
                                                                    input: [
                                                                        "text-lg",
                                                                    ],
                                                                }}
                                                                          type={'text'}
                                                                          spellCheck={false}
                                                                          value={desc}
                                                                          onChange={(e) => setDesc(e.target.value)}
                                                                />
                                                            </div>

                                                            <div className={'mb-10 grid gap-3 w-full mt-5'}>
                                                                <span
                                                                    className={'text-xl font-bold'}>Политика возврата</span>
                                                                <Textarea
                                                                    classNames={{
                                                                        input: [
                                                                            "text-lg",
                                                                        ],
                                                                    }}
                                                                    type="text"
                                                                    spellCheck={false}
                                                                    value={refund_policy}
                                                                    onChange={(e) => setRefundPolicy(e.target.value)}
                                                                />
                                                            </div>


                                                            <div className={'mb-10 grid gap-3 w-full mt-5'}>
                                                        <span
                                                            className={'text-xl font-bold'}>Ссылка на Яндекс Карты</span>
                                                                <Textarea classNames={{
                                                                    input: [
                                                                        "text-lg",
                                                                    ],
                                                                }}
                                                                          type="text"
                                                                          spellCheck={false}
                                                                          value={yandexMapURL}
                                                                          onChange={(e) => setYandexMapURL(e.target.value)}
                                                                />
                                                            </div>


                                                            <div className={'flex gap-20'}>
                                                                <div>
                                                                    <span className={'text-xl font-bold'}>Логотип</span>
                                                                    <div className={'flex gap-5'}>

                                                                        <Image
                                                                            shadow='none'
                                                                            disableSkeleton={false}
                                                                            isLoading={logoIsLoading}
                                                                            radius='lg'
                                                                            className={`relative shadow-xl w-96 h-40 p-10 mt-3 cursor-pointer z-0 object-contain`}
                                                                            src={`${API_URL_IMAGES}${logoImage?.name}?timestamp=${new Date().getTime()}`}
                                                                        />

                                                                        <div
                                                                            className={'-ml-10 -mt-3'}>
                                                                            <FilePond
                                                                                ref={pondLogoRef}
                                                                                server={{
                                                                                    process: {
                                                                                        url: `https://${currentDomain}/api/client/upload-images/set-logo?db_code=${db_code}`,
                                                                                        headers: {
                                                                                            'x-auth-token': accessToken,
                                                                                        },
                                                                                    },
                                                                                }}
                                                                                name='image'
                                                                                labelFileProcessing='Загрузка'
                                                                                labelFileProcessingComplete='Загружено!'
                                                                                labelTapToCancel='Нажмите чтобы отменить'
                                                                                labelFileProcessingError='Ошибка! Изображение не загружено!'
                                                                                labelTapToRetry='Нажмите чтобы попробовать заново'
                                                                                instantUpload={true}
                                                                                maxFiles={1}
                                                                                allowMultiple={true}
                                                                                allowImagePreview={false}
                                                                                labelIdle={'<span class="cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"/></svg></span>'}
                                                                                oninit={handleInitThree}
                                                                                allowRevert={false}
                                                                                className='my-filezone relative cursor-pointer'
                                                                                credits={false}
                                                                                onprocessfiles={handleUploadLogoComplete}
                                                                                onaddfile={() => setLogoIsLoading(true)}

                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <span className={'text-xl font-bold'}>Favicon</span>
                                                                    <div className={'flex gap-5'}>

                                                                        <Image
                                                                            shadow='none'
                                                                            radius='lg'
                                                                            isLoading={faviconIsLoading}
                                                                            disableSkeleton={false}
                                                                            className={`relative shadow-xl w-40 h-40 p-5 mt-3 cursor-pointer z-0 object-contain`}
                                                                            src={`${API_URL_IMAGES}${faviconImage?.name}?timestamp=${new Date().getTime()}`}
                                                                        />

                                                                        <div
                                                                            className={'-ml-10 -mt-5'}>
                                                                            <FilePond
                                                                                ref={pondFaviconRef}
                                                                                server={{
                                                                                    process: {
                                                                                        url: `https://${currentDomain}/api/client/upload-images/set-favicon?db_code=${db_code}`,
                                                                                        headers: {
                                                                                            'x-auth-token': accessToken,
                                                                                        },
                                                                                    },
                                                                                }}
                                                                                name='image'
                                                                                labelFileProcessing='Загрузка'
                                                                                labelFileProcessingComplete='Загружено!'
                                                                                labelTapToCancel='Нажмите чтобы отменить'
                                                                                labelFileProcessingError='Ошибка! Изображение не загружено!'
                                                                                labelTapToRetry='Нажмите чтобы попробовать заново'
                                                                                instantUpload={true}
                                                                                maxFiles={1}
                                                                                allowMultiple={true}
                                                                                allowImagePreview={false}
                                                                                labelIdle={'<span class="cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"/></svg></span>'}
                                                                                oninit={handleInitFour}
                                                                                allowRevert={false}
                                                                                className='my-filezone relative cursor-pointer'
                                                                                credits={false}
                                                                                onprocessfiles={handleUploadFaviconComplete}
                                                                                onaddfile={() => setFaviconIsLoading(true)}


                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Tab>

                                                    <Tab title={'Кастомизация'}>

                                                        <div className={'mt-5 mx-10'}>
                                                    <span className='text-xl font-bold mb-5'>
								Выберите главный цвет
							</span>

                                                            <div
                                                                className='grid mt-5 grid-cols-8 gap-5 mb-10'>
                                                                {colors.map((color) => (
                                                                    <Button
                                                                        variant='solid'
                                                                        style={{
                                                                            backgroundColor: color
                                                                        }}
                                                                        onClick={() => handleColorChange(color)}
                                                                    >
                                                                        {color === selectedColor && (
                                                                            <FaCheck className={'text-content1'}/>
                                                                        )}
                                                                    </Button>
                                                                ))}
                                                            </div>

                                                            <span className='text-xl mt-10 font-bold mb-5'>
								Выберите кол-во колонок для моб. версии
							</span>
                                                            <div className='mb-10 mt-5 flex gap-5'>
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

                                                            <span className='text-xl mt-10 font-bold mb-5'>
								Отображение блока "Это интересно"
							</span>
                                                            <div className={'mb-10 mt-5'}>
                                                                <Switch onValueChange={setAddIsInteresting}
                                                                        isSelected={addIsInteresting}
                                                                        size={"lg"}
                                                                        color={'warning'}>
                                                                    Блок "Это интересно"
                                                                </Switch>

                                                            </div>
                                                        </div>
                                                    </Tab>
                                                </Tabs>

                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                            </>
                        )
                    }

                    {/*{selectedMenuItem === 'Загрузка картинок' && (*/}
                    {/*    <>*/}
                    {/*        <ImageUploadForm/>*/}
                    {/*    </>*/}
                    {/*)*/}
                    {/*}*/}

                    {selectedMenuItem === 'Блок "Это интересно"' && (
                        <>
                            <div className={'grid mx-5 mt-5'}>
                                <div className={'flex justify-between'}>
                                    <Button className={'text-lg mx-3 font-bold'} size={"lg"} color={"warning"}
                                            onPress={() => setIsCreateInterestingOpen(true)}>
                                        Добавить
                                    </Button>

                                    <Button className={'text-lg bg-red-500 text-white font-bold'} size={"lg"}
                                            onPress={handleOpenDeleteInteresting}>
                                        Удалить все
                                    </Button>


                                </div>
                                <div
                                    className={`grid grid-cols-3 container px-10 mx-auto pt-10 gap-5 pb-6'`}>
                                    {interesting.map((obj, index) => (
                                        <>
                                            <SettingsInterestingCard
                                                name={obj.name}
                                                id={obj.id}
                                                settingsDB_code={db_code}
                                                images={images}
                                                index={index}
                                                onClick={() => clickInterestingCard(obj)}
                                            />
                                        </>
                                    ))}
                                </div>

                                <ModalWindow
                                    isOpen={isCreateInterestingOpen}
                                    size='5xl'
                                    children={
                                        <div className='mb-24 grid place-content-center w-full'>
                                            <div className='mx-auto'>
                                                <div className='mx-5 mt-6 grid'>
                                                        <span
                                                            className='text-3xl font-black'>{''}</span>

                                                </div>
                                                <div

                                                    className='absolute cursor-pointer right-1.5 top-2 bg-white/[.8] backdrop-blur-md p-2 shadow-large rounded-full'
                                                    onClick={handleCreateInterestingClose}
                                                >
                                                    <IoCloseSharp className='text-2xl md:text-3xl'/>
                                                </div>
                                            </div>


                                            {isModalImageUpload ? (
                                                <div className={''}>
                                                    <div className={'mx-auto text-center'}>
                                                        <span
                                                            className={'text-3xl font-bold'}>{newInteresting.name}</span>
                                                    </div>


                                                    <>
                                                        <div className={'w-[500px]'}>
                                                            <div className={'mb-3'}>

                                                                    <span className={'text-xl'}>
                                                                Загрузите главную картинку
                                                            </span>
                                                            </div>
                                                            <FilePond
                                                                server={{
                                                                    process: {
                                                                        url: `https://${currentDomain}/api/client/interesting/create?db_code=${db_code}`,
                                                                        ondata: (formData) => {
                                                                            // Добавляем дополнительные данные к formData
                                                                            formData.append('name', newInteresting.name);
                                                                            formData.append('id', newInteresting.id);
                                                                            return formData;
                                                                        },
                                                                    },
                                                                }}
                                                                name='image'
                                                                labelFileProcessing='Загрузка'
                                                                labelFileProcessingComplete='Изображение успешно загружено!'
                                                                labelTapToCancel='Нажмите чтобы отменить'
                                                                labelFileProcessingError='Ошибка! Изображение не загружено!'
                                                                labelTapToRetry='Нажмите чтобы попробовать заново'
                                                                maxFiles={1}
                                                                instantUpload={true}
                                                                allowMultiple={true}
                                                                allowImagePreview={false}
                                                                labelIdle={'' +
                                                                    '<div class="bg-green-500 cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-white">' +
                                                                    '<span style="font-size: 35px; margin-top: -2px; margin-left: 1px">+</span>' +
                                                                    '</div> ' +
                                                                    ''}
                                                                oninit={handleInitOne}
                                                                allowRevert={false}
                                                                className='my-filezone relative'
                                                                credits={false}
                                                                onprocessfiles={() => {
                                                                    getInteresting();
                                                                    dispatch(fetchImages({settingsDBcode: db_code}));
                                                                    handleCreateInterestingClose();
                                                                }}


                                                            />
                                                        </div>
                                                    </>


                                                </div>
                                            ) : (
                                                <>
                                                    <div className={'mx-auto text-center'}>
                                                        <div className={'mb-5'}>
                                                              <span
                                                                  className={'text-3xl font-bold'}>Создание</span>
                                                        </div>
                                                        <Input
                                                            isRequired
                                                            fullWidth
                                                            type='text'
                                                            value={newInterestingName}
                                                            onChange={(e) => setNewInterestingName(e.target.value)}
                                                            label='Имя'
                                                            defaultValue=''
                                                            size='lg'
                                                            className='mb-5 w-96'

                                                        />

                                                        <Button
                                                            fullWidth
                                                            onPress={handleChangeIsModalImageUpload}
                                                            size='lg'
                                                            color='warning'
                                                            className='font-bold text-lg'
                                                        >
                                                            Далее
                                                        </Button>
                                                    </div>
                                                </>)}


                                        </div>
                                    }
                                />

                                <ModalWindow size={'5xl'} isOpen={isClickedInterestingOpen} children={<>
                                    <div className='mb-24 grid place-content-center w-full '>
                                        <div className='mx-auto flex'>

                                            <div className={'mb-5 mt-5'}>
                                                {isRename[clickedInterestingCard?.id] ? (
                                                    <motion.div
                                                        key='renameInput'
                                                        initial={{opacity: 0}}
                                                        animate={{opacity: 1}}
                                                        exit={{opacity: 0}}
                                                        transition={{duration: 0.2, delay: 0.1}}
                                                    >
                                                        <Input classNames={{
                                                            input: [
                                                                "text-3xl font-bold w-72",

                                                            ],
                                                        }}
                                                               placeholder={newNames[clickedInterestingCard?.id]}
                                                               type="text"
                                                               value={newNames[clickedInterestingCard?.id]}
                                                               onChange={(e) => handleInputChange(clickedInterestingCard?.id, e.target.value)}
                                                               variant={'underlined'}
                                                               endContent={
                                                                   <div
                                                                       className={'flex gap-3'}>
                                                                       <Button
                                                                           isDisabled={(newNames[clickedInterestingCard?.id] ?? '').length < 1}
                                                                           color={"success"}
                                                                           size={"sm"}
                                                                           className={'font-bold text-lg text-white'}
                                                                           onPress={() => handleRenameInterestingCard(clickedInterestingCard.id, newNames[clickedInterestingCard?.id])}>
                                                                           <FaCheck/>
                                                                       </Button>
                                                                       <Button
                                                                           color={"default"}
                                                                           size={"sm"}
                                                                           className={'font-bold text-xl'}
                                                                           onPress={() => handleIsRename(clickedInterestingCard?.id, false)}>
                                                                           <IoCloseSharp/>
                                                                       </Button>
                                                                   </div>
                                                               }
                                                        />
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key='name'
                                                        initial={{opacity: 0}}
                                                        animate={{opacity: 1}}
                                                        exit={{opacity: 0}}
                                                        transition={{duration: 0.2, delay: 0.1}}
                                                    >
                                                        <div className={'flex gap-3'}>
                                                        <span
                                                            className={'text-3xl font-bold'}>
                                                        {newNames[clickedInterestingCard?.id] ? newNames[clickedInterestingCard?.id] : clickedInterestingCard?.name}
                                                    </span>
                                                            <Button
                                                                size={"sm"}
                                                                className={'text-lg'}
                                                                onPress={() => handleIsRename(clickedInterestingCard?.id, true)}><FaPencil
                                                            /></Button>
                                                        </div>
                                                    </motion.div>

                                                )}

                                            </div>


                                            <div
                                                className='absolute cursor-pointer right-1.5 top-2 bg-white/[.8] backdrop-blur-md p-2 shadow-large rounded-full'
                                                onClick={() => setIsClickedInterestingOpen(false)}
                                            >
                                                <IoCloseSharp className='text-2xl md:text-3xl'/>
                                            </div>

                                            <div
                                                className='absolute cursor-pointer left-1.5 top-2'>
                                                <Button variant={'light'}
                                                        className={'text-lg hover:!bg-red-100 text-red-500 h-16 font-bold'}
                                                        size={"sm"}
                                                        onPress={() => handleClickDelete(clickedInterestingCard.id)}

                                                >
                                                    Удалить
                                                </Button>
                                            </div>
                                        </div>


                                        <Tabs size={"lg"}
                                              className={'flex mt-5 mb-5 justify-center right-0 left-0 z-[1]'}>
                                            <Tab title={'Главная картинка'}>
                                                <div>
                                                    <Dropdown placement="bottom" key={mainImage?.name}>
                                                        <DropdownTrigger>
                                                            {mainImage ?
                                                                <Image
                                                                    shadow='sm'
                                                                    radius='lg'
                                                                    isLoading={interestingImages.length <= 0}
                                                                    className={`w-[450px] relative cursor-pointer z-0 object-bottom object-cover h-80`}
                                                                    src={`${API_URL_IMAGES}${mainImage?.name}`}
                                                                /> : ''
                                                            }
                                                        </DropdownTrigger>
                                                        <DropdownMenu aria-label="Static Actions">

                                                            <DropdownItem
                                                                onPress={() => handleDeleteInterestingOne(mainImage.name)}
                                                                key="delete"
                                                                className="text-danger"
                                                                color="danger"
                                                            >
                                                                Удалить
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>

                                                </div>

                                                <div className={'mt-10'}>
                                                    {mainImage ? (<div
                                                        className={'bg-red-400 w-full h-20 flex justify-center items-center rounded-lg'}>
                                                        <span className={'text-lg text-white w-80 font-semibold'}>
                                                           Чтобы установить новое <br/> сначала удалите это изображение!
                                                        </span>
                                                        <Button
                                                            onPress={() => handleDeleteInterestingOne(mainImage.name)}
                                                            className={'bg-white'} variant={'flat'}>Удалить</Button>
                                                    </div>) : (<FilePond
                                                        server={{
                                                            process: {
                                                                url: `https://${currentDomain}/api/client/interesting/set-main?id=${clickedInterestingCard.id}&db_code=${db_code}`,
                                                            },
                                                        }}
                                                        name='images'
                                                        labelFileProcessing='Загрузка'
                                                        labelFileProcessingComplete='Изображение успешно загружено!'
                                                        labelTapToCancel='Нажмите чтобы отменить'
                                                        labelFileProcessingError='Ошибка! Изображение не загружено!'
                                                        labelTapToRetry='Нажмите чтобы попробовать заново'
                                                        maxFiles={1}
                                                        instantUpload={true}
                                                        allowMultiple={true}
                                                        allowImagePreview={false}
                                                        labelIdle={'' +
                                                            '<div class="bg-green-500 cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-white">' +
                                                            '<span style="font-size: 35px; margin-top: -2px; margin-left: 1px">+</span>' +
                                                            '</div> ' +
                                                            ''}
                                                        oninit={handleInitTwo}
                                                        allowRevert={false}
                                                        className='my-filezone relative'
                                                        credits={false}
                                                        onprocessfiles={() => {
                                                            // All files are processed, call your fetchImages function here
                                                            dispatch(fetchImages({settingsDBcode: db_code}));
                                                        }}


                                                    />)}

                                                </div>
                                            </Tab>

                                            <Tab title={'Остальные картинки'}>
                                                <div
                                                    className='w-full gap-5 flex snap-x overflow-x-scroll rounded-2xl'>
                                                    {isLoading ? (
                                                        <Spinner/>
                                                    ) : (
                                                        otherImages.map((obj) => (
                                                            <>
                                                                <Dropdown className={'snap-normal snap-start shrink-0'}
                                                                          placement="bottom" key={obj.name}>
                                                                    <DropdownTrigger>
                                                                        <Image
                                                                            shadow='sm'
                                                                            radius='lg'
                                                                            width='100vw'
                                                                            isLoading={interestingImages.length <= 0}
                                                                            className={`w-[400px] relative cursor-pointer z-0 object-top object-cover h-[550px]`}
                                                                            src={`${API_URL_IMAGES}${obj.name}`}

                                                                        />

                                                                    </DropdownTrigger>
                                                                    <DropdownMenu aria-label="Static Actions">
                                                                        <DropdownItem
                                                                            onPress={() => handleDeleteInterestingOne(obj.name)}
                                                                            key="delete"
                                                                            className="text-danger"
                                                                            color="danger"
                                                                        >
                                                                            Удалить
                                                                        </DropdownItem>
                                                                    </DropdownMenu>
                                                                </Dropdown>
                                                            </>

                                                        ))
                                                    )}

                                                </div>

                                                <div className={'mt-10'}>
                                                    <FilePond
                                                        server={{
                                                            process: {
                                                                url: `https://${currentDomain}/api/client/upload-images/interesting?id=${clickedInterestingCard.id}&db_code=${db_code}`,
                                                            },
                                                        }}
                                                        name='images'
                                                        labelFileProcessing='Загрузка'
                                                        labelFileProcessingComplete='Изображение успешно загружено!'
                                                        labelTapToCancel='Нажмите чтобы отменить'
                                                        labelFileProcessingError='Ошибка! Изображение не загружено!'
                                                        labelTapToRetry='Нажмите чтобы попробовать заново'
                                                        maxFiles={4}
                                                        instantUpload={true}
                                                        allowMultiple={true}
                                                        allowImagePreview={false}
                                                        labelIdle={'' +
                                                            '<div class="bg-green-500 cursor-pointer w-10 h-10 flex items-center justify-center rounded-full text-white">' +
                                                            '<span style="font-size: 35px; margin-top: -2px; margin-left: 1px">+</span>' +
                                                            '</div> ' +
                                                            ''}
                                                        oninit={handleInitTwo}
                                                        allowRevert={false}
                                                        className='my-filezone relative'
                                                        credits={false}
                                                        onprocessfiles={() => {
                                                            // All files are processed, call your fetchImages function here
                                                            dispatch(fetchImages({settingsDBcode: db_code}));
                                                        }}


                                                    />
                                                </div>
                                            </Tab>
                                        </Tabs>


                                    </div>
                                </>}/>
                            </div>
                        </>
                    )
                    }
                </div>
            </div>


            <ModalWindow
                isOpen={isOpenDeleteInteresting}
                scrollBehavior={'normal'}
                onClose={() => setIsOpenDeleteInteresting(false)}
                size='2xl'
            >
                <div className='mx-3 mt-3 mb-5'>
                    <div className='grid mb-5'>
                        <span className='text-2xl font-bold'>Удалить все ?</span>
                    </div>

                    <div className='grid gap-3'>
                        <div className='w-full bg-white/[.8] flex'>
                            <Button
                                size='lg'
                                onClick={handleDeleteInteresting}
                                className='font-bold w-96 text-white bg-red-500 flex-1 normal-case text-lg'
                            >
                                Удалить
                            </Button>
                        </div>
                        <div className='w-full bg-white/[.8] flex'>
                            <Button
                                size='lg'
                                color={"primary"}
                                fullWidth={true}
                                variant={"flat"}
                                onClick={() => setIsOpenDeleteInteresting(false)}
                                className='font-bold flex-1 normal-case text-lg'
                            >
                                Отмена
                            </Button>
                        </div>
                    </div>
                </div>
            </ModalWindow>

        </>
    );
};


export default Settings;
