import ClientService from "../services/client-service.js";


class CategoryController {
    async create(db_code, categories) {
        const client = await ClientService.getClient(db_code);

        await client.category.deleteMany({
            where: {
                isInteresting: false
            }
        });

        try {
            for (const category of categories) {
                await client.category.create({
                    data: {
                        id: category.id,
                        name: category.name,
                        parentId: category.parentId
                    }
                });
            }
            await client.$disconnect();
            console.log('Процесс добавления завершен успешно');
            return 'Процесс добавления завершен успешно';
        } catch (error) {
            await client.$disconnect();
            console.log('Ошибка добавления', error);
        }
    }


    async getAll(req, res) {
        let {id} = req.query;
        let {db_code, limit, limitProducts = 10, sortProducts = '',
            minPrice = 0,
            maxPrice = 999999, brandIds = []} = req.query;

        const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

        try {

            if (!db_code) {
                return res.send('Нет кода базы данных!');
            }

            const client = await ClientService.getClient(db_code);

            let category;

              const where = {
                 isInteresting: false,
              };

            if (id) {
                where.id = id;
            } else {
                 where.parentId = null;
            }

            // Создаем объект опций для запроса к базе данных
            const dbOptions = {
                where,
                orderBy: {
                    name: 'asc'
                },
               include: {
    children: {
        select: {
            id: true,
            name: true,
            children: {
                select: {
                    id: true,
                    name: true,
                    children: {
                        select: {
                            id: true,
                            name: true,
                            product: {
                                where: {
                                    price: {
                                        gte: parseInt(minPrice),
                                        lte: parseInt(maxPrice),
                                    },
                                },
                                take: parseInt(limitProducts),
                                orderBy: {
                                    price: sortProducts === 'minPrice' ? 'asc' : 'desc',
                                },
                                 distinct: ['productId', 'name', 'price', 'desc'],
                            },
                        },
                    },
                    product: {
                        where: {
                            price: {
                                gte: parseInt(minPrice),
                                lte: parseInt(maxPrice),
                            },
                        },
                        take: parseInt(limitProducts),
                        orderBy: {
                            price: sortProducts === 'minPrice' ? 'asc' : 'desc',
                        },
                         distinct: ['productId', 'name', 'price', 'desc'],
                    },
                },
            },
            product: {
                where: {
                    price: {
                        gte: parseInt(minPrice),
                        lte: parseInt(maxPrice),
                    },
                },
                take: parseInt(limitProducts),
                orderBy: {
                    price: sortProducts === 'minPrice' ? 'asc' : 'desc',
                },
                 distinct: ['productId', 'name', 'price', 'desc'],
            },
        },
    },
},
            };


        if (brandIds.length > 0) {
            dbOptions.include.children.select.product.where.brand = {
                id: {
                    in: brandIds
                }
            };
        };

            if (limit) {
                dbOptions.take = parseInt(limit);
            }

            category = await client.category.findMany(dbOptions);

            res.json({category});
        } catch (error) {
            res.send('Что-то пошло не так');
            console.log('Ошибка при получении', error);
        }
    }
}

export default new CategoryController();
