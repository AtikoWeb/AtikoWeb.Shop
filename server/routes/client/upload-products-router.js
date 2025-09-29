import Router from 'express';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import ProductController from '../../controllers/product-controller.js';
import fs from 'fs';

const uploadProductsRouter = new Router();

const __dirname = dirname(fileURLToPath(import.meta.url));

uploadProductsRouter.post('/', async (req, res) => {
    const {db_code} = req.query;

    try {
        const {productFile} = req.files;

        const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

        if (!db_code) {
            return res.send('Нет кода базы данных!');
        }

        // const {token} = await ClientService.getClientToken(db_code);
        //
        // if (authToken !== token) {
        //     return res.send('ACCESS DENIED');
        // }


        const productData = productFile.data.toString('utf-8');
        const products = JSON.parse(productData);

        const result = await ProductController.create(db_code, products);

        fs.writeFileSync('products.json', JSON.stringify(products, null, 2));

        res.send(result);
        console.log(`Отправка данных для клиента ${db_code} выполнена`);
    } catch (error) {
        res.send(`Ошибка! Загрузка данных для клиента ${db_code} не удалась!`);
        console.log(error);
    }
});

export default uploadProductsRouter;
