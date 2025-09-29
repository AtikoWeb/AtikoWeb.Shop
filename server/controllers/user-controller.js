import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';
import ClientService from "../services/client-service.js";
import axios from 'axios';

const prisma = new PrismaClient();

const saltRounds = 10; // количество "проходов" хеширования


// Генерация соли и хеширование пароля
const generateHash = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw new Error('Ошибка при генерации хэша');
    }
};

// Проверка пароля
const comparePassword = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Ошибка при сравнении паролей');
    }
};

class UserController {

    async signUp(req, res) {
        const {name, password, email, phone, domain} = req.body;
        const {db_code} = req.query;

        if (!db_code) {
            return res.send('Нет кода базы данных!')
        }

        try {
            const client = await ClientService.getClient(db_code);

            const hashPassword = await generateHash(password);

            const findUser = await client.user.findFirst({
                where: {
                    phone,
                }
            })

            if (findUser) {
                return res.status(500).send('Пользователь уже существует!');
            }

            const user = {
                username: name,
                phone,
                email,
                password: hashPassword,
                active: false,
            };

            await client.user.create({data: user});

            res.json('Ожидание верификации');
        } catch (error) {
            res.status(500).send('Ошибка создания');
            console.log('Ошибка создания', error);
        }
    }

    async verificationUser(req, res) {
        const {db_code, phone} = req.query;

        if (!db_code) {
            return res.send('Нет кода базы данных!')
        }

        try {
            const client = await ClientService.getClient(db_code);


            const findUser = await client.user.findFirst({
                where: {
                    phone,
                    active: false
                }
            })

            if (findUser) {
                await client.user.update({
                    where: {phone},
                    data: {active: true},
                });

                res.json('Успешная верификация');
            }
            else {
                 res.status(401).json('Пользователь уже верифицирован!');
            }
               
            
        } catch (error) {
            console.log('Ошибка при проверке', error);
        }
    }


       async checkVerification(req, res) {
        const {db_code, phone} = req.query;

        if (!db_code) {
            return res.send('Нет кода базы данных!')
        }

        try {
            const client = await ClientService.getClient(db_code);


            const findUser = await client.user.findFirst({
                where: {
                    phone,
                    active: true
                }
            })

            if (findUser) {
                res.json({userId: findUser.id});
            }
            else {
                 res.status(401).json('Пользователь не найден!');
            }
               
            
        } catch (error) {
            console.log('Ошибка при проверке', error);
        }
    }

    async signIn(req, res) {
        const {email, phone, password} = req.body;
        let user;

        const {db_code} = req.query;

        if (!db_code) {
            return res.send('Нет кода базы данных!')
        }


        try {

            const client = await ClientService.getClient(db_code);

            // Проверка, существует ли пользователь
            user = await client.user.findFirst({
                where: {
                    OR: [
                        {
                            email,
                            active: true,
                        },
                        {
                            phone,
                            active: true,
                        },
                    ],
                },
            });


            if (!user) {
                return res.status(401).json({error: 'Пользователь не найден'});
            }

            // Сравнение паролей
            const isPasswordMatch = await comparePassword(password, user.password);

            if (isPasswordMatch) {
                res.json({userId: user.id, message: 'Вход выполнен успешно'});
            } else {
                res.status(401).json({error: 'Неверный пароль'});
            }
        } catch (error) {
            res.status(500).json({error: 'Внутренняя ошибка сервера'});
            console.log('Ошибка входа', error);
        }
    }

  async getUser(req, res) {
    const { id, db_code, phone } = req.query;

    if (!db_code) {
        return res.send('Нет кода базы данных!');
    }

    if (!id && !phone) {
        return res
            .status(400)
            .json({ error: 'Неверный запрос. Отсутствует параметр id или phone.' });
    }

    try {
        const client = await ClientService.getClient(db_code);

        const userQuery = {};
        if (id) userQuery.id = String(id);
        if (phone) userQuery.phone = phone;

        const user = await client.user.findFirst({
            where: userQuery,
            select: {
                id: true,
                username: true,
                email: true,
                active: true,
                phone: true,
            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Пользователь не найден' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        console.log('Ошибка', error);
    }
}
    async getUsers(req, res) {
        const {db_code} = req.query;

        if (!db_code) {
            return res.send('Нет кода базы данных!')
        }

        try {
            const client = await ClientService.getClient(db_code);

            const users = await client.user.findMany({
                select: {
                    username: true,
                    active: true,
                    phone: true,
                    email: true
                },
            });
            res.json(users);
        } catch (error) {
            console.log(error);
            res.send('Ошибка при получении');
        }
    }

    async deleteUsers(req, res) {
        const {db_code} = req.query;

        if (!db_code) {
            return res.send('Нет кода базы данных!')
        }

        try {
            const client = await ClientService.getClient(db_code);

            await client.user.deleteMany();
            res.send('Все пользователи успешно удалены!');
        } catch (error) {
            console.log(error);
            res.send('Ошибка при удалении');
        }
    }

    async deleteUser(req, res) {
        const {db_code, phone} = req.query;
    

        if (!db_code) {
            return res.send('Нет кода базы данных!')
        }

        try {
            const client = await ClientService.getClient(db_code);
            await client.user.delete({where: {phone}});
            res.send('Пользователь успешно удален!');
        } catch (error) {
            console.log(error);
            res.send('Ошибка при удалении');
        }
    }

    async changePassword(req, res) {
        const {oldPassword, newPassword, email} = req.body;
        const {db_code} = req.query;

        if (!db_code) {
            return res.send('Нет кода базы данных!')
        }

        try {

            const client = await ClientService.getClient(db_code);

            // Проверка, существует ли пользователь
            const user = await client.user.findFirst({
                where: {
                    email,
                    active: true,
                },
            });

            if (!user) {
                return res.status(401).json({error: 'Пользователь не найден'});
            }

            // Проверка совпадения старого пароля
            const isOldPasswordMatch = await comparePassword(
                oldPassword,
                user.password
            );

            if (!isOldPasswordMatch) {
                return res.status(401).json({error: 'Неверный старый пароль'});
            }

            // Генерация нового хэша пароля
            const newHashedPassword = await generateHash(newPassword);

            // Обновление пароля в базе данных
            await client.user.update({
                where: {email},
                data: {password: newHashedPassword},
            });

            res.json({message: 'Пароль успешно изменен'});
        } catch (error) {
            console.log(error);
            res.send('Ошибка при смены пароля!');
        }
    }
}

export default new UserController();
