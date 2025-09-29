import Router from 'express';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const getImagesDir = (db_code) => {
    return path.join(__dirname, '..', '..', 'clients', db_code, 'images');
}


const imagesRouter = new Router();

imagesRouter.get('/get-images', async (req, res) => {

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

    try {
        const images = fs
            .readdirSync(getImagesDir(lowerCase_db_code))
            .filter((filename) => {
                return (
                    filename.endsWith('.png') ||
                    filename.endsWith('.jpg') ||
                    filename.endsWith('.jpeg') ||
                    filename.endsWith('.ico')
                );
            })
            .map((filename) => {
                const upperCaseFilename = filename.toUpperCase().replace('-', '_');

                let matchInteresting = upperCaseFilename.match(/^(INTERESTING_.*?)\.(PNG|JPG|JPEG)$/);
                if (matchInteresting) {
                    let prefix = matchInteresting[1];
                    return {
                        name: filename,
                        isMainImage: filename.includes('_MAIN'), // Используем includes для определения _MAIN
                        isInteresting: true,
                        prefix: prefix,
                    };
                }

                let matchMain = upperCaseFilename.match(/^(.*?)_MAIN\.(PNG|JPG|JPEG)$/);
                if (matchMain) {
                    let prefix = matchMain[1];
                    return {
                        name: filename,
                        isMainImage: true,
                        prefix: prefix,
                    };
                }

                let matchCategory = upperCaseFilename.match(/^CATEGORY_(.*?)\.(PNG|JPG|JPEG)$/);
                if (matchCategory) {
                    let categoryId = matchCategory[1];
                    return {
                        name: filename,
                        isMainImage: false,
                        categoryId: categoryId,
                    };
                }

                let matchProduct = upperCaseFilename.match(/^(.*?)_([0-9]+)\.(PNG|JPG|JPEG)$/);
                if (matchProduct) {
                    let prefix = matchProduct[1];
                    let num = parseInt(matchProduct[2]);
                    return {
                        name: filename,
                        isMainImage: false,
                        prefix: prefix,
                        num: num,
                    };
                }

                // Добавляем условие для главных изображений без суффикса _MAIN
                if (!upperCaseFilename.includes('_')) {
                    return {
                        name: filename,
                        isMainImage: true,
                        prefix: upperCaseFilename,
                    };
                }

                if (upperCaseFilename === 'LOGO.PNG') {
                    return {
                        name: filename,
                        isLogo: true,
                    };
                }

                if (upperCaseFilename === 'FAVICON.ICO') {
                    return {
                        name: filename,
                        isFavicon: true,
                    };
                }

                return null;
            })
            .filter((image) => {
                return image !== null;
            })
            .sort((a, b) => {
                if (a.isMainImage && !b.isMainImage) {
                    return -1; // главные изображения впереди
                } else if (!a.isMainImage && b.isMainImage) {
                    return 1;
                } else if (a.isMainImage && b.isMainImage) {
                    return a.name.localeCompare(b.name); // сортировка главных изображений по имени
                } else if (!a.isMainImage && !b.isMainImage && a.prefix && b.prefix) {
                    if (a.prefix === b.prefix) {
                        return a.num - b.num; // сортировка изображений товаров по номеру
                    } else {
                        return a.prefix.localeCompare(b.prefix); // если префиксы разные, сортируем по префиксу
                    }
                } else if (!a.isMainImage && !b.isMainImage && a.categoryId && b.categoryId) {
                    return a.categoryId.localeCompare(b.categoryId); // сортировка изображений категорий по id категории
                } else {
                    return a.name.localeCompare(b.name); // остальные случаи сортируются по имени
                }
            })
            .map((image) => {
                return {
                    name: image.name,
                    isMainImage: image.isMainImage,
                    isInteresting: image.isInteresting || false, // добавляем значение isInteresting
                    prefix: image.prefix || null,
                    num: image.num || null,
                    categoryId: image.categoryId || null,
                };
            });

        res.json(images);
    } catch (error) {
        console.error(error);
        res.send('Ошибка получения изображений');
    }
});

