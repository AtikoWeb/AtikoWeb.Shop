import Router from 'express';
const uploadBrandsRouter = new Router();
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import BrandsController from '../controllers/brands-controller.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const accessToken = process.env.ACCESS_TOKEN;

uploadBrandsRouter.post('/', async (req, res) => {
	try {
		const { brandsFile } = req.files;
		const token = req.headers[process.env.HEADER_TOKEN_NAME];
		if (accessToken != token) {
			return res.send('ACCESS DENIED');
		}

		const brandsName = 'brands.json';
		await brandsFile.mv(path.resolve(__dirname, '..', 'data', brandsName));

		await BrandsController.create();

		res.send('Загрузка данных прошла успешно!');
	} catch (error) {
		console.log(error);
		res.send('Ошибка! Загрузка данных не удалась!');
	}
});


export default uploadBrandsRouter;
