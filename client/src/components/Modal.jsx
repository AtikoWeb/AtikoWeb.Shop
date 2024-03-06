import React from 'react';
import {Modal, ModalBody, ModalContent,} from '@nextui-org/react';
import {IoCloseSharp} from 'react-icons/io5';

function ModalWindow({isOpen, children, scrollBehavior = 'outside', size = '4xl', onClose, isStories}) {

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    return (
        <Modal
            size={size}
            isOpen={isOpen}
            scrollBehavior={scrollBehavior}
            className={`overflow-x-hidden ${isStories && isMobile ? 'bg-black/50' : isStories && !isMobile && 'bg-inherit'}`}
        >
            <ModalContent className={''}>
                <>
                    <ModalBody>
                        <div
                            className={`absolute ${isStories && isMobile ? 'top-[30px] z-[1]' : ''} cursor-pointer right-1.5 top-2 bg-white/[.8] backdrop-blur-md p-2 shadow-2xl rounded-full`}
                            onClick={onClose}
                        >
                            <IoCloseSharp className='text-2xl'/>
                        </div>
                        {children}
                    </ModalBody>
                </>
            </ModalContent>
        </Modal>
    );
}

export default ModalWindow;
