import {Card, Image} from '@nextui-org/react';
import React from 'react';

function CategoryCard({
                          images,
                          name,
                          id,
                          onClick,
                      }) {
    const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;
    // фильтруем список изображений по артикулу продукта
    const imageList = Array.isArray(images)
        ? images.filter((image2) => image2.name.includes(`category_${id}`))
        : [];
    const image = imageList.length > 0 && imageList[0].name;

    return (
        <Card
            isPressable
            className={`z-0 snap-normal w-full h-24 snap-start shrink-0`}
            onPress={onClick}
          
        >
            <div className='flex gap-5 justify-center items-center'>
                <Image
                    shadow='none'
                    radius='lg'
                    loading='lazy'
                    isLoading={imageList.length <= 0}
                    disableSkeleton={false}
                    className='w-24 object-cover h-24'
                    src={`${API_URL_IMAGES}${image}?timestamp=${new Date().getTime()}`}
                />

                <span className='text-left text-ellipsis truncate text-[15px] md:text-lg font-bold'>
					{name}
				</span>
            </div>

        </Card>
    );
}

export default CategoryCard;
