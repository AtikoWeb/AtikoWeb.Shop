import Router from 'express';
const uploadCategoriesRouter = new Router();
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import CategoryController from '../controllers/category-controller.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const accessToken = process.env.ACCESS_TOKEN;

uploadCategoriesRouter.post('/', async (req, res) => {
	try {
		const { categoryFile } = req.files;
		const token = req.headers[process.env.HEADER_TOKEN_NAME];
		if (accessToken != token) {
			return res.send('ACCESS DENIED');
		}

		const categoryName = 'category.json';
		await categoryFile.mv(path.resolve(__dirname, '..', 'data', categoryName));

		await CategoryController.create();

		res.send('Загрузка данных прошла успешно!');
	} catch (error) {
		console.log(error);
		res.send('Ошибка! Загрузка данных не удалась!');
	}
});

export default uploadCategoriesRouter;
