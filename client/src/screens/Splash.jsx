import React from 'react';

function Splash() {
	return (
		<div className='grid place-content-center place-items-center mt-52'>
			<img
				src='/atikoweb_logo.png'
				alt='logo'
				style={{ height: '12rem' }}
			/>

			<div className='absolute bottom-5 right-0 left-0 text-center'>
				<span className='text-xl font-semibold'>Powered by AtikoWeb</span>
			</div>
		</div>
	);
}

export default Splash;
