import fs from 'fs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class BrandsController {
	async create() {
		try {
			await prisma.brand.deleteMany();

			const data = await fs.promises.readFile('./data/brands.json');
			const brands = JSON.parse(data.toString().replace(/^\uFEFF/, ''));

			for (const brand of brands) {
				await prisma.brand.create({
					data: {
						id: brand.id,
						name: brand.name,
					},
				});
			}
		} catch (error) {
			console.log('Ошибка добавления', error);
		}
	}

	async getAll(req, res) {
		let { id } = req.query;
		let brands;
		const accessToken = process.env.ACCESS_TOKEN;
		const token = req.headers[process.env.HEADER_TOKEN_NAME];

		if (token != accessToken) {
			return res.send('ACCESS DENIED');
		}
		if (!id) {
			brands = await prisma.brand.findMany();
		}

		if (id) {
			brands = await prisma.brand.findMany({
				where: {
					id,
				},
			});
		}

		res.json({ brands });
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

export default new BrandsController();
