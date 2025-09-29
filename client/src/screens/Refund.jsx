import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {IoIosArrowBack, IoIosWarning} from 'react-icons/io';
import {Button, Spinner} from '@nextui-org/react';
import axios from "../../axios.js";
import Cookies from "js-cookie";
import sanitizeHtml from 'sanitize-html';

function Refund() {
    const [isScroll, setIsScroll] = useState(false);
    const [refund_policy, setRefundPolicy] = useState('');
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const db_code = Cookies.get('db_code');

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
                axios
                    .get(`/settings?db_code=${db_code}`)
                    .then((response) => {
                        setRefundPolicy(response.data.config.refund_policy);
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


    if (isLoading) {
        return (
            <div className={'flex justify-center mt-20 items-center'}>
                <Spinner/>
            </div>
        )
    }

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                <span className={`text-xl font-bold`}>Политика возврата</span>

                <Button
                    size='sm'
                    className='bg-transparent -mr-1'
                ></Button>
            </div>

            <div className='flex mx-3 lg:mx-5 mt-5 text-2xl gap-2'>
                <IoIosWarning className='text-warning-500 mt-1'/>
                <span className='font-bold'>Важно!</span>
            </div>

            <div className='lg:mx-5 text-left mx-3 mt-5 mb-3'>
                <div className='mb-5'>
                      <span className={'text-xl'}>
    {refund_policy?.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            <div dangerouslySetInnerHTML={{__html: sanitizeHtml(line + '<br/>')}}/>
        </React.Fragment>
    ))}
</span>

                </div>
            </div>
        </div>
    );
}

export default Refund;
