import {useEffect, useState} from 'react'
import {Button, Input, Spinner} from "@nextui-org/react";
import ServerCard from "../components/ServerCard.jsx";
import axios from "axios";
import ModalWindow from "../components/Modal.jsx";
import {useNavigate} from "react-router-dom";


function Home() {
    const [servers, setServers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [newName, setNewName] = useState('');
    const [newIp, setNewIp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const MASTER_DB_URL = process.env.REACT_APP_MASTER_DB_URL;


    const newServer = {
        name: newName,
        ip: newIp
    }

    const isValidIp = () => {
        const ipRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}$/;
        return ipRegex.test(newIp);
    }

    const createServer = () => {
        setIsLoading(true);
        axios
            .post(`https://${MASTER_DB_URL}/api/server/create`, newServer)
            .then(() => {
                getServers();
                setIsLoading(false);
                setIsOpen(false);
                setNewName('');
            })
            .catch((error) => {
                console.error('Error saving settings:', error);
            });
    }

    const deleteServer = (id) => {
        setIsLoading(true);
        axios
            .delete(`https://${MASTER_DB_URL}/api/server/delete-one/`, {
                data: {
                    id,
                }
            })
            .then(() => {
                getServers();
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error saving settings:', error);
            });
    }


    const getServers = () => {
        setIsLoading(true);
        axios
            .get(`https://${MASTER_DB_URL}/api/server/get-all`)
            .then((response) => {
                setServers(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching settings:', error);
            });
    }

    useEffect(() => {
        getServers();
    }, []);

    return (
        <div className={'mx-auto pt-5 container'}>
            <div
                className={'flex bg-white/[.5] h-20 items-center px-5 rounded-xl backdrop-blur-lg sticky top-0 justify-between'}>
                   <span className={'text-4xl font-semibold'}>
                   Серверы
               </span>

                <Button onPress={() => setIsOpen(true)} color={'primary'} className={'font-semibold'} size={"lg"}>
                    Добавить
                </Button>
            </div>


            {isLoading
                ?

                <div className={'flex justify-center pt-20'}>
                    <Spinner color={"primary"}/>
                </div>

                : servers.length <= 0 ?

                    <div className={'flex justify-center pt-20'}>
                       <span className={'text-xl'}>
                            Серверов нет
                       </span>
                    </div>

                    :
                    <div className={'grid mt-10 gap-10 grid-cols-2 lg:grid-cols-4'}>
                        {servers.map((server) => (
                            <>
                                <ServerCard
                                    key={server?.id}
                                    onClick={() => navigate(`server/${server.id}`)}
                                    id={server.id}
                                    name={server.name}
                                    clientsQty={server.clientsQty}
                                    onDelete={() => deleteServer(server.id)}
                                    ip={server.ip}
                                />
                            </>

                        ))}
                    </div>

            }


            <ModalWindow
                scrollBehavior={'normal'}
                isOpen={isOpen}
                size={'2xl'}
                onClose={() => setIsOpen(false)}
            >
                <div className='mx-3 grid place-content-center mt-3 mb-5'>

                    <>
                        <div className={'mb-5 flex justify-center'}>
                            <span className={'text-2xl font-bold'}>
                                Создание сервера
                            </span>
                        </div>

                        <Input
                            isRequired
                            fullWidth
                            type='text'
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            label='Имя сервера'
                            defaultValue=''
                            size='lg'
                            className='mb-5 w-96'

                        />

                        <Input
                            isRequired
                            fullWidth
                            type='text'
                            value={newIp}
                            isInvalid={!isValidIp()}
                            errorMessage={!isValidIp() && "Пожалуйста введите корректный ip адрес!"}
                            onChange={(e) => setNewIp(e.target.value)}
                            label='Ip адрес сервера'
                            defaultValue=''
                            size='lg'
                            className='mb-5 w-96'

                        />

                        <Button
                            onPress={createServer}
                            size='lg'
                            disabled={newName.length <= 0 || !isValidIp()}
                            color='primary'
                            className='font-semibold disabled:bg-primary/60 text-lg'
                        >
                            Создать
                        </Button>
                    </>

                </div>
            </ModalWindow>

        </div>
    )
}

export default Home
