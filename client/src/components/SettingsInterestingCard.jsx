import {Card, CardBody, CardFooter, Image} from '@nextui-org/react';
import React from 'react';
import {motion} from 'framer-motion';

function SettingsInterestingCard({
                                     images,
                                     name,
                                     id,
                                     onClick,
                                     index,
                                 }) {
    const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;
    // фильтруем список изображений по артикулу продукта
    const imageList = Array.isArray(images)
        ? images.filter((image2) => image2.name.includes(`interesting_${id}`))
        : [];
    const image = imageList.length > 0 && imageList[0].name;

    const isFullWidth = index === 0 || index === 3;

    return (
        <motion.div
            key='SettingsInterestingCard'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 1, delay: 0.2}}
        >
            <Card
                shadow='none'
                isPressable
                className={`mb-3 h-60 `}
                onPress={onClick}
            >
                <CardBody className='overflow-hidden'>
                    <Image
                        shadow='none'
                        radius='lg'
                        loading='lazy'
                        width='100%'
                        isLoading={imageList.length <= 0}
                        disableSkeleton={false}
                        className='object-cover h-44'
                        src={`${API_URL_IMAGES}${image}?timestamp=${new Date().getTime()}`}
                    />
                </CardBody>
                <CardFooter className='text-small grid'>
                <span className='text-left text-ellipsis truncate text-[15px] md:text-lg font-bold'>
					{name}
				</span>
                </CardFooter>
            </Card>
        </motion.div>

    );
}

export default SettingsInterestingCard;
