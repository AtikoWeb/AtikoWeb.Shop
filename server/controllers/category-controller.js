import fs from 'fs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class CategoryController {
	async create() {
		try {
			await prisma.category.deleteMany();

			const data = await fs.promises.readFile('./data/category.json');
			const categories = JSON.parse(data.toString().replace(/^\uFEFF/, ''));

			for (const category of categories) {
				await prisma.category.create({
					data: {
						id: category.id,
						name: category.name,
					},
				});
			}
		} catch (error) {
			console.log('Ошибка добавления', error);
		}
	}

	async getAll(req, res) {
		let { id } = req.query;
		let category;
		const accessToken = process.env.ACCESS_TOKEN;
		const token = req.headers[process.env.HEADER_TOKEN_NAME];

		if (token != accessToken) {
			return res.send('ACCESS DENIED');
		}
		if (!id) {
			category = await prisma.category.findMany();
		}

		if (id) {
			category = await prisma.category.findMany({
				where: {
					id,
				},
			});
		}

		res.json({ category });
	}

	async getOne(req, res) {
		const token = req.headers[process.env.HEADER_TOKEN_NAME];
		const accessToken = process.env.ACCESS_TOKEN;

		if (token != accessToken) {
			return res.send('ACCESS DENIED');
		}

		const category = await prisma.category.findFirst({
			where: {
				id: req.params.id,
			},
		});
		res.json(category);
	}
}

export default new CategoryController();
