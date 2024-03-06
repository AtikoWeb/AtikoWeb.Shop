import Router from 'express';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';


const prisma = new PrismaClient();

const uploadImagesRouter = new Router();
const accessToken = process.env.ACCESS_TOKEN;

uploadImagesRouter.post('/product', async (req, res) => {
    const token = req.headers[process.env.HEADER_TOKEN_NAME];
    let images = req.files.images;
    const { id } = req.query;

    if (token != accessToken || !token) {
        return res.send('ACCESS DENIED');
    }

    if (!Array.isArray(images)) {
        images = [images];
    }

    const product = await prisma.product.findFirst({ where: { productId: id } });

    if (!id || id !== product.productId) {
        return res.send('Product not found');
    }

    const moveImagePromises = images.map((image, index) => {
        return new Promise((resolve, reject) => {
            let fileName;

            if (image.name.includes(product.art)) {
    			fileName = `${image.name}`;
			} else {
    			const parts = image.name.split(".");
    			const extension = parts[parts.length - 1];
				let baseFileName = `${product.art}_${index + 1}`;
    			// Проверка на наличие файла с таким порядковым номером
				while (fs.existsSync(`./images/${baseFileName}.${extension}`)) {
					index++;
					baseFileName = `${product.art}_${index + 1}`;
				}

				fileName = `${baseFileName}.${extension}`;
			}

            image.mv(`./images/${fileName}`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });

    try {
        await Promise.all(moveImagePromises);
        res.send('Files uploaded!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading files');
    }
});

uploadImagesRouter.post('/products', (req, res) => {
	const token = req.headers[process.env.HEADER_TOKEN_NAME];
	let images = req.files.images;

	if (token != accessToken || !token) {
		return res.send('ACCESS DENIED');
	}

	if (!Array.isArray(images)) {
		images = [images];
	}

	images.forEach((image) => {
		image.mv(`./images/${image.name}`, (err) => {
			if (err) return res.status(500).send(err);
		});
	});

	res.send('Files uploaded!');
});


uploadImagesRouter.post('/category', async (req, res) => {
	const token = req.headers[process.env.HEADER_TOKEN_NAME];
	let images = req.files.images;
	const { id} = req.query;

	if (token != accessToken || !token) {
		return res.send('ACCESS DENIED');
	}

	if (!Array.isArray(images)) {
		images = [images];
	}

	const category = await prisma.category.findFirst({where: {id}});

	if (!id || id !== category.id) {
		return res.send('Category not found');
	}
	
	images.forEach((image) => {
		let fileName = `category_${category.id}.png`;
		image.mv(`./images/${fileName}`, (err) => {
			if (err) return res.status(500).send(err);
		});
	});	
	
	
	res.send('Files uploaded!');
});

uploadImagesRouter.post('/interesting', async (req, res) => {
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
		let fileName = `interesting_${interesting.id}_${image.name}` ;
		image.mv(`./images/${fileName}`, (err) => {
			if (err) return res.status(500).send(err);
		});
	});	
	
	
	res.send('Files uploaded!');
});

uploadImagesRouter.post('/set-logo', async (req, res) => {
	const token = req.headers[process.env.HEADER_TOKEN_NAME];
	let image = req.files.image;

	if (token != accessToken || !token) {
		return res.send('ACCESS DENIED');
	}

	image.mv(`./images/${'logo.png'}`, (err) => {
		if (err) return res.status(500).send(err);
	});
	
	
	res.send('File uploaded!');
});

uploadImagesRouter.post('/set-favicon', async (req, res) => {
	const token = req.headers[process.env.HEADER_TOKEN_NAME];
	let image = req.files.image;

	if (token != accessToken || !token) {
		return res.send('ACCESS DENIED');
	}

	image.mv(`./images/${'favicon.ico'}`, (err) => {
		if (err) return res.status(500).send(err);
	});
	
	
	res.send('File uploaded!');
});

export default uploadImagesRouter;
