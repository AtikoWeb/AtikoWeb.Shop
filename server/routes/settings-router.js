import Router from 'express';
const settingsRouter = new Router();
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

settingsRouter.post('/', async (req, res) => {
	try {
		const { mainColor, shopName, columnCount, isInteresting } = req.body;

		await prisma.config.deleteMany();

		await prisma.config.create({
			data: {
				main_color: mainColor,
				column_count: columnCount,
				isInteresting: isInteresting,
				shop_name: shopName
			},
		});

		res.send('Загрузка данных прошла успешно!');
	} catch (error) {
		console.log(error);
		res.send('Ошибка! Загрузка данных не удалась!');
	}
});

settingsRouter.get('/', async (req, res) => {
	try {
		const config = await prisma.config.findFirst();

		res.json({ config });
	} catch (error) {
		console.log(error);
		res.send('Ошибка! Получение не удалось!');
	}
});


export default settingsRouter;
