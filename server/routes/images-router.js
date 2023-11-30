import Router from 'express';
import path from 'path';
const imagesRouter = new Router();
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const IMAGES_DIR = path.join(__dirname, '..', 'images');

imagesRouter.get('/get-images', (req, res) => {
	try {
		const images = fs
			.readdirSync(IMAGES_DIR)
			.filter((filename) => {
				return (
					filename.endsWith('.png') ||
					filename.endsWith('.jpg') ||
					filename.endsWith('.jpeg')
				);
			})
			.map((filename) => {
				let match = filename.match(/^(.*)\.(png|jpg|jpeg)$/);
				if (!match) {
					return null;
				}
				let baseName = match[1];
				match = baseName.match(/^(.*?)(_([0-9]+))?$/);
				if (!match) {
					return null;
				}
				let prefix = match[1];
				let num = parseInt(match[3] || '0');
				return {
					name: filename,
					isMainImage: !num,
					prefix: prefix,
					num: num,
				};
			})
			.filter((image) => {
				return image !== null;
			})
			.sort((a, b) => {
				if (a.isMainImage) {
					return -1; // главное изображение всегда первое
				} else if (b.isMainImage) {
					return 1;
				} else if (a.prefix === b.prefix) {
					return a.num - b.num; // если префиксы равны, сортируем по номеру
				} else {
					return a.name.localeCompare(b.name); // иначе сортируем по имени
				}
			})
			.map((image) => {
				return {
					name: image.name,
				};
			});

		res.json(images);
	} catch (error) {
		console.error(error);
		res.send('Ошибка получения изображений');
	}
});

imagesRouter.delete('/delete-image', async (req, res) => {
	try {
		const { name } = req.body;

		const imagePath = path.join(IMAGES_DIR, name);
		await fs.promises.unlink(imagePath);

		res.send('Изображение успешно удалено');
	} catch (error) {
		console.log(error);
		res.send('Ошибка удаления изображения');
	}
});

imagesRouter.delete('/delete-images', async (req, res) => {
	try {
		const images = fs.readdirSync(IMAGES_DIR);
		for (const image of images) {
			await fs.promises.unlink(`${IMAGES_DIR}/${image}`);
		}
		res.send('Изображения успешно удалены');
	} catch (error) {
		console.log(error);
		res.send('Ошибка удаления изображений');
	}
});

export default imagesRouter;
