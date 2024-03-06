import Router from 'express';
const interestingRouter = new Router();
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();
const accessToken = process.env.ACCESS_TOKEN;

interestingRouter.post('/create', async (req, res) => {
	try {
		const { name, id } = req.body;
        let images = req.files.images;

		const token = req.headers[process.env.HEADER_TOKEN_NAME];

		if (accessToken != token) {
			return res.send('ACCESS DENIED');
		}

        if (!Array.isArray(images)) {
		images = [images];
	    }

		await prisma.category.create({
            data: {
                id,
                name,
                isInteresting: true,
            }
        })

        images.forEach((image) => {
            let fileName = `interesting_${id}_MAIN_${image.name}`;
            image.mv(`./images/${fileName}`, (err) => {
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
		const token = req.headers[process.env.HEADER_TOKEN_NAME];

		if (accessToken != token) {
			return res.send('ACCESS DENIED');
		}

		const interesting = await prisma.category.findMany({
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
		const { id } = req.query;
		const token = req.headers[process.env.HEADER_TOKEN_NAME];

		if (accessToken != token) {
			return res.send('ACCESS DENIED');
		}
        
        const imageFileName = `interesting_${id}_*.*`;

        // Используем шаблонные строки и регулярное выражение для поиска файлов
        const filesToDelete = fs.readdirSync('./images').filter((file) => {
            return new RegExp(imageFileName).test(file);
        });

            filesToDelete.forEach((file) => {
                fs.unlinkSync(`./images/${file}`);
            });

		await prisma.category.delete({
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
        const token = req.headers[process.env.HEADER_TOKEN_NAME];

        if (accessToken != token) {
            return res.send('ACCESS DENIED');
        }

        // Получаем все интересные элементы
        const interestingElements = await prisma.category.findMany({
            where: {
                isInteresting: true,
            },
            select: {
                id: true,
            },
        });

        // Удаляем соответствующие файлы изображений
        interestingElements.forEach(async (element) => {
            const id = element.id;
            const imageFileName = `interesting_${id}_*.*`;

            // Используем шаблонные строки и регулярное выражение для поиска файлов
            const filesToDelete = fs.readdirSync('./images').filter((file) => {
                return new RegExp(imageFileName).test(file);
            });

            // Удаляем каждый файл
            filesToDelete.forEach((file) => {
                fs.unlinkSync(`./images/${file}`);
            });
        });

        // Удаляем все интересные элементы из базы данных
        await prisma.category.deleteMany({
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
	const token = req.headers[process.env.HEADER_TOKEN_NAME];
	let images = req.files.images;
	const { id } = req.query;

	if (token != accessToken || !token) {
		return res.send('ACCESS DENIED');
	}

	if (!Array.isArray(images)) {
		images = [images];
	}

	const interesting = await prisma.category.findFirst({
		where: {id, isInteresting: true}
	});

	if (!id || id !== interesting.id) {
		return res.send('Interesting not found');
	}
	
	images.forEach((image) => {
		let fileName = `interesting_${interesting.id}_MAIN_${image.name}` ;
		image.mv(`./images/${fileName}`, (err) => {
			if (err) return res.status(500).send(err);
		});
	});	
	
	
	res.send('Files uploaded!');
});

interestingRouter.put('/rename', async (req, res) => {
	try {
		const { id, name } = req.query;
		const token = req.headers[process.env.HEADER_TOKEN_NAME];

		if (accessToken != token) {
			return res.send('ACCESS DENIED');
		}

		await prisma.category.update({
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
