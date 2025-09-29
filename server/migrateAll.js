// migrateAll.js
import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';
import {promisify} from 'util';

const execAsync = promisify(exec);

async function updateSchemasAndMigrate() {
    try {
        // Чтение содержимого файла dataModel.txt
        const dataModelPath = './dataModel.txt';
        const newDataModelContent = (await fs.promises.readFile(dataModelPath, 'utf-8')).trim();

        // Получение списка папок в директории prisma
        const prismaFolderPath = './prisma';
        const clientFolders = (await fs.promises.readdir(prismaFolderPath, {withFileTypes: true}))
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const clientFolder of clientFolders) {
            const schemaFilePath = path.join(prismaFolderPath, clientFolder, 'schema.prisma');
            const currentSchemaContent = (await fs.promises.readFile(schemaFilePath, 'utf-8')).trim();

            // Игнорирование генератора и источника данных при сравнении содержимого
            const currentModelContent = currentSchemaContent.split('\n')
                .filter(line => !line.includes('generator') && !line.includes('datasource'))
                .join('\n');

            // Проверяем, изменилось ли содержимое
            if (currentModelContent !== newDataModelContent) {
                const newSchemaContent = `
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = "postgresql://atikoweb:house535723@localhost:5432/${clientFolder}"
}

${newDataModelContent}
`;

                await fs.promises.writeFile(schemaFilePath, newSchemaContent.trim());
                console.log(`Схема для ${clientFolder} обновлена, создаем миграцию...`);

                // Создаем миграцию
                const migrationCreateCommand = `npx prisma migrate dev --name update_${Date.now()} --schema=./prisma/${clientFolder}/schema.prisma --skip-generate`;
                try {
                    const {stdout, stderr} = await execAsync(migrationCreateCommand);
                    if (stderr) {
                        console.error(`Ошибка при создании миграции для базы ${clientFolder}: ${stderr}`);
                    } else {
                        console.log(`Миграция успешно создана для базы ${clientFolder}:\n${stdout}`);
                    }
                } catch (error) {
                    console.error(`Ошибка при создании миграции для базы ${clientFolder}: ${error.message}`);
                    continue;
                }

                // Применяем миграцию
                const applyMigrationCommand = `npx prisma migrate deploy --schema=./prisma/${clientFolder}/schema.prisma`;
                try {
                    const {stdout, stderr} = await execAsync(applyMigrationCommand);
                    if (stderr) {
                        console.error(`Ошибка при применении миграции для базы ${clientFolder}: ${stderr}`);
                    } else {
                        console.log(`Миграция успешно применена для базы ${clientFolder}:\n${stdout}`);
                    }
                } catch (error) {
                    console.error(`Ошибка при применении миграции для базы ${clientFolder}: ${error.message}`);
                }
            } else {
                console.log(`Схема для ${clientFolder} уже синхронизирована, миграция не требуется.`);
            }
        }
    } catch (error) {
        console.error(`Ошибка при выполнении миграций: ${error.message}`);
    }
}

// Запускаем функцию
updateSchemasAndMigrate();