import Router from 'express';
import {dirname} from 'path';
import {fileURLToPath} from 'url';
import BrandsController from "../../controllers/brands-controller.js";

const uploadBrandsRouter = new Router();

const __dirname = dirname(fileURLToPath(import.meta.url));

uploadBrandsRouter.post('/', async (req, res) => {
    try {
        const {brandsFile} = req.files;
        const {db_code} = req.query;

        const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

        if (!db_code) {
            return res.send('Нет кода базы данных!');
        }

        // const {token} = await ClientService.getClientToken(db_code);
        //
        // if (authToken !== token) {
        //     return res.send('ACCESS DENIED');
        // }


        const brandsData = brandsFile.data.toString('utf-8');
        const brands = JSON.parse(brandsData);

        const result = await BrandsController.create(db_code, brands);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.send('Ошибка! Загрузка данных не удалась!');
    }
});


export default uploadBrandsRouter;
