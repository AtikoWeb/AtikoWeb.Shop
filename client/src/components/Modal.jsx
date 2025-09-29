import React from 'react';
import {Modal, ModalBody, ModalContent,} from '@nextui-org/react';
import {IoCloseSharp} from 'react-icons/io5';

function ModalWindow({
                         isOpen,
                         children,
                         closeButtonColor = 'bg-white',
                         scrollBehavior = 'outside',
                         size = '4xl',
                         onClose,
                         isStories
                     }) {

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
        <Modal
            size={size}
            hideCloseButton={true}
            isOpen={isOpen}
            scrollBehavior={scrollBehavior}
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn",
                        },
                    },
                }
            }}
            className={`overflow-x-hidden m-0 overflow-y-scroll ${isStories && isMobile ? 'bg-black/50' : isStories && !isMobile && 'bg-inherit'}`}
        >
            <ModalContent className={'m-0'}>
                <>
                    <ModalBody>
                        {onClose && (
                            <>
                                <div
                                    className={`absolute ${isStories && isMobile ? 'top-[40px] z-[50]' : ''} cursor-pointer right-1.5 top-2 ${closeButtonColor} overflow-y-scroll backdrop-blur-md p-2 shadow-2xl rounded-full`}
                                    onClick={onClose}
                                >
                                    <IoCloseSharp className='text-2xl'/>
                                </div>
                            </>
                        )}
                        {children}
                    </ModalBody>

                </>
            </ModalContent>

        </Modal>
    );
}

export default ModalWindow;
