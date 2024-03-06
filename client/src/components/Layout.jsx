import React from 'react';
import {useLocation} from 'react-router-dom';

const Layout = ({children, backgroundColor = 'bg-white'}) => {
    const location = useLocation();

    const isSettings = location.pathname.includes('/settings');
    const isCart = location.pathname.includes('/cart');
    const isFileUpload = location.pathname.includes('/upload-image');
    const isDetailView = location.pathname.includes('/detailview');

    return (
        <div
            className={`flex flex-col relative h-screen min-h-screen xl:mr-0 lg:pb-10 ${backgroundColor} w-full rounded-3xl lg:overflow-y-scroll ${
                isSettings || isFileUpload || isDetailView ? 'xl:w-screen' : 'xl:w-1/2'
            }`}
        >
            {children}
            <div className={`p-8 lg:hidden ${isCart && 'hidden'} bg-white w-full`}>
                <div className='text-center'>
                    <a
                        href='https://atikoweb.kz'
                        target='_blank'
                    >
						<span className='text-lg font-bold text-neutral-400'>
							Работает на AtikoWeb
						</span>
                    </a>
                </div>
            </div>


        </div>
    );
};

export default Layout;
