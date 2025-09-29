import {PrismaClient} from '@prisma/client';
import fs from 'fs';
import pkg from 'pg';
import {execSync} from 'child_process';

const {Pool} = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
});

let message = '';
let folderPath;
const cachedClients = new Map();

const CLIENT_DATABASE_URL = process.env.CLIENT_DATABASE_URL;

class ClientService {
    async create(domain, db_code) {

        try {
            //Создание базы данных и папки для клиента
            await pool.query(`CREATE DATABASE ${db_code} OWNER = atikoweb;`);

            const lowerCase_db_code = db_code.toString().toLowerCase();

            const dataModelPath = `./prisma/${lowerCase_db_code}`;


            if (!fs.existsSync(dataModelPath)) {
                fs.mkdirSync(dataModelPath, {recursive: true});
                console.log(`datamodel ${lowerCase_db_code} has been created.`);
            }

            const dataModelContent = fs.readFileSync('./dataModel.txt', 'utf-8').trim();

            // Данные для записи в файл schema.prisma
            const schemaContent = `
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = "postgresql://atikoweb:house535723@localhost:5432/${lowerCase_db_code}"
}

${dataModelContent}
`;

// Путь к файлу schema.prisma
            const schemaFilePath = `./prisma/${lowerCase_db_code}/schema.prisma`;

// Запись данных в файл schema.prisma
            fs.writeFileSync(schemaFilePath, schemaContent.trim());

            // Выполнение миграции
            try {
                // Выполнение миграции синхронно
                const stdout = execSync(`npx prisma migrate dev --name migration_one --schema=./prisma/${lowerCase_db_code}/schema.prisma`);
                console.log(`stdout: ${stdout}`);
            } catch (error) {
                console.error(`Error: ${error.message}`);
                return;
            }

            const client = await this.getClient(lowerCase_db_code);

            await client.config.create({
                data: {
                    main_color: "#000",
                    column_count: 2,
                    isInteresting: false,
                }
            })

            // Путь к каталогу изображений
            const imagesFolderPath = `./clients/${lowerCase_db_code}/images`;

            // Путь к каталогу заказов
            const orderFolderPath = `./clients/${lowerCase_db_code}/orders`;

// Создание каталога изображений, если он не существует
            if (!fs.existsSync(imagesFolderPath)) {
                fs.mkdirSync(imagesFolderPath, {recursive: true});
                console.log(`Images folder ${imagesFolderPath} has been created.`);
            }

// Создание каталога заказов, если он не существует
            if (!fs.existsSync(orderFolderPath)) {
                fs.mkdirSync(orderFolderPath, {recursive: true});
                console.log(`Data folder ${orderFolderPath} has been created.`);
            }


            return 'Клиент создан';
        } catch (error) {
            console.error(error);
        }
    }

    async getClient(db_code = '') {

        const lowerCase_db_code = db_code.toLowerCase();

        if (cachedClients.has(lowerCase_db_code)) {
            return cachedClients.get(lowerCase_db_code);
        }

        console.log('LOG |', `${CLIENT_DATABASE_URL}/${lowerCase_db_code}?schema=public`);

        try {
            const client = new PrismaClient({
                datasources: {
                    db: {
                        url: `${CLIENT_DATABASE_URL}/${lowerCase_db_code}?schema=public`,
                    },
                },
            });

            cachedClients.set(lowerCase_db_code, client);
            return client;

        } catch (error) {
            console.error(error);
            throw new Error('Ошибка при создании пула');
        }
    }


    async deleteOne(db_code) {

        const lowerCase_db_code = db_code.toLowerCase();

        try {
            await pool.query(`SELECT pg_terminate_backend (pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${db_code}'; `);
            console.log(`Отключение всех сессий к ${db_code} прошло успешно!`)
        } catch (err) {
            console.log(`Отключение всех сессий к ${db_code} не удалось!`)
        }


        try {
            //Удаление базы данных и папки клиента
            await pool.query(`DROP DATABASE ${db_code};`);

            folderPath = `./clients/${db_code}`;
            const dataModelPath = `./prisma/${lowerCase_db_code}`;

            await fs.promises.rm(folderPath, {recursive: true});
            await fs.promises.rm(dataModelPath, {recursive: true});

            message = `Client ${db_code} was succesfully deleted`;
            console.log(`Client ${db_code} был успешно удален`);

            return message;
        } catch (error) {
            console.error(error);
            return `Клиент ${db_code} не удален`;
        }
    }

}

export default new ClientService();
