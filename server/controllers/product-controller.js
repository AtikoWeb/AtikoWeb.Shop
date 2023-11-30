import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { v4 } from 'uuid';

const prisma = new PrismaClient();

class ProductController {
	async create() {
		try {
			await prisma.product.deleteMany();

			const data = await fs.promises.readFile('./data/product.json', 'utf-8');
			const products = JSON.parse(data.toString().replace(/^\uFEFF/, ''));

			for (const product of products) {
				const id = v4();
				await prisma.product.create({
					data: {
						id: id,
						productId: product.productId,
						name: product.name,
						price: product.price,
						desc: product.desc,
						opt_price: product.opt_price,
						barcode: product.barcode,
						art: product.vendor,
						active: product.active,
						sizeId: product.sizeId,
						sizeName: product.sizeName,
						categoryId: product.categoryId,
					},
				});
			}
		} catch (error) {
			console.log('Ошибка добавления', error);
		}
	}

	async getAll(req, res) {
		let { categoryId, page, limit } = req.query;
		const token = req.headers[process.env.HEADER_TOKEN_NAME];
		const accessToken = process.env.ACCESS_TOKEN;

		if (token != accessToken) {
			return res.send('ACCESS DENIED');
		}

		page = page || 1;
		limit = limit || 9;
		let offset = page * limit - limit;
		let products;
		const count = await prisma.product.count({
			skip: parseInt(offset),
			take: parseInt(limit),
			where: { categoryId, active: true },
		});

		if (!categoryId) {
			products = await prisma.product.findMany({
				where: { active: true },
				select: {
					productId: true,
					name: true,
					price: true,
					opt_price: true,
					active: true,
					art: true,
					category: true,
				},

				orderBy: {
					productId: 'asc',
				},
				distinct: ['productId', 'name', 'price', 'desc'],
				skip: parseInt(offset),
				take: parseInt(limit),
			});
		}

		if (categoryId) {
			products = await prisma.product.findMany({
				where: { categoryId, active: true },
				select: {
					productId: true,
					name: true,
					price: true,
					opt_price: true,
					active: true,
					art: true,
					category: true,
				},
				orderBy: {
					productId: 'asc',
				},
				distinct: ['productId', 'name', 'price', 'desc', 'categoryId'],
				skip: parseInt(offset),
				take: parseInt(limit),
			});
		}

		res.json({ count, products });
	}

	async getOne(req, res) {
		let product;
		const productId = req.params.id;

		const token = req.headers[process.env.HEADER_TOKEN_NAME];
		const accessToken = process.env.ACCESS_TOKEN;

		if (token != accessToken) {
			return res.send('ACCESS DENIED');
		}

		product = await prisma.product.findFirst({
			where: {
				productId,
			},
			select: {
				productId: true,
				name: true,
				price: true,
				desc: true,
				art: true,
				category: true,
			},
		});

		const sizes = await prisma.product.findMany({
			where: {
				productId: req.params.id,
			},
			select: {
				sizeId: true,
				sizeName: true,
				barcode: true,
			},
		});

		res.json({ product, sizes });
	}
}

export default new ProductController();
