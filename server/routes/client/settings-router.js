import Router from 'express';
import ClientService from "../../services/client-service.js";

const settingsRouter = new Router();


settingsRouter.post('/', async (req, res) => {
    try {
        const {mainColor, shopName, columnCount, phone, desc, isInteresting} = req.body;
        const {db_code} = req.query;

        const client = await ClientService.getClient(db_code);

        await client.config.deleteMany();

        await client.config.create({
            data: {
                main_color: mainColor,
                column_count: columnCount,
                isInteresting: isInteresting,
                shop_name: shopName,
                phone,
                desc
            },
        });

        res.send('Загрузка данных прошла успешно!');
    } catch (error) {
        console.log(error);
        res.send('Ошибка! Загрузка данных не удалась!');
    }
});

settingsRouter.get('/', async (req, res) => {
    const {db_code} = req.query;

    const client = await ClientService.getClient(db_code);

    try {
        const config = await client.config.findFirst();

        res.json({config});
    } catch (error) {
        console.log(error);
        res.send('Ошибка! Получение не удалось!');
    }
});


export default settingsRouter;
