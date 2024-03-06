import {Card, CardHeader, Image} from '@nextui-org/react';
import React, {useEffect, useState} from 'react';

function InterestingCard({images, id, index, name, onClick, isLoading}) {
    const isFullWidth = index === 0 || index === 3;
    const [textColor, setTextColor] = useState('text-black');

    const API_URL_IMAGES = process.env.REACT_APP_API_IMAGE_URL;
    const imageList = Array.isArray(images)
        ? images.filter((image2) => image2.name.includes(`interesting_${id}`))
        : [];
    const image = imageList.length > 0 && imageList[0].name;

    useEffect(() => {
        const updateTextColor = async () => {
            if (imageList.length > 0) {
                const imageUrl = `${API_URL_IMAGES}${image}?timestamp=${new Date().getTime()}`;
                const isDark = await isImageDark(imageUrl);
                setTextColor(isDark ? 'text-white' : 'text-black');
            }
        };

        const isImageDark = async (imageUrl) => {
            return new Promise((resolve, reject) => {
                const img = document.createElement('img');
                img.crossOrigin = 'Anonymous';

                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    let dark = 0;
                    let total = 0;

                    for (let x = 0; x < img.width; x += 10) {
                        for (let y = 0; y < img.height; y += 10) {
                            total++;
                            const pixel = ctx.getImageData(x, y, 1, 1).data;
                            const brightness = (pixel[0] * 299 + pixel[1] * 587 + pixel[2] * 114) / 1000;
                            dark += brightness < 128 ? 1 : 0;
                        }
                    }

                    const isDark = (dark / total) > 0.5; // 50% threshold
                    resolve(isDark);
                };

                img.onerror = function () {
                    reject(new Error('Error loading image'));
                };

                img.src = imageUrl;
            });
        };

        updateTextColor();
    }, [API_URL_IMAGES, id, image]);

    return (
        <div className={`${isFullWidth ? 'col-span-2' : ''} cursor-pointer`} onClick={onClick}>
            <Card className={`h-36 lg:h-52`}>
                <CardHeader className={`absolute z-[1] flex-col items-start ${textColor}`}>
                    <span className='text-lg leading-none lg:text-2xl font-bold'>{name}</span>
                </CardHeader>
                <Image
                    shadow='none'
                    radius='lg'
                    loading='lazy'
                    width='100%'
                    isLoading={isLoading}
                    disableSkeleton={false}
                    className='z-0 w-full h-36 lg:h-52 object-bottom object-cover'
                    src={`${API_URL_IMAGES}${image}?timestamp=${new Date().getTime()}`}
                />
            </Card>
        </div>
    );
}

export default InterestingCard;
