import {Button, Card, Image} from '@nextui-org/react';
import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";
import {useDispatch, useSelector} from "react-redux";
import {motion} from "framer-motion";
import {FaChevronRight} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {setSelectedCategory} from "../../redux/slices/categorySlice.js";
import {useInView} from "react-intersection-observer";


function CategoryCard({
                          images,
                          onClickUpload,
                          name,
                          isSearch,
                          isHome,
                          settingsDB_code,
                          id,
                          isUpload,

                      }) {
    const db_code = Cookies.get('db_code') || settingsDB_code;
    const lowerCase_db_code = db_code.toString().toLowerCase();
    const selectedCategory = useSelector(
        (state) => state.categories.selectedCategory
    );

    const dispatch = useDispatch();
    const currentDomain = window.location.hostname === 'localhost' ? process.env.REACT_APP_DOMAIN : window.location.hostname;
    const API_URL_IMAGES = `https://${currentDomain}/api/images/${lowerCase_db_code}/images/`
    // фильтруем список изображений по артикулу продукта
    const imageList = Array.isArray(images)
        ? images.filter((image2) => image2.name.includes(`CATEGORY_${id}`))
        : [];
    const image = imageList.length > 0 && imageList[0].name;
    const navigate = useNavigate();

    const {ref, inView} = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(!(inView));
    }, [inView]);

    const onClick = (id) => {
        dispatch(setSelectedCategory(id));

        navigate(`/category/${id}`);

    };


    return (
        <motion.div
            key="CategoryCard"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.8, delay: 0.2}}
            ref={ref}
        >
            {isUpload ? (
                <Card
                    isPressable
                    className={`z-0 snap-normal w-full h-24 snap-start shrink-0`}
                    onPress={onClickUpload}

                >
                    <div className='flex mx-3 gap-5 justify-center items-center'>
                        <Image
                            shadow='none'
                            isLoading={isLoading}
                            className='w-24 p-2 object-cover rounded-3xl h-24'
                            src={!image ? '/not_img.jpg' : `${API_URL_IMAGES}${image}`}
                        />

                        <span className='text-left text-ellipsis truncate text-[15px] md:text-lg font-bold'>
					{name}
				</span>
                    </div>

                </Card>
            ) : isSearch ? (
                    <Button
                        className={`z-0 bg-neutral-100 flex justify-between rounded-xl snap-normal w-full h-14 snap-start shrink-0`}
                        onPress={() => onClick(id)}
                        size={"lg"}
                        ref={ref}
                    >
                        <div className={'flex justify-center items-center gap-5'}>
                            {image &&
                                <Image
                                    isLoading={isLoading}
                                    shadow='none'
                                    className='w-16 p-2 object-cover rounded-2xl h-14'
                                    src={`${API_URL_IMAGES}${image}`}
                                />
                            }
                            <span
                                className={`text-left text-ellipsis truncate text-[15px] md:text-[15px] font-semibold ${!image && 'h-14 flex items-center'}`}>
                                {name}
                                 </span>
                        </div>
                        <FaChevronRight className='text-neutral-400'/>
                    </Button>

                )
                : isHome ? (
                    <>
                        <Card
                            isPressable
                            className={`z-0 ml-3 relative -mr-3 bg-neutral-100 rounded-xl snap-normal w-28 h-24 snap-start shrink-0`}
                            onPress={() => onClick(id)}
                            radius={"none"}
                            shadow={"none"}
                            ref={ref}
                        >
                            <div className='grid mx-3 gap-1 items-center'>


                                     <span
                                         className={`text-left z-10 pt-2 text-[14px] md:text-[15px] font-semibold`}>
                            {name}
                            </span>


                                <Image
                                    shadow='none'
                                    isLoading={isLoading}
                                    className='w-20 z-0 ml-5 bg-right-bottom -mt-1 rounded-2xl h-20'
                                    src={`${API_URL_IMAGES}${image}`}
                                />


                            </div>
                        </Card>
                    </>
                ) : (
                    <Card
                        isPressable
                        className={`z-0 ${selectedCategory === id || isHome ? 'bg-neutral-100' : ''} rounded-xl snap-normal w-full h-14 snap-start shrink-0`}
                        onPress={() => onClick(id)}
                        radius={"none"}
                        shadow={"none"}
                    >
                        <div className='flex mx-3 w-44 gap-1 items-center'>
                            {image &&
                                <Image
                                    shadow='none'
                                    className='w-16 p-2 object-cover rounded-2xl h-14'
                                    src={`${API_URL_IMAGES}${image}`}
                                />
                            }

                            <span
                                className={`text-left w-44 text-ellipsis truncate text-[15px] md:text-[15px] font-semibold ${!image && 'h-14 flex items-center'}`}>
                            {name}
                            </span>


                        </div>
                    </Card>

                )
            }
        </motion.div>
    );
}

export default CategoryCard;
