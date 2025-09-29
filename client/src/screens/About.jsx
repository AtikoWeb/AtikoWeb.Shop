import {Button, Image, Spinner} from '@nextui-org/react';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {IoIosArrowBack} from 'react-icons/io';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import axios from "../../axios.js";
import sanitizeHtml from "sanitize-html";

function About() {
    const navigate = useNavigate();
    const currentDomain = window.location.hostname === 'localhost' ? process.env.REACT_APP_DOMAIN : window.location.hostname;
    const db_code = Cookies.get('db_code');
    const API_URL_IMAGES = `https://${currentDomain}/api/images/${db_code}/images/`;
    const [isLoading, setIsLoading] = useState(true);
    const [desc, setDesc] = useState('');
    const [isScroll, setIsScroll] = useState(false);

    const menuItems = [
        {
            name: '10 лет',
            desc: 'На рынке',
        },
        {
            name: '15000 +'.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 '),
            desc: 'Заказов',
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                axios
                    .get(`/settings?db_code=${db_code}`)
                    .then((response) => {
                        setDesc(response.data.config.desc);
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        console.error('Error fetching settings:', error);
                    });

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

    if (isLoading) {
        return (
            <div className={'flex justify-center mt-20 items-center'}>
                <Spinner/>
            </div>
        )
    }

    return (
        <div
            className='mx-auto lg:h-screen overflow-x-hidden mt-14 md:mt-0 rounded-2xl bg-white h-full w-full'>
            <div
                className={`flex bg-white lg:sticky 
					 ${
                    isScroll ? 'shadow-black/20 shadow-2xl' : ''} fixed top-0 justify-between lg:mt-5 z-[1] h-16 rounded-2xl w-full items-center`}
            >
                <Button
                    size='sm'
                    className='normal-case -ml-2 bg-transparent flex justify-start'
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowBack className='text-4xl'/>
                </Button>
                <span className={`text-xl font-bold`}>О компании</span>

                <Button
                    size='sm'
                    className='bg-transparent -mr-1'
                ></Button>
            </div>

            <div className={'lg:mx-20 h-screen'}>
                <div className='bg-neutral-100 mx-3 rounded-xl mt-3 h-40 grid place-content-center mb-3'>
                    <Image
                        className='w-full object-contain p-4 h-32 z-0'
                        src={`${API_URL_IMAGES}LOGO.PNG`}
                    />
                </div>
                <div className='w-full px-5'>
                    {/*<div className='flex gap-3 rounded-xl'>*/}
                    {/*    {menuItems.map((obj) => (*/}
                    {/*        <>*/}
                    {/*            <div*/}
                    {/*                className='grid place-content-center rounded-xl place-items-center w-screen bg-neutral-100 h-28'>*/}
                    {/*				<span className='text-2xl font-bold text-left'>*/}
                    {/*					{obj.name}*/}
                    {/*				</span>*/}
                    {/*                <span className='text-md lg:text-lg text-neutral-400'>*/}
                    {/*					{obj.desc}*/}
                    {/*				</span>*/}
                    {/*            </div>*/}
                    {/*        </>*/}
                    {/*    ))}*/}
                    {/*</div>*/}
                </div>
                <div className='lg:mx-5 text-left mx-3 mt-5 mb-3'>
                    <div className='mb-5'>
                       <span className={'text-xl'}>
    {desc?.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            <div dangerouslySetInnerHTML={{__html: sanitizeHtml(line + '<br/>')}}/>
        </React.Fragment>
    ))}
</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
