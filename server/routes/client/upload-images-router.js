import Router from 'express';
import fs from 'fs';
import path, {dirname} from "path";
import {fileURLToPath} from 'url';
import ClientService from "../../services/client-service.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const getImagesDir = (db_code) => {
    return path.join(__dirname, '..', '..', 'clients', db_code, 'images');
}


const uploadImagesRouter = new Router();
const accessToken = process.env.ACCESS_TOKEN;

uploadImagesRouter.post('/product', async (req, res) => {
    let images = req.files.images;
    const {id, db_code} = req.query;

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

    const product = await client.product.findFirst({where: {productId: id}});

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
                while (fs.existsSync(`${getImagesDir(lowerCase_db_code)}/${baseFileName}.${extension}`)) {
                    index++;
                    baseFileName = `${product.art}_${index + 1}`;
                }

                fileName = `${baseFileName}.${extension}`;
            }

            image.mv(`${getImagesDir(lowerCase_db_code)}/${fileName}`, (err) => {
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

uploadImagesRouter.post('/products', async (req, res) => {
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

    images.forEach((image) => {
        image.mv(`${getImagesDir(lowerCase_db_code)}/${image.name}`, (err) => {
            if (err) return res.status(500).send(err);
        });
    });

    res.send('Files uploaded!');
});


uploadImagesRouter.post('/category', async (req, res) => {
    let images = req.files.images;
    const {id, db_code} = req.query;
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

    if (!Array.isArray(images)) {
        images = [images];
    }

    const category = await client.category.findFirst({where: {id}});

    if (!id || id !== category.id) {
        return res.send('Category not found');
    }

    images.forEach((image) => {
        let fileName = `category_${category.id}.png`;
        image.mv(`${getImagesDir(lowerCase_db_code)}/${fileName}`, (err) => {
            if (err) return res.status(500).send(err);
        });
    });


    res.send('Files uploaded!');
});

uploadImagesRouter.post('/interesting', async (req, res) => {
    let images = req.files.images;
    const {id, db_code} = req.query;
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
        let fileName = `interesting_${interesting.id}_${image.name}`;
        image.mv(`${getImagesDir(lowerCase_db_code)}/${fileName}`, (err) => {
            if (err) return res.status(500);
        });
    });


    res.send('Files uploaded!');
});

uploadImagesRouter.post('/set-logo', async (req, res) => {
    const authToken = req.headers[process.env.HEADER_TOKEN_NAME];
    let image = req.files.image;
    const {db_code} = req.query;
    const lowerCase_db_code = db_code.toString().toLowerCase();

    if (!db_code) {
        return res.send('Нет кода базы данных!');
    }

    // const {token} = await ClientService.getClientToken(db_code);
    //
    // if (authToken !== token) {
    //     return res.send('ACCESS DENIED');
    // }


    image.mv(`${getImagesDir(lowerCase_db_code)}/${'logo.png'}`, (err) => {
        if (err) return res.status(500).send(err);
    });


    res.send('File uploaded!');
});

uploadImagesRouter.post('/set-favicon', async (req, res) => {
    const authToken = req.headers[process.env.HEADER_TOKEN_NAME];
    let image = req.files.image;
    const {db_code} = req.query;
    const lowerCase_db_code = db_code.toString().toLowerCase();

    if (!db_code) {
        return res.send('Нет кода базы данных!');
    }

    // const {token} = await ClientService.getClientToken(db_code);
    //
    // if (authToken !== token) {
    //     return res.send('ACCESS DENIED');
    // }

    image.mv(`${getImagesDir(lowerCase_db_code)}/${'favicon.ico'}`, (err) => {
        if (err) return res.status(500).send(err);
    });


    res.send('File uploaded!');
});

export default uploadImagesRouter;
