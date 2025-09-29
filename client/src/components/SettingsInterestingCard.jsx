import {Card, Image} from '@nextui-org/react';
import React from 'react';
import Cookies from "js-cookie";

function SettingsInterestingCard({
                                     images,
                                     name = '',
                                     settingsDB_code,
                                     id = '',
                                     onClick,
                                     index,

                                 }) {
    const currentDomain = window.location.hostname === 'localhost' ? process.env.REACT_APP_DOMAIN : window.location.hostname;
    const db_code = Cookies.get('db_code') || settingsDB_code;
    const lowerCase_db_code = db_code.toString().toLowerCase();
    const API_URL_IMAGES = `https://${currentDomain}/api/images/${lowerCase_db_code}/images/`
    // фильтруем список изображений по артикулу продукта
    const imageList = Array.isArray(images)
        ? images.filter((image2) => image2.name.includes(`INTERESTING_${id.toUpperCase()}`))
        : [];
    const image = imageList.length > 0 && imageList[0].name;

    const isFullWidth = index === 0 || index === 3;

    return (
        <div className={`${isFullWidth ? 'col-span-2' : ''} cursor-pointer`} onClick={onClick}>
            <Card className={`h-36 lg:h-64`}>
                <Image
                    shadow='none'
                    radius='lg'
                    loading='lazy'
                    width='100%'
                    isLoading={imageList.length === 0}
                    disableSkeleton={false}
                    className={`z-0 w-full h-36 lg:h-64 object-cover`}
                    src={`${API_URL_IMAGES}${image}`}
                />
            </Card>
        </div>

    );
}

export default SettingsInterestingCard;
