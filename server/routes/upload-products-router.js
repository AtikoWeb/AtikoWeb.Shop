import Router from 'express';
const uploadProductsRouter = new Router();
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import ProductController from '../controllers/product-controller.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const accessToken = process.env.ACCESS_TOKEN;

uploadProductsRouter.post('/', async (req, res) => {
	try {
		const { productFile } = req.files;
		const token = req.headers[process.env.HEADER_TOKEN_NAME];
		if (accessToken != token) {
			return res.send('ACCESS DENIED');
		}

		const productName = 'product.json';
		await productFile.mv(path.resolve(__dirname, '..', 'data', productName));

		await ProductController.create();

		res.send('Загрузка данных прошла успешно!');
	} catch (error) {
		console.log(error);
		res.send('Ошибка! Загрузка данных не удалась!');
	}
});

export default uploadProductsRouter;
