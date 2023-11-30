import Router from 'express';
const testRouter = new Router();

testRouter.get('/', async (req, res) => {
	try {
		const data = [
			{
				name: 'Виктор Степанов',
				price: 20000,
				isNow: 0,
				time: '10:53',
			},
		];
		res.json(data);
	} catch (error) {
		console.log(error);
		res.send('Ошибка! Получение не удалось!');
	}
});

export default testRouter;
