import React from 'react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
	const location = useLocation();

	const isSettings = location.pathname.includes('/settings');

	return (
		<div
			className={`flex flex-col h-screen min-h-screen bg-white w-full lg:bg-gray-100 lg:overflow-y-scroll ${
				isSettings && 'xl:w-1/1'
			} xl:w-1/2`}
		>
			{children}
			<div className='p-8 lg:hidden bg-white w-full'>
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
