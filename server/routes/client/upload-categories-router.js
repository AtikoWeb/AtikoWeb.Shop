import Router from 'express';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import CategoryController from '../../controllers/category-controller.js';

const uploadCategoriesRouter = new Router();

const __dirname = dirname(fileURLToPath(import.meta.url));

uploadCategoriesRouter.post('/', async (req, res) => {
    try {
        const {categoryFile} = req.files;
        const {db_code} = req.query;

        // const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

        if (!db_code) {
            return res.send('Нет кода базы данных!');
        }

        // const {token} = await ClientService.getClientToken(db_code);
        //
        // if (authToken !== token) {
        //     return res.send('ACCESS DENIED');
        // }

        const categoryData = categoryFile.data.toString('utf-8');
        const categories = JSON.parse(categoryData);

        const result = await CategoryController.create(db_code, categories);
        res.send(result);
        console.log('Отправка данных выполнена');

    } catch (error) {
        console.log(error);
        res.send('Ошибка! Загрузка данных не удалась!');
    }
});


export default uploadCategoriesRouter;
