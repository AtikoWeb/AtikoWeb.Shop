import {v4} from 'uuid';
import ClientService from "../services/client-service.js";


class ProductController {
    async create(db_code, products) {

        const client = await ClientService.getClient(db_code);

        await client.product.deleteMany();

        try {
            for (const product of products) {
                const id = v4();
                const art = product.vendor.toUpperCase();

                let brandId = product.brandId;

                if (brandId && brandId.length > 0) {
                    const brandExists = await client.brand.findFirst({
                    where: { id: brandId }
                });

                if (!brandExists) {
                    brandId = null;
                }

                } else {
                    brandId = null;
                }


                await client.product.create({
                    data: {
                        id: id,
                        productId: product.productId,
                        name: product.name,
                        price: product.price,
                        desc: product.desc,
                        opt_price: product.opt_price,
                        barcode: product.barcode,
                        art: art,
                        active: product.active,
                        sizeId: product.sizeId,
                        sizeName: product.sizeName,
                        categoryId: product.categoryId,
                        subCategoryId: product.subCategoryId,
                        brandId: brandId
                    },
                });
            }
            return 'Процесс добавления завершен успешно';
        } catch (error) {
            console.log('Ошибка добавления', error);
        }
    }

   async getAll(req, res) {
        let {
            categoryId,
            db_code,
            searchQuery,
            sort = '',
            brandIds = [],
            minPrice,
            maxPrice,
            page,
            limit // Добавляем параметр limit
        } = req.query;

        const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

        if (!db_code) {
            return res.send('Нет кода базы данных!');
        }

        const client = await ClientService.getClient(db_code);

        try {
            // Строим объект where на основе критериев фильтрации
            const where = {};

            if (categoryId) {
                where.categoryId = categoryId;
            }

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
                    id: true,
                    productId: true,
                    name: true,
                    rating: true,
                    price: true,
                    opt_price: true,
                    active: true,
                    art: true,
                    category: true,
                    brand: true,
                },
                distinct: ['productId', 'name', 'price', 'desc'],

            };

        
            if (sort === '') {
                dbOptions.orderBy = {
                    name: 'asc', 
                };
            } else {
                // Иначе, сортируем товары в соответствии с параметром sort
                dbOptions.orderBy = {
                    price: sort === 'minPrice' ? 'asc' : 'maxPrice' && 'desc',
                };
            }

    
             // Если параметры page и limit заданы, применяем их
        if (limit) {
            dbOptions.take = parseInt(limit);
            if (page) {
                const skip = (parseInt(page) - 1) * parseInt(limit);
                dbOptions.skip = skip;
            }
        }

            // Получаем товары с учетом пагинации и/или лимита
            const products = await client.product.findMany(dbOptions);

            // Получаем общее количество товаров без учета пагинации
           const totalProducts = await client.product.findMany({
             where,
                select: {
                    id: true,
                    productId: true,
                    name: true,
                    rating: true,
                    price: true,
                    opt_price: true,
                    active: true,
                    art: true,
                    category: true,
                    brand: true,
                },
                 distinct: ['productId', 'name', 'price', 'desc'],
           });

           const totalCount = totalProducts.length;
           const countOnPage = products.length;

