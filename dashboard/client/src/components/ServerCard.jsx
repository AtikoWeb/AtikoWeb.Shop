import React from 'react';
import {motion} from 'framer-motion';
import {Button, Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from '@nextui-org/react';
import {BsThreeDots} from "react-icons/bs";

function ServerCard({name, onClick, ip, onDelete, clientsQty = 0}) {

    // Вычисляем процент заполнения прогресс бара
    const progressPercent = (clientsQty / 4) * 100; // 4 клиента

    // Определяем цвет прогресс бара в зависимости от процента заполнения
    let barColor = '';

    switch (progressPercent) {
        case 75:
            barColor = 'bg-amber-500'; // Желтый, если заполнено 50% или 75%
            break;
        case 100:
            barColor = 'bg-red-500'; // Красный, если заполнено 100%
            break;
        default:
            barColor = 'bg-green-500'; // Зеленый, по умолчанию
            break;
    }

    const getClientLabel = () => {
        if (clientsQty === 0) return 'клиентов';
        if (clientsQty === 1) return 'клиент';
        if (clientsQty >= 2 && clientsQty <= 4) return 'клиента';
        return 'клиентов';
    };

    return (
        <motion.div
            key='ServerCard'
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 1, delay: 0.2}}
        >

            <Card
                shadow='none'
                className={`mb-3 z-0 w-full h-44`}
                isPressable={true}
                onPress={onClick}
            >
                <CardBody className='overflow-hidden relative'>

                    {clientsQty === 0 && <Dropdown>
                        <DropdownTrigger>

                            <Button variant={'light'} size={"sm"}
                                    className={'absolute right-1 top-1'}>
                                <BsThreeDots className={'text-2xl'}/>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Dynamic Actions">
                            <DropdownItem onPress={onDelete} color={"danger"} className={'text-danger'}>
                                Удалить
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    }

                    <div className={'flex pt-10 justify-center gap-3 items-center'}>
                         <span className='truncate text-3xl font-semibold'>
					{clientsQty}
				</span>
                        <span className={'text-3xl opacity-40 font-semibold'}>
                            {getClientLabel()}
                         </span>
                    </div>

                    <div
                        className="h-[15px] absolute top-[60%] left-5 right-5 rounded-[20px] bg-gray-100">
                        <motion.div
                            initial={{width: 0}}
                            animate={{width: `${progressPercent}%`}}
                            className={`h-full rounded-[20px] ${barColor} absolute top-0 left-0`}
                        ></motion.div>
                    </div>

                </CardBody>
            </Card>


            <div className={'grid'}>
                <span className='text-ellipsis truncate opacity-60 text-lg font-semibold'>
                {name.toUpperCase()}
            </span>
                <span className='text-ellipsis truncate text-xl font-semibold'>
                {ip}
            </span>
            </div>
        </motion.div>
    );
}

export default ServerCard;
