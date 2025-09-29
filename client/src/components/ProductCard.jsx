import {Card, CardBody, CardFooter, Image} from '@nextui-org/react';
import React, {useEffect, useMemo, useState} from 'react';
import {motion} from 'framer-motion';
import {useInView} from 'react-intersection-observer';
import Cookies from "js-cookie";
import {LuStarOff} from "react-icons/lu";

function ProductCard({
                         images = [],
                         art = '',
                         settingsDB_code,
                         price = 0,
                         isCategory,
                         rating,
                         name,
                         onClick,
                         brand = '',
                         isUpload = false,
                         category,
                         weight = 'w-40',
                     }) {
    const db_code = Cookies.get('db_code') || settingsDB_code;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const lowerCase_db_code = db_code.toString().toLowerCase();
    const [filteredImages, setFilteredImages] = useState([]);
    const currentDomain = window.location.hostname === 'localhost' ? process.env.REACT_APP_DOMAIN : window.location.hostname;
    const API_URL_IMAGES = `https://${currentDomain}/api/images/${lowerCase_db_code}/images/`;
    const {ref, inView} = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    const [isLoading, setIsLoading] = useState(true);

    const regex = new RegExp(`^${art}_`);

    const filteredImagesMemo = useMemo(() => Array.isArray(images) ? images.filter((image) => regex.test(image.name)) : [], [images, art]);


    const image = useMemo(() => {
        return filteredImagesMemo.length > 0 && filteredImagesMemo[0].name;
    }, [filteredImagesMemo]);


    useEffect(() => {
        setIsLoading(!(inView));
    }, [inView]);

    return (
        <motion.div
            key="ProductCard"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.8, delay: 0.2}}
            ref={ref}
        >
            <Card
                shadow={'none'}
                isPressable
                className={`mb-1 h-[300px] z-0 bg-neutral-100 snap-normal snap-end shrink-0 ${weight}`}
                onPress={onClick}
            >
                <CardBody className="overflow-hidden">
                    <div className={'bg-white rounded-2xl'}>
                        <Image
                            shadow="none"
                            radius="lg"
                            isZoomed={true}
                            width="100%"
                            isLoading={isLoading}
                            className="w-full bg-center object-cover h-[170px]"
                            src={filteredImagesMemo.length === 0 ? '/not_img.jpg' : `${API_URL_IMAGES}${image}`}
                        />
                    </div>
                </CardBody>
                <CardFooter className="text-small text-ellipsis truncate w-44 gap-1 grid">
                    <div className={`flex ${brand?.name && 'gap-1'}`}>
                        <span className="text-left text-xs md:text-sm">{brand?.name}</span>
                        <span className="text-left text-xs md:text-sm">{art}</span>
                    </div>
                    <span className="text-left text-ellipsis truncate text-[15px] md:text-lg font-bold">
                        {name}
                    </span>
                    {!isUpload && (
                        <>

                            {!isCategory && (
                                <span
                                    className="text-left text-ellipsis truncate text-neutral-400 w-36 md:w-44 text-[15px] md:text-lg font-bold">
                                {category?.name}
                            </span>
                            )}

                            <div className={'flex justify-between items-center'}>
                                <span className="md:text-lg text-[17px] font-bold">
                                {price.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')} ₸
                            </span>

                                <div className={'flex absolute right-3 justify-center items-center gap-1'}>
                                    <LuStarOff className={'text-amber-400 text-2xl'}/>

                                    <span className={'font-semibold text-[17px]'}>
                                       {rating}
                                   </span>
                                </div>
                            </div>
                        </>
                    )}

                </CardFooter>
            </Card>
        </motion.div>
    );
}

export default ProductCard;