            res.json({totalCount, countOnPage, products});
        } catch (error) {
            res.send('Что-то пошло не так');
            console.log('Ошибка получения', error);
        } finally {
            if (client) {
                await client.$disconnect();
            }
        }
    }

    async getOne(req, res) {
        let product;
        const productId = req.params.id;
        const {db_code} = req.query;

        try {

            const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

            if (!db_code) {
                return res.send('Нет кода базы данных!');
            }

            const client = await ClientService.getClient(db_code);

            product = await client.product.findFirst({
                where: {
                    productId,
                },
                select: {
                    id: true,
                    productId: true,
                    name: true,
                    price: true,
                    desc: true,
                    rating: true,
                    art: true,
                    category: true,
                    brand: true
                },
            });

            const sizes = await client.product.findMany({
                where: {
                    productId: req.params.id,
                    NOT: {sizeId: ""} // Исключаем записи, где sizeId равно ""
                },
                select: {
                    sizeId: true,
                    sizeName: true,
                    barcode: true,
                },
                distinct: ['sizeId', 'sizeName', 'barcode'],
            });

            const reviews = await client.review.findMany({
                where: {
                    productId: product.id,
                    active: true,
                },
            });


            res.json({product, sizes, reviewsLength: reviews.length});

        } catch (error) {
            res.send('Что-то пошло не так');
            console.log('Ошибка получения', error);
        }
    }

    async createReview(req, res) {
        const {productId, userId, rating, content} = req.body;
        const {db_code} = req.query;
        const reviewId = v4();

        const client = await ClientService.getClient(db_code);

        try {
            await client.review.create({
                data: {
                    id: reviewId,
                    productId,
                    userId,
                    rating,
                    content
                }
            });

            const product = await client.product.findFirst({
                where: {
                    id: productId
                },
                select: {
                    rating: true,
                    Review: {
                        select: {
                            rating: true
                        }
                    }
                }
            });

            res.json({message: 'Отзыв успешно добавлен'});
        } catch (error) {
            res.status(500).json({error: 'Произошла ошибка при добавлении отзыва'});
            console.log('Ошибка добавления отзыва', error);
        } finally {
            await client.$disconnect();
        }
    }

    async getReviews(req, res) {
        const {db_code, productId, sort} = req.query;

        try {
            if (!db_code) {
                return res.send('Нет кода базы данных!');
            }

            const client = await ClientService.getClient(db_code);

            const reviews = await client.review.findMany({
                where: {
                    productId: productId,
                    active: true,
                },
                orderBy: {
                    rating: sort === 'min' ? 'asc' : 'desc',
                },
                include: {
                    user: {
                        select: {
                            username: true
                        }
                    }
                }
            });

            const productRating = await client.product.findFirst({
                where: {
                    id: productId,
                },
                select: {
                    rating: true
                }
            })

            if (!reviews) {
                return res.status(404).json({error: 'Товар не найден'});
            }

            res.json({productRating: productRating?.rating, reviews});
        } catch (error) {
            res.status(500).json({error: 'Произошла ошибка при получении информации о товаре и отзывов'});
            console.log('Ошибка получения информации о товаре и отзывов', error);
        }
    }

    async deleteReview(req, res) {
        const {db_code, id, productId} = req.query;

        try {
            if (!db_code) {
                return res.send('Нет кода базы данных!');
            }

            const client = await ClientService.getClient(db_code);

            await client.review.delete({
                where: {
                    id
                },
            });

            
            const reviews = await client.review.findMany({
                where: {
                    productId: productId,
                },
            });

            //Вычисляем новый рейтинг товара
            let newRating = 0;
            if (reviews.length > 0) {
                const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
                newRating = totalRating / reviews.length;
            }

            // Обновляем рейтинг товара в базе данных
            await client.product.update({
                where: {
                    id: productId
                },
                data: {
                    rating: newRating
                }
            });
            
            

            res.json('Отзыв успешно удален!');
        } catch (error) {
            res.status(500).json({error: 'Произошла ошибка при получении информации о товаре и отзывов'});
            console.log('Ошибка получения информации о товаре и отзывов', error);
        }
    }

    async updateReview(req, res) {
        const {db_code, id, productId} = req.query;
        const {active} = req.body;

        try {
            if (!db_code) {
                return res.send('Нет кода базы данных!');
            }

            const client = await ClientService.getClient(db_code);

            await client.review.update({
                where: {
                    id
                },
                data: {
                    active
                }
            });

            const reviews = await client.review.findMany({
                where: {
                    productId: productId,
                    active: true
                },
            });

            //Вычисляем новый рейтинг товара
            let newRating = 0;
            if (reviews.length > 0) {
                const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
                newRating = totalRating / reviews.length;
            }

            console.log(newRating);

            // Обновляем рейтинг товара в базе данных
            await client.product.update({
                where: {
                    id: productId
                },
                data: {
                    rating: newRating
                }
            });

            res.json('Успешное обновление!');
        } catch (error) {
            res.status(500).json({error: 'Произошла ошибка при получении информации о товаре и отзывов'});
            console.log('Ошибка получения информации о товаре и отзывов', error);
        }
    }

}


export default new ProductController();
