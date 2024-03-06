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
						art: product.art,
						active: product.active,
						sizeId: product.sizeId,
						sizeName: product.sizeName,
						categoryId: product.categoryId,
						brandId: product.brandId
					},
				});
			}
		} catch (error) {
			console.log('Ошибка добавления', error);
		}
	}

async getAll(req, res) {
    let { 
        categoryId, 
        searchQuery, 
        sort, 
        brandIds = [], 
        minPrice, 
        maxPrice, 
        limit // Добавляем параметр limit
    } = req.query;

    const token = req.headers[process.env.HEADER_TOKEN_NAME];
    const accessToken = process.env.ACCESS_TOKEN;

    if (token !== accessToken) {
        return res.send('ACCESS DENIED');
    }

    // Строим объект where на основе критериев фильтрации
    const where = categoryId ? { categoryId } : {};

    if (searchQuery) {
        where.OR = [
            {
                name: {
                    contains: searchQuery,
                    mode: 'insensitive',
                },
            },
        ];
    }

    if (brandIds.length > 0) {
        const brandConditions = brandIds.map((brandId) => ({
            brand: {
                id: brandId,
            },
            category: {
                id: categoryId,
            },
        }));

        if (!where.OR) {
            where.OR = [];
        }

        where.OR = where.OR.concat(brandConditions);
    }

    if (minPrice && maxPrice) {
        where.price = {
            gte: parseInt(minPrice),
            lte: parseInt(maxPrice),
        };
    }

    // Создаем объект опций для запроса к базе данных
    const dbOptions = {
        where,
        select: {
            productId: true,
            name: true,
            price: true,
            opt_price: true,
            active: true,
            art: true,
            category: true,
            brand: true,
        },
        orderBy: {
            price: sort === 'minPrice' ? 'asc' : 'desc',
        },
    };

    // Если параметр limit задан, преобразуем его в число и применяем
    if (limit) {
        dbOptions.take = parseInt(limit);
    }

    // Получаем товары с учетом пагинации и/или лимита
    const products = await prisma.product.findMany(dbOptions);

    // Получаем общее количество товаров без учета пагинации
    const totalCount = await prisma.product.count({where});
    const countOnPage = products.length;

    res.json({ countOnPage, totalCount, products });
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
				barcode: true,
				sizeId: true,
				sizeName: true,
				brand: true
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
