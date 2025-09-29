import ClientService from "../services/client-service.js";

class BrandsController {
    async create(db_code, brands) {

        const client = await ClientService.getClient(db_code);

        try {
            await client.brand.deleteMany();

            for (const brand of brands) {
                await client.brand.create({
                    data: {
                        id: brand.id,
                        name: brand.name,
                    },
                });
            }
            return 'Процесс добавления завершен успешно';
        } catch (error) {
            console.log('Ошибка добавления', error);
        }
    }

    async getAll(req, res) {
        let {id, db_code} = req.query;
        const client = await ClientService.getClient(db_code);
        let brands;

        const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

        try {

            if (!db_code) {
                return res.send('Нет кода базы данных!');
            }

            if (!id) {
                brands = await client.brand.findMany();
            }

            if (id) {
                brands = await client.brand.findFirst({
                    where: {
                        id,
                    },
                });
            }

            res.json({brands});
        } catch (e) {
            res.send('Что-то пошло не так')
            console.log(e);

        }
    }

}

export default new BrandsController();