imagesRouter.delete('/delete-image', async (req, res) => {
    try {
        const {name} = req.body;

        const {db_code} = req.query;

        const lowerCase_db_code = db_code.toString().toLowerCase();

        const authToken = req.headers[process.env.HEADER_TOKEN_NAME];

        if (!db_code) {
            return res.send('Нет кода базы данных!');
        }
        //
        // const {token} = await ClientService.getClientToken(db_code);
        //
        // if (authToken !== token) {
        //     return res.send('ACCESS DENIED');
        // }

        const imagePath = path.join(getImagesDir(lowerCase_db_code), name);
        await fs.promises.unlink(imagePath);

        res.send('Изображение успешно удалено');
    } catch (error) {
        console.log(error);
        res.send('Ошибка удаления изображения');
    }
});

imagesRouter.delete('/delete-images', async (req, res) => {

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

    try {
        const images = fs.readdirSync(getImagesDir(lowerCase_db_code));
        for (const image of images) {
            await fs.promises.unlink(`${getImagesDir(lowerCase_db_code)}/${image}`);
        }
        res.send('Изображения успешно удалены');
    } catch (error) {
        console.log(error);
        res.send('Ошибка удаления изображений');
    }
});

// Добавлен новый метод set-main-image
imagesRouter.put('/set-main-image', async (req, res) => {

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

    try {
        const {name} = req.body;

        // Убираем нумерацию у картинки товара
        const strippedName = name.replace(/_?\d+[^_]*(\.[^.]+)$/, '$1');

        // Получаем артикул товара или категории и нумерацию из имени файла
        const match = strippedName.match(/^([a-zA-Z0-9-]+)\.(png|jpg|jpeg)$/);

        console.log(`имя картинки: ${name} | strippedName: ${strippedName} | match: ${JSON.stringify(match)}`);

        if (!match) {
            // Если не удается получить артикул, возвращаем ошибку
            return res.status(400).send('Invalid image name format');
        }

        const id = match[1];

        // Получаем все изображения для данного товара или категории
        const images = fs
            .readdirSync(getImagesDir(lowerCase_db_code))
            .filter((filename) => {
                return (
                    filename.endsWith('.png') ||
                    filename.endsWith('.jpg') ||
                    filename.endsWith('.jpeg')
                );
            })
            .filter((image) => {
                return image.includes(`${id}_`)
            });

        // Убираем _MAIN у всех изображений для данного товара или категории
        for (const image of images) {
            if (image.includes('_MAIN')) {
                const originalName = image;
                let match = originalName.match(/^(.*?)(_MAIN)?(\.[^.]+)$/);

                if (match) {
                    const imageId = match[1];
                    const extension = match[3];
                    let newNumber = Math.floor(Math.random() * 3) + 1;
                    const baseName = `${imageId}_${newNumber}`;
                    let newName = `${baseName}${extension}`;

                    // Проверяем, есть ли уже файл с новым именем
                    let newPath = path.join(getImagesDir(lowerCase_db_code), newName);

                    while (fs.existsSync(newPath)) {
                        // Если номер уже является крайним, уменьшаем его на единицу
                        if (newNumber === 3) {
                            newNumber = 1;
                        } else {
                            newNumber += 1;
                        }

                        newName = `${imageId}_${newNumber}${extension}`;
                        newPath = path.join(getImagesDir(lowerCase_db_code), newName);
                    }

                    const originalPath = path.join(getImagesDir(lowerCase_db_code), originalName);
                    console.log(`Removing _MAIN: ${originalPath} to ${newPath}`);

                    if (fs.existsSync(originalPath)) {
                        fs.renameSync(originalPath, newPath);
                    }
                }
            }
        }


        // Переименовываем выбранное изображение и добавляем _MAIN
        const newName = name.includes('_MAIN') ? name.replace('_MAIN', '') : name.replace(/^(.*?)(_([0-9]+))?(\.[^.]+)$/, '$1_MAIN$4');
        const originalName = name.replace('_MAIN', ''); // Обращаемся к оригинальному имени, а не newName
        const imagePath = path.join(getImagesDir(lowerCase_db_code), originalName);
        const newImagePath = path.join(getImagesDir(lowerCase_db_code), newName);

        console.log(`Renaming: ${imagePath} to ${newImagePath}`);

        if (fs.existsSync(imagePath) && originalName !== newName) {
            await fs.promises.rename(imagePath, newImagePath);
        }

        res.send('Изображение успешно установлено как главное');
    } catch (error) {
        console.log(error);
        res.status(500).send('Ошибка установки изображения как главного');
    }
});

export default imagesRouter;
