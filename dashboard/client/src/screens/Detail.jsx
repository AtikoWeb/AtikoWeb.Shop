import React, {useEffect, useState} from 'react'
import {Button, Card, CardBody, Input, Spinner} from "@nextui-org/react";
import ClientCard from "../components/ClientCard.jsx";
import axios from "axios";
import ModalWindow from "../components/Modal.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {IoIosArrowBack} from 'react-icons/io';
import {motion} from "framer-motion";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Detail() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [newDomain, setNewDomain] = useState('');
    const [newAtikowebURL, setNewAtikowebURL] = useState('');
    const [newDbCode, setNewDbCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [server, setServer] = useState({id: '', name: ''});
    const [clientsQty, setClientsQty] = useState();
    const [activeClientsQty, setActiveClientsQty] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const MASTER_DB_URL = process.env.REACT_APP_MASTER_DB_URL;
    const [isDelete, setIsDelete] = useState(false);
    const [markedDeleteClient, setMarkedDeleteClient] = useState({});

    const newClient = {
        db_code: newDbCode,
        domain: newDomain,
        serverId: id,
        atikowebURL: newAtikowebURL,
    }

    const showToast = (message, status) => {
        toast(message, {
            position: 'top-right',
            autoClose: 3000,
            type: status,
            className: 'rounded-xl bg-base-100',
        });
    };

    const isValidDomain = () => {
        const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return domainRegex.test(newDomain);
    }

    const isValidDbCode = () => {
        return newDbCode.length > 2;
    }

    const handleDelete = (client) => {
        setMarkedDeleteClient(client);
        setIsDelete(true);
        setIsOpen(true);
    }


    const createClient = () => {
        setIsLoading(true);
        axios.post(`https://${newClient.domain}/api/master/create/`, {
            db_code: newClient.db_code,
            domain: newClient.domain
        })
            .then(() => {
                return axios.post(`https://${MASTER_DB_URL}/api/client/create`, newClient);
            })
            .then(() => {
                getData();
                setIsOpen(false);
                setNewDomain('');
                setNewDbCode('');
                setNewAtikowebURL('');
                showToast('Клиент успешно создан!', 'success');
                setIsLoading(false);
            })
            .catch((error) => {
                showToast('Ошибка при создании клиента!', 'error');
                console.error('Error saving settings:', error);
                setIsOpen(false);
                setNewDomain('');
                setNewDbCode('');
                setNewAtikowebURL('');
                setIsLoading(false);
            });
    };


    const updateClient = (db_code, status) => {
        setIsLoading(true);
        axios
            .put(`https://${MASTER_DB_URL}/api/client/update/`, {
                db_code,
                status: status === 'active' ? 'inactive' : 'active'
            })
            .then(() => {
                getData();
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error saving settings:', error);
            });
    }

    const deleteClient = (db_code, domain) => {
        setIsLoading(true);
        axios
            .delete(`https://${domain}/api/master/delete-one/`, {
                data: {
                    db_code,
                }
            })
            .then(() => {
                axios
                    .delete(`https://${MASTER_DB_URL}/api/client/delete-one`, {
                        data: {
                            db_code,
                            serverId: id
                        }
                    })
                    .then(() => {
                        getData();
                        setIsDelete(false);
                        setIsOpen(false);
                    })
            })
            .then(() => {
                setIsOpen(false);
                showToast('Клиент успешно удален!', 'success');
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                showToast('Ошибка при удалении клиента!', 'error');
                setIsLoading(false);
            });
    };


    const getData = () => {
        setIsLoading(true);
        axios
            .get(`https://${MASTER_DB_URL}/api/server/get-one`, {
                params: {
                    id,
                }
            })
            .then((response) => {
                setServer(response.data.server);
                setClients(response.data.server.client);
                setClientsQty(response.data.clientsQty);
                setActiveClientsQty(response.data.activeClientsQty);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching settings:', error);
                setErrorMessage(error.response.data.message);
            });
    }

    console.log(errorMessage);

    useEffect(() => {
        getData();
    }, []);

    // Вычисляем процент заполнения прогресс бара
    const progressPercent = (clientsQty / 4) * 100; // 4 клиента

    // Определяем цвет прогресс бара в зависимости от процента заполнения
    let barColor = '';

    switch (progressPercent) {
        case 75:
            barColor = 'bg-amber-500'; // Желтый, если заполнено 50% или 75%
            break;
        case 100:
            barColor = 'bg-red-500'; // Красный, если заполнено 100%
            break;
        default:
            barColor = 'bg-green-500'; // Зеленый, по умолчанию
            break;
    }

    return (
        <div className={'mx-auto h-screen pt-5 container'}>
            <div
                className={'flex z-20 bg-white/[.5] h-20 items-center px-5 rounded-xl backdrop-blur-lg sticky top-0 justify-between'}>
                <Button variant={"flat"} onPress={() => navigate(-1)}>
                    <IoIosArrowBack className={'text-4xl'}/>
                </Button>
                <div className={'grid place-content-center place-items-center'}>
                    <span className={'text-2xl opacity-60 font-semibold'}>
                       {server?.name.toUpperCase()}
               </span>
                    <span className={'text-2xl font-semibold'}>
                       {server?.ip}
               </span>
                </div>

                <Button disabled={clientsQty === 4} onPress={() => setIsOpen(true)} color={'primary'}
                        className={'font-semibold disabled:bg-primary/60'} size={"lg"}>
                    Добавить
                </Button>
            </div>


            <div className={'flex gap-10 mt-5 justify-between w-full'}>

                <Card
                    shadow='none'
                    className={`mb-3 w-full h-44`}
                >
                    <CardBody className='overflow-hidden relative'>

                        <div className={'grid pt-3 place-content-center gap-1 place-items-center'}>
                         <span className='truncate text-4xl font-semibold'>
					{clientsQty}
				</span>
                            <span className={'text-2xl opacity-40 font-semibold'}>
                            Всего клиентов
                         </span>
                        </div>

                        <div
                            className="h-[15px] absolute top-[70%] left-5 right-5 rounded-[20px] bg-gray-100">
                            <motion.div
                                initial={{width: 0}}
                                animate={{width: `${progressPercent}%`}}
                                className={`h-full rounded-[20px] ${barColor} absolute top-0 left-0`}
                            ></motion.div>
                        </div>

                    </CardBody>
                </Card>

                <Card
                    shadow='none'
                    className={`mb-3 bg-green-300 w-full h-44`}
                >
                    <CardBody className='overflow-hidden grid place-content-center place-items-center relative'>

                        <div className={'grid place-content-center place-items-center gap-3'}>
                         <span className='truncate text-4xl font-semibold'>
					{activeClientsQty}
				</span>
                            <span className={'text-2xl opacity-30 font-semibold'}>
                            Активных клиентов
                         </span>
                        </div>

                    </CardBody>
                </Card>

            </div>

            {isLoading
                ?

                <div className={'flex justify-center pt-20'}>
                    <Spinner color={"primary"}/>
                </div>

                : clients.length <= 0 ?

                    <div className={'flex justify-center pt-20'}>

                    </div>

                    :
                    <div className={'grid mt-10 gap-10 grid-cols-2 lg:grid-cols-4'}>
                        {clients.map((client) => (
                            <>

                                <ClientCard
                                    key={client?.domain}
                                    onUpdate={() => updateClient(client.db_code, client.status)}
                                    status={client?.status} domain={client?.domain}
                                    db_code={client.db_code}
                                    onDelete={() => handleDelete(client)}
                                />

                            </>

                        ))}
                    </div>

            }


            <ModalWindow
                scrollBehavior={'normal'}
                isOpen={isOpen}
                size={'2xl'}
                onClose={() => {
                    setIsOpen(false);
                    setIsDelete(false);
                }
                }
            >
                <div className='mx-3 grid place-content-center mt-3 mb-5'>
                    {isDelete ? (
                        <div className='mx-3 mt-3 mb-5'>
                            <div className='grid mb-5'>
								<span className='text-xl font-bold'>
									Вы точно хотите удалить клиента ?
								</span>
                            </div>

                            <div className='grid gap-3'>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Button
                                        size='lg'
                                        color='danger'
                                        isLoading={isLoading}
                                        onClick={() => deleteClient(markedDeleteClient.db_code, markedDeleteClient.domain)}
                                        className='font-bold flex-1 normal-case text-lg'
                                    >
                                        Удалить
                                    </Button>
                                </div>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Button
                                        size='lg'
                                        color={"danger"}
                                        variant={'light'}
                                        onClick={() => {
                                            setIsOpen(false);
                                            setIsDelete(false);
                                        }}
                                        className='font-bold flex-1 normal-case text-lg'
                                    >
                                        Отмена
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={'mb-5 flex justify-center'}>
                            <span className={'text-2xl font-bold'}>
                                Создание клиента
                            </span>
                            </div>

                            <Input
                                isRequired
                                fullWidth
                                type='text'
                                isInvalid={!isValidDomain()}
                                errorMessage={!isValidDomain() && "Пожалуйста введите корректный домен!"}
                                value={newDomain}
                                onChange={(e) => setNewDomain(e.target.value)}
                                label='Домен'
                                defaultValue=''
                                size='lg'
                                className='mb-5 w-96'

                            />

                            <Input
                                isRequired
                                fullWidth
                                type='text'
                                isInvalid={!isValidDbCode()}
                                errorMessage={!isValidDbCode() && "Пожалуйста введите код базы данных!"}
                                value={newDbCode}
                                onChange={(e) => setNewDbCode(e.target.value)}
                                label='Код базы данных'
                                defaultValue=''
                                size='lg'
                                className='mb-5 w-96'

                            />

                            <Input
                                isRequired
                                fullWidth
                                type='text'
                                isInvalid={newAtikowebURL.length < 16 || newAtikowebURL.length > 16}
                                errorMessage={!isValidDbCode() && "Пожалуйста введите URL AtikoWeb без 'https'"}
                                value={newAtikowebURL}
                                onChange={(e) => setNewAtikowebURL(e.target.value)}
                                label='URL AtikoWeb'
                                defaultValue=''
                                size='lg'
                                className='mb-5 w-96'

                            />

                            <Button
                                onPress={createClient}
                                size='lg'
                                isLoading={isLoading}
                                disabled={!isValidDbCode() || !isValidDomain() || (newAtikowebURL.length < 16 || newAtikowebURL.length > 16)}
                                color='primary'
                                className='font-semibold disabled:bg-primary/60 text-lg'
                            >
                                Создать
                            </Button>
                        </>
                    )}


                </div>
            </ModalWindow>

        </div>
    )
}

export default Detail
