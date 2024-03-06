import React, {useEffect, useState} from 'react';
import {decrementItem, incrementItem, removeFromCart,} from '../../redux/slices/cartSlice';
import {useDispatch} from 'react-redux';
import {BottomSheet} from 'react-spring-bottom-sheet';
import ModalWindow from './Modal';
import {Button} from '@nextui-org/react';

function CartItem({item}) {
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
            <div className='mb-5 justify-between pt-6 bg-neutral-50 p-3 rounded-lg'>
                <div className='flex justify-between mb-3 items-center'>
                    <div className='flex gap-2'>
                        <img
                            src={item?.image}
                            className='h-16 w-20 rounded-lg'
                            onError={(e) => {
                                e.target.src = '/not_img.jpg';
                            }}
                        />
                        <div className='grid place-content-center'>
							<span className='font-bold md:text-sm md:w-32 text-lg w-40'>
								{item?.name}
							</span>
                        </div>
                    </div>
                    <div className='flex gap-5'>
                        <button
                            onClick={item?.qty > 1 ? decrement : () => setIsOpen(true)}
                            className={`normal-case text-xl disabled:bg-gray-100 flex-1`}
                        >
                            -
                        </button>
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
                </div>
                <span className={`text-md ${!item.size && 'hidden'}`}>
					Размер: {item?.size?.sizeName}
				</span>
            </div>

            {isMobile ? (
                <BottomSheet
                    open={isOpen}
                    onDismiss={() => setIsOpen(false)}
                    defaultSnap={({maxHeight}) => maxHeight / 1.7}
                    snapPoints={({maxHeight}) => [
                        maxHeight - maxHeight / 1.7,
                        maxHeight - maxHeight / 1.7,
                    ]}
                    draggable={true}
                >
                    <div className='mx-3 mt-3 mb-5'>
                        <div className='grid mb-5'>
							<span className='text-xl font-bold'>
								Удалить товар {item?.name} ?
							</span>
                            <span className={`text-md ${!item?.size && 'hidden'}`}>
								Размер: {item?.size?.sizeName}
							</span>
                        </div>

                        <div className='grid gap-3'>
                            <div className='w-full bg-white/[.8] flex'>
                                <Button
                                    size='lg'
                                    color='primary'
                                    onClick={remove}
                                    className='font-bold flex-1 normal-case text-lg'
                                >
                                    Удалить
                                </Button>
                            </div>
                            <div className='w-full bg-white/[.8] flex'>
                                <Button
                                    size='lg'
                                    color={"primary"}
                                    variant={"flat"}
                                    onClick={() => setIsOpen(false)}
                                    className='font-bold flex-1 normal-case text-lg'
                                >
                                    Отмена
                                </Button>
                            </div>
                        </div>
                    </div>
                </BottomSheet>
            ) : (
                <ModalWindow
                    isOpen={isOpen}
                    size='xl'
                    onClose={() => setIsOpen(false)}
                    children={
                        <div className='mx-3 mt-3 mb-5'>
                            <div className='grid mb-5'>
								<span className='text-xl font-bold'>
									Удалить товар {item?.name} ?
								</span>
                                <span className={`text-md ${!item.size && 'hidden'}`}>
									Размер: {item?.size?.sizeName}
								</span>
                            </div>

                            <div className='grid gap-3'>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Button
                                        size='lg'
                                        color='primary'
                                        onClick={remove}
                                        className='font-bold flex-1 normal-case text-lg'
                                    >
                                        Удалить
                                    </Button>
                                </div>
                                <div className='w-full bg-white/[.8] flex'>
                                    <Button
                                        size='lg'
                                        color={"primary"}
                                        variant={"flat"}
                                        onClick={() => setIsOpen(false)}
                                        className='font-bold flex-1 normal-case text-lg'
                                    >
                                        Отмена
                                    </Button>
                                </div>
                            </div>
                        </div>
                    }
                />
            )}
        </>
    );
}

export default CartItem;
