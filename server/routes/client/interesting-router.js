import Router from 'express';
import {PrismaClient} from '@prisma/client';
import fs from 'fs';
import ClientService from "../../services/client-service.js";
import path, {dirname} from "path";
import {fileURLToPath} from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const interestingRouter = new Router();

const getImagesDir = (db_code) => {
    return path.join(__dirname, '..', '..', 'clients', db_code, 'images');
}

const prisma = new PrismaClient();
const accessToken = process.env.ACCESS_TOKEN;

interestingRouter.post('/create', async (req, res) => {
    try {
        const {name, id} = req.body;
        let images = req.files.images;

        const {db_code} = req.query;

        const lowerCase_db_code = db_code.toString().toLowerCase();

        const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

        if (!db_code) {
            return res.send('Нет кода базы данных!');
        }

        // const {token} = await ClientService.getClientToken(db_code);
        //
        // if (authToken !== token) {
        //     return res.send('ACCESS DENIED');
        // }

        if (!Array.isArray(images)) {
            images = [images];
        }

        const client = await ClientService.getClient(db_code);

        await client.category.create({
            data: {
                id,
                name,
                isInteresting: true,
            }
        })

        images.forEach((image) => {
            let fileName = `interesting_${id}_MAIN_${image.name}`;
            image.mv(`${getImagesDir(lowerCase_db_code)}/${fileName}`, (err) => {
                if (err) return res.status(500).send(err);
            });
        });

        res.send('Загрузка данных прошла успешно!')
    } catch (error) {
        console.log(error);
        res.send('Ошибка! Загрузка данных не удалась!');
    }
});

interestingRouter.get('/get-all', async (req, res) => {
    try {
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

        const client = await ClientService.getClient(db_code);

        const interesting = await client.category.findMany({
            where: {
                isInteresting: true
            }
        })

        res.json(interesting)
    } catch (error) {
        console.log(error);
        res.send('Ошибка! Загрузка данных не удалась!');
    }
});

interestingRouter.delete('/delete-one', async (req, res) => {
    try {
        const {id} = req.query;

        const {db_code} = req.query;
        const lowerCase_db_code = db_code.toString().toLowerCase();

        const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

        if (!db_code) {
            return res.send('Нет кода базы данных!');
        }

        // const {token} = await ClientService.getClientToken(db_code);
        //
        // if (authToken !== token) {
        //     return res.send('ACCESS DENIED');
        // }

        const client = await ClientService.getClient(db_code);

        const imageFileName = `interesting_${id}_*.*`;

        // Используем шаблонные строки и регулярное выражение для поиска файлов
        const filesToDelete = fs.readdirSync(`${getImagesDir(lowerCase_db_code)}`).filter((file) => {
            return new RegExp(imageFileName).test(file);
        });

        filesToDelete.forEach((file) => {
            fs.unlinkSync(`${getImagesDir(lowerCase_db_code)}/${file}`);
        });

        await client.category.delete({
            where: {
                id,

            }
        })

        res.send('Успешное удаление!')
    } catch (error) {
        console.log(error);
        res.send('Ошибка! Удаление не удалось!');
    }
});

interestingRouter.delete('/delete-all', async (req, res) => {
    try {

        const {db_code} = req.query;
        const lowerCase_db_code = db_code.toString().toLowerCase();

        const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

        if (!db_code) {
            return res.send('Нет кода базы данных!');
        }

        // const {token} = await ClientService.getClientToken(db_code);
        //
        // if (authToken !== token) {
        //     return res.send('ACCESS DENIED');
        // }

        const client = await ClientService.getClient(db_code);
        // Получаем все интересные элементы
        const interestingElements = await client.category.findMany({
            where: {
                isInteresting: true,
            },
            select: {
                id: true,
            },
        });

        // Удаляем соответствующие файлы изображений
        for (const element of interestingElements) {
            const id = element.id;
            const imageFileName = `interesting_${id}_*.*`;

            // Используем шаблонные строки и регулярное выражение для поиска файлов
            const filesToDelete = fs.readdirSync(getImagesDir(lowerCase_db_code)).filter((file) => {
                return new RegExp(imageFileName).test(file);
            });

            // Удаляем каждый файл
            filesToDelete.forEach((file) => {
                fs.unlinkSync(`${getImagesDir(lowerCase_db_code)}/${file}`);
            });
        }

        // Удаляем все интересные элементы из базы данных
        await client.category.deleteMany({
            where: {
                isInteresting: true,
            },
        });

        res.send('Успешное удаление!');
    } catch (error) {
        console.log(error);
        res.send('Ошибка! Удаление не удалось!');
    }
});

interestingRouter.post('/set-main', async (req, res) => {
    let images = req.files.images;
    const {id} = req.query;

    const {db_code} = req.query;
    const lowerCase_db_code = db_code.toString().toLowerCase();

    const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

    if (!db_code) {
        return res.send('Нет кода базы данных!');
    }

    // const {token} = await ClientService.getClientToken(db_code);
    //
    // if (authToken !== token) {
    //     return res.send('ACCESS DENIED');
    // }

    if (!Array.isArray(images)) {
        images = [images];
    }

    const client = await ClientService.getClient(db_code);

    const interesting = await client.category.findFirst({
        where: {id, isInteresting: true}
    });

    if (!id || id !== interesting.id) {
        return res.send('Interesting not found');
    }

    images.forEach((image) => {
        let fileName = `interesting_${id}_MAIN_${image.name}`;
        image.mv(`${getImagesDir(lowerCase_db_code)}/${fileName}`, (err) => {
            if (err) return res.status(500).send(err);
        });
    });


    res.send('Files uploaded!');
});

interestingRouter.put('/rename', async (req, res) => {
    try {
        const {id, name} = req.query;

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
        const client = await ClientService.getClient(db_code);

        await client.category.update({
            where: {
                id,
            },
            data: {
                name: name
            }
        })

        res.send('Успешное переименование!')
    } catch (error) {
        console.log(error);
        res.send('Ошибка! Переименование не удалось!');
    }
});


export default interestingRouter;
