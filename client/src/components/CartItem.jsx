import React, {useEffect, useState} from 'react';
import {decrementItem, incrementItem, removeFromCart,} from '../../redux/slices/cartSlice';
import {useDispatch} from 'react-redux';
import ModalWindow from './Modal';
import {Button} from '@nextui-org/react';
import {TbTrashX} from "react-icons/tb";

function CartItem({item, isCartSmall = false}) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const increment = () => {
        dispatch(incrementItem({size: item.size, productId: item.productId}));
        console.log(item.size);
    };

    const decrement = () => {
        dispatch(decrementItem({size: item.size, productId: item.productId}));
    };

    const remove = () => {
        dispatch(removeFromCart({size: item.size, productId: item.productId}));
        setIsOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (


        <>
            <div
                className={`mb-5 flex ${isCartSmall && 'mb-[65px]'} justify-between relative pt-6 bg-neutral-50 px-3 rounded-lg`}>
                <div className='flex justify-between mb-3 items-center'>

                    <div className='flex flex-1 gap-2'>
                        <img
                            src={item?.image}
                            alt={''}
                            className='h-16 md:h-14 md:md-14 w-16 rounded-lg'
                            onError={(e) => {
                                e.target.src = '/not_img.jpg';
                            }}
                        />

                        <div className='grid place-content-center'>
							<span
                                className={`font-bold ${isCartSmall ? 'text-ellipsis truncate md:text-lg md:w-36 xl:w-36 text-md w-32' : 'text-ellipsis truncate md:text-xl md:w-60 text-md w-32'} `}>
								{item?.name}
							</span>
                            <span className={`text-md md:text-[16px] ${!item.size && 'hidden'}`}>
					Размер: {item?.size?.sizeName}
				</span>
                        </div>
                    </div>


                    {isCartSmall ? (
                        <>
                            <div
                                className='flex flex-1 absolute md:right-0 xl:right-0 right-3 ml-3 p-1 bg-neutral-200/60 xl:w-full md:mt-[130px] md:w-full xl:mt-[130px] rounded-md px-3 xl:rounded-b-lg xl:px-3 xl:gap-6 gap-6'>
                                {item?.qty === 1 ? (
                                        <button
                                            onClick={() => setIsOpen(true)}
                                            className={`normal-case flex justify-center items-center text-xl flex-1`}
                                        >
                                            <TbTrashX className='text-xl cursor-pointer'/>
                                        </button>
                                    ) :
                                    <button
                                        onClick={decrement}
                                        className={`normal-case text-xl flex-1`}
                                        disabled={item?.qty === 1}
                                    >
                                        -
                                    </button>}
                                <span className='mt-0.5 flex-1 text-center font-bold'>
							{item?.qty}
						</span>
                                <button
                                    onClick={increment}
                                    className='normal-case text-xl flex-1'
                                >
                                    +
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div
                                className='flex flex-1 absolute right-3 p-1 bg-neutral-200/60 rounded-md px-3 ml-5 gap-6'>
                                {item?.qty === 1 ? (
                                        <button
                                            onClick={() => setIsOpen(true)}
                                            className={`normal-case flex justify-center items-center text-xl flex-1`}
                                        >
                                            <TbTrashX className='text-xl cursor-pointer'/>
                                        </button>
                                    ) :
                                    <button
                                        onClick={decrement}
                                        className={`normal-case text-xl flex-1`}
                                        disabled={item?.qty === 1}
                                    >
                                        -
                                    </button>}
                                <span className='mt-0.5 flex-1 text-center font-bold'>
							{item?.qty}
						</span>
                                <button
                                    onClick={increment}
                                    className='normal-case text-xl flex-1'
                                >
                                    +
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>


            <ModalWindow
                isOpen={isOpen}
                size='xl'
                scrollBehavior={isMobile ? 'normal' : 'outside'}
                onClose={() => setIsOpen(false)}
                children={
                    <div className='mx-3 mt-3 mb-5'>
                        <div className='grid mb-5'>
								<span className='text-xl xl:text-2xl font-bold'>
									Удалить товар {item?.name} ?
								</span>
                            <span className={`text-md xl:text-xl ${!item.size && 'hidden'}`}>
									Размер: {item?.size?.sizeName}
								</span>
                        </div>

                        <div className='grid gap-3'>
                            <div className='w-full bg-white/[.8] flex'>
                                <Button
                                    size='lg'
                                    color='primary'
                                    onClick={remove}
                                    className='font-bold bg-red-500 flex-1 normal-case xl:text-xl text-lg'
                                >
                                    Удалить
                                </Button>
                            </div>
                            <div className='w-full bg-white/[.8] flex'>
                                <Button
                                    size='lg'
                                    variant={"light"}
                                    onClick={() => setIsOpen(false)}
                                    className='font-bold text-red-500 flex-1 normal-case xl:text-xl text-lg'
                                >
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    </div>
                }
            />

        </>


    );
}

export default CartItem;
