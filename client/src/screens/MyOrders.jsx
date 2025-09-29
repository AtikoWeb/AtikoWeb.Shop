import React, {useEffect, useState} from 'react';
import axios from '../../axios.js';
import {useSelector} from 'react-redux';
import Cookies from 'js-cookie';
import {Button, Spinner} from "@nextui-org/react";
import {IoIosArrowBack} from "react-icons/io";
import {useNavigate} from "react-router-dom";

function MyOrders() {
    const userId = useSelector((state) => state.user.userId);
    const [isLoading, setIsLoading] = useState(true); // Устанавливаем isLoading в true перед загрузкой
    const [user, setUser] = useState({name: '', email: '', phone: ''});
    const currentDomain = window.location.hostname;
    const navigate = useNavigate();
    const db_code = Cookies.get('db_code');
    const [isScroll, setIsScroll] = useState(false);
    const ATIKOWEB_URL = localStorage.getItem('AtikowebURL');

    useEffect(() => {
        const getUser = async () => {
            try {
                const {data} = await axios.get('/user/get-one', {
                    params: {id: userId, db_code},
                });
                setUser({name: data.username, email: data.email, phone: data.phone});
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        getUser();
    }, []);

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setIsScroll(scrollTop > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>

            <div
                className={`flex lg:sticky 
					bg-white ${
                    isScroll ? 'shadow-black/20 shadow-2xl' : ''} fixed top-0 justify-between lg:mt-5 z-[1] h-16 rounded-xl w-full items-center`}
            >
                <Button
                    size='sm'
                    className='normal-case -ml-2 bg-transparent flex justify-start'
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowBack className='text-4xl'/>
                </Button>
                <span className={`text-xl font-bold`}>Мои заказы</span>

                <Button
                    size='sm'
                    className='bg-transparent -mr-1'
                ></Button>
            </div>

            <div className={'z-50'}>

                {isLoading &&
                    <div className={'flex justify-center items-center h-60'}>
                        <Spinner/>
                    </div>
                }

                <iframe
                    title="Example"
                    width="100%"
                    src={`https://${ATIKOWEB_URL}/m?code=${db_code}&user=SITE_MY_ORDER&email=${user.email}&telefon=${user.phone}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                    className={'h-screen px-3'}
                ></iframe>
            </div>

        </>
    );
}

export default MyOrders;
