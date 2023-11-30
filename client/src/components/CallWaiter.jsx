import React from 'react';

function CallWaiter({ close }) {
	return (
		<div className='mx-3 mt-3'>
			<div className='flex justify-between mb-5'>
				<span className='text-2xl font-bold'>Вызвать официанта ?</span>
			</div>

			<div className='grid gap-3'>
				<div className='w-full bg-white/[.8] flex'>
					<button className='btn btn-primary font-bold flex-1 normal-case text-lg'>
						Вызвать
					</button>
				</div>
				<div className='w-full bg-white/[.8] flex'>
					<button
						onClick={close}
						className='btn btn-outline font-bold flex-1 normal-case text-lg'
					>
						Отмена
					</button>
				</div>
			</div>
		</div>
	);
}

export default CallWaiter;
