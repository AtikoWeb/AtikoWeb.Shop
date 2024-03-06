import {Card, CardBody, CardFooter, Image} from '@nextui-org/react';
import React, {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import {useInView} from 'react-intersection-observer';

function ProductCard({
                         images,
                         art,
                         price = 0,
                         name,
                         onClick,
                         brand,
                         isUpload = false,
                         category,
                         weight = 'w-40',
                     }) {
    const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;
    const filteredImages = images.filter((image) => image.name.includes(`${art}`));
    const image = filteredImages.length > 0 && filteredImages[0].name;
    const [isLoading, setIsLoading] = useState(true);
    const {ref, inView} = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    // Обновляем isLoading в зависимости от того, виден ли компонент в данный момент
    useEffect(() => {
        setIsLoading(!inView);
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
                className={`mb-3 z-0 snap-normal snap-start shrink-0 ${weight}`}
                onPress={onClick}
            >
                <CardBody className="">
                    <Image
                        shadow="none"
                        radius="lg"
                        loading="lazy"
                        width="100%"
                        isLoading={isLoading}
                        disableSkeleton={false}
                        className="w-full object-cover h-44"
                        src={`${API_URL_IMAGES}${image}?timestamp=${new Date().getTime()}`}
                    />
                </CardBody>
                <CardFooter className="text-small grid">
                    <div className={'flex gap-1'}>
                        <span className="text-left text-xs md:text-sm">{brand?.name}</span>
                        <span className="text-left text-xs md:text-sm">{art}</span>
                    </div>
                    <span className="text-left text-ellipsis truncate text-[15px] md:text-lg font-bold">
            {name}
          </span>

                    {!isUpload && (
                        <>
              <span
                  className="text-left text-ellipsis truncate text-neutral-400 w-36 md:w-44 text-[15px] md:text-lg font-bold">
                {category.name}
              </span>
                            <span className="flex md:text-lg text-[17px] font-bold">
                {price.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')} ₸
              </span>
                        </>
                    )}
                </CardFooter>
            </Card>
        </motion.div>
    );
}

export default ProductCard;
