import {Button, Image} from '@nextui-org/react';
import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {IoIosArrowBack} from 'react-icons/io';
import 'react-toastify/dist/ReactToastify.css';
import {GiStairsGoal} from 'react-icons/gi';
import {FaQuestion} from 'react-icons/fa';

function About() {
    const navigate = useNavigate();

    const menuItems = [
        {
            name: '10 лет',
            desc: 'На рынке',
        },
        {
            name: '15000+',
            desc: 'Заказов',
        },
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const threshold = 80; //порог видимости

            // Проверяем, находится ли элемент в видимой части viewport
            if (scrollY >= threshold) {
                setIsInView(false);
            } else {
                setIsInView(true);
            }
        };
        // Добавляем слушателя события прокрутки страницы
        window.addEventListener('scroll', handleScroll);

        // Убираем слушателя события при размонтировании компонента
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='mx-auto overflow-x-hidden mt-14 md:mt-0 rounded-2xl bg-white lg:h-screen h-full w-full'>
            <div
                className={`flex lg:sticky 
					bg-white/[.5] backdrop-blur-lg fixed top-0 justify-between lg:mt-5 z-[1] h-16 rounded-xl w-full items-center`}
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

            <div>
                <div className='bg-neutral-100 mx-5 rounded-xl mt-3 h-40 grid place-content-center mb-3'>
                    <Image
                        className='h-16 lg:h-20 z-0'
                        src='/aokia_logo.png'
                    />
                </div>
                <div className='w-full px-5'>
                    <div className='flex gap-3 rounded-xl'>
                        {menuItems.map((obj) => (
                            <>
                                <div
                                    className='grid place-content-center rounded-xl place-items-center w-screen bg-neutral-100 h-28'>
									<span className='text-2xl font-bold text-left'>
										{obj.name}
									</span>
                                    <span className='text-md lg:text-lg text-neutral-400'>
										{obj.desc}
									</span>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
                <div className='lg:mx-5 mx-3 mt-10 mb-3'>
                    <div className='mb-5'>
                        <div className='flex gap-2 mb-1 text-2xl font-bold'>
                            <GiStairsGoal className='text-neutral-400 text-3xl'/>
                            <span>Наша главная цель</span>
                        </div>
                        <span className='text-lg'>
							Обеспечить надежным и инновационным оборудованием, тем самым
							вдохновляя процветание и эффективность в сфере торговли.
						</span>
                    </div>
                    <div>
                        <div className='flex gap-2 mb-1 text-2xl font-bold'>
                            <FaQuestion className='text-neutral-400 text-3xl'/>
                            <span>Почему мы ?</span>
                        </div>
                        <span className='text-lg'>
							Выбирая нас, вы вкладываете свою доверенность в опыт и преданность
							качеству, открывая двери к совершенству в области оборудования для
							торговли.
						</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
