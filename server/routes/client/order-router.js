import {Router} from 'express';
import fs from 'fs';
import {v4} from 'uuid'

const orderRouter = Router();

orderRouter.post('/create', async (req, res) => {
    try {
        const {order} = req.body;

        const {db_code} = req.query;

        const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

        if (!db_code) {
            return res.send('Нет кода базы данных!');
        }

        console.log(order);

        // Преобразуем в JSON
        const jsonData = JSON.stringify(order, null, 2);

        const fileName = `order_${v4().slice(0, 6)}.json`

        // Записываем в файл
        fs.writeFile(`./clients/${db_code}/orders/${fileName}`, jsonData, err => {
            if (err) {
                throw err;
            }
            console.log('Файл успешно создан');
        });

        res.status(200).send({order: fileName.slice(0, 12)});

    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: 'Ошибка при создании заказа'});
    }
});

orderRouter.get('/get', async (req, res) => {

    const {orderName} = req.query;

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

    if (!orderName) {
        return res.send('Отсуствует параметр orderName')
    }

    const path = `./clients/${db_code}/orders/${orderName}.json`

    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
            return res.send('The file doesnt exist yet, please try again later');
        } else {
            fs.readFile(path, (err, data) => {
                if (err) throw err;

                const jsonData = JSON.parse(data);
                res.json(jsonData);
            });
        }
    });

})


export default orderRouter;
