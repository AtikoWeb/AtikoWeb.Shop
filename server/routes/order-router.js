import { Router } from 'express';
import fs from 'fs';
import {v4} from 'uuid'

const orderRouter = Router();

orderRouter.post('/create', async (req, res) => {
    try {
        const { order } = req.body;

		console.log(order);

        // Преобразуем в JSON
        const jsonData = JSON.stringify(order, null, 2);

		const fileName = `order_${v4().slice(0,6)}.json`

        // Записываем в файл
        fs.writeFile(`orders/${fileName}`, jsonData, err => {
            if (err) {
                throw err;
            }
            console.log('Файл успешно создан');
        });

		res.status(200).send({order: fileName})

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Ошибка при создании заказа' });
    }
});

orderRouter.get('/get', async (req, res) => {

	const { orderName } = req.query;

	if (!orderName) {
		return res.send('Отсуствует параметр orderName')
	}

	const path = `./orders/${orderName}.json`

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
