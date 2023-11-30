import React from 'react';
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
} from '@nextui-org/react';
import { IoCloseSharp } from 'react-icons/io5';

function ModalWindow({ isOpen, children, size = '4xl', onClose }) {
	return (
		<Modal
			size={size}
			isOpen={isOpen}
		>
			<ModalContent>
				<>
					<ModalBody>
						<div
							className='absolute cursor-pointer right-1.5 top-2 bg-white/[.8] backdrop-blur-md p-2 shadow-2xl rounded-full'
							onClick={onClose}
						>
							<IoCloseSharp className='text-2xl' />
						</div>
						{children}
					</ModalBody>
				</>
			</ModalContent>
		</Modal>
	);
}

export default ModalWindow;
