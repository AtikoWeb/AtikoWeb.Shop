import {Button, Spinner} from '@nextui-org/react';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {IoIosArrowBack} from 'react-icons/io';
import {FaPhoneAlt} from 'react-icons/fa';
import {IoLogoWhatsapp} from 'react-icons/io5';
import axios from "../../axios.js";
import Cookies from "js-cookie";

function Contact() {
    const [yandexMapURL, setYandexMapURL] = useState('https://yandex.ru/map-widget/v1/?um=constructor%3A12ead957f26aa42e31c29ee378370e6991b01a8f0fced1618f3b250230c7d0f0&amp;source=constructor');
    const currentDomain = window.location.hostname || process.env.REACT_APP_DOMAIN;
    const db_code = Cookies.get('db_code');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const MASTER_DB_URL = process.env.REACT_APP_MASTER_DB_URL;
    const [isScroll, setIsScroll] = useState(false);

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


    useEffect(() => {
        const fetchData = async () => {
            try {
                const yandexURLResponse = await axios.get(`https://${MASTER_DB_URL}/api/client/get-yandexURL`, {
                    params: {
                        db_code
                    }
                });

                axios
                    .get(`/settings?db_code=${db_code}`)
                    .then((response) => {
                        setPhone(response.data.config.phone || '70860010101');
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        console.error('Error fetching settings:', error);
                    });

                setYandexMapURL(yandexURLResponse.data.url);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching Yandex URL:', error);
            }
        };

        fetchData();

        return () => {

        };
    }, []);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className={'flex justify-center mt-20 items-center'}>
                <Spinner/>
            </div>
        )
    }

    console.log(`https://wa.me/+7${phone}?text=Здравствуйте! Хочу задать вопрос об автоматизации`)

    return (
        <div className='mx-auto overflow-x-hidden mt-14 md:mt-0 rounded-2xl bg-white lg:h-screen h-full w-full'>

            <div
                className={`flex lg:sticky 
					bg-white  ${
                    isScroll ? 'shadow-black/20 shadow-2xl' : ''} fixed top-0 justify-between lg:mt-5 z-[1] h-16 rounded-xl w-full items-center`}
            >
                <Button
                    size='sm'
                    className='normal-case -ml-2 bg-transparent flex justify-start'
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowBack className='text-4xl'/>
                </Button>
                <span className={`text-xl font-bold`}>Контакты</span>

                <Button
                    size='sm'
                    className='bg-transparent -mr-1'
                ></Button>
            </div>
            <iframe
                src={yandexMapURL}
                width='600'
                height='450'
                className='mx-auto mt-2 w-full'
                allowFullScreen=''
                style={{
                    borderRadius: '10px'
                }}
                loading='lazy'
                onLoad={() => setIsLoading(false)}
                referrerPolicy='no-referrer-when-downgrade'
            />

            <div className='w-full mt-5 px-5'>
                <div className='flex gap-5 rounded-xl justify-center'>
                    <div
                        className='grid place-content-center rounded-xl place-items-center w-32 bg-neutral-100 cursor-pointer hover:bg-neutral-200 h-24'>
						<span className='text-2xl font-bold text-left'>
							<a href={`tel:+7${phone}`}>
								<FaPhoneAlt className='text-5xl md:text-5xl'/>
							</a>
						</span>
                    </div>
                    <div
                        className='grid place-content-center rounded-xl place-items-center w-32 bg-green-500 hover:bg-green-600 h-24'>
						<span className='text-2xl font-bold text-left'>
							<a href={`https://wa.me/+7${phone}?text=Здравствуйте! Хочу задать вопрос об автоматизации`}>
								<IoLogoWhatsapp className='text-5xl md:text-6xl text-white'/>
							</a>
						</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;
