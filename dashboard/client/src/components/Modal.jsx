import React from 'react';
import {Modal, ModalBody, ModalContent,} from '@nextui-org/react';
import {IoCloseSharp} from 'react-icons/io5';

function ModalWindow({isOpen, children, scrollBehavior = 'outside', size = '4xl', onClose}) {


    return (
        <Modal
            size={size}
            isOpen={isOpen}
            scrollBehavior={scrollBehavior}
            className={`overflow-x-hidden`}
        >
            <ModalContent className={''}>
                <>
                    <ModalBody>
                        <div
                            className={`absolute right-3 bg-white cursor-pointer rounded-full h-10 w-10 flex items-center justify-center`}
                            onClick={onClose}
                        >
                            <IoCloseSharp className='text-3xl'/>
                        </div>
                        {children}
                    </ModalBody>
                </>
            </ModalContent>
        </Modal>
    );
}

export default ModalWindow;
