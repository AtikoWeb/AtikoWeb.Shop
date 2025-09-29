import {PrismaClient} from '@prisma/client';
import {v4} from 'uuid';

const prisma = new PrismaClient();


class ClientController {
    async create(req, res) {

        try {
            const {domain, db_code, serverId, atikowebURL, yandexMapURL} = req.body;

            if (!db_code) {
                return res.send("Нет кода базы данных!");
            }

            const result = await prisma.client.create({

                data: {
                    domain,
                    db_code,
                    status: 'inactive',
                    token: v4(),
                    atikowebURL,
                    yandexMapURL,
                    server: {
                        connect: {
                            id: serverId,
                        }
                    }
                }
            })

            await prisma.server.update({
                where: {id: serverId},
                data: {
                    clientsQty: {
                        increment: 1, // Увеличиваем количество клиентов на 1
                    },
                },
            });

            if (!result) {
                return res.json('Что-то пошло не так');
            }

            res.json(result);
        } catch (error) {
            res.json('Что-то пошло не так');
            console.log(error);
        }
    }

    async getClientToken(req, res) {
        const {db_code} = req.query;

        if (!db_code) {
            return res.send("Нет кода базы данных!");
        }

        const {token} = await prisma.client.findUnique({
            where: {
                db_code,
            }
        })

        try {
            if (!token) {
                return res.send("Client doesn't exist");
            }
            res.json({token});
        } catch (error) {
            res.send('Something went wrong');
            throw error;
        }
    }

    async getClientDbCode(req, res) {
        const {domain} = req.query;

        if (!domain) {
            return res.send("Нет домена!");
        }

        const client = await prisma.client.findUnique({
            where: {
                domain,
            }
        })

        try {
            if (!client) {
                return res.send("Client doesn't exist");
            }
            res.json({db_code: client.db_code});
        } catch (error) {
            res.send('Something went wrong');
            throw error;
        }
    }

    async getClientStatus(req, res) {
        const {db_code} = req.query;

        if (!db_code) {
            return res.send("Нет кода базы данных!");
        }

        const client = await prisma.client.findUnique({
            where: {
                db_code,
            }
        })

        try {
            if (!client) {
                return res.send("Client doesn't exist");
            }
            res.json({status: client.status});
        } catch (error) {
            res.send('Something went wrong');
            throw error;
        }
    }

    async getClientAtikowebURL(req, res) {
        const {db_code} = req.query;

        if (!db_code) {
            return res.send("Нет кода базы данных!");
        }

        const client = await prisma.client.findUnique({
            where: {
                db_code,
            }
        })

        try {
            if (!client) {
                return res.send("Client doesn't exist");
            }
            res.json({url: client.atikowebURL});
        } catch (error) {
            res.send('Something went wrong');
            throw error;
        }
    }

    async getClientYandexURL(req, res) {
        const {db_code} = req.query;

        if (!db_code) {
            return res.send("Нет кода базы данных!");
        }

        const client = await prisma.client.findUnique({
            where: {
                db_code,
            }
        })

        try {
            if (!client) {
                return res.send("Client doesn't exist");
            }
            res.json({url: client.yandexMapURL});
        } catch (error) {
            res.send('Something went wrong');
            throw error;
        }
    }

    async updateYandexMapURL(req, res) {
        const {db_code} = req.query;
        const {yandexMapURL} = req.body;

        if (!db_code) {
            return res.send("Нет кода базы данных!");
        }

        await prisma.client.update({
            data: {
                yandexMapURL
            },
            where: {
                db_code,
            }
        })

        const updatedClient = await prisma.client.findFirst({
            where: {
                db_code,
            }
        })

        res.json({url: updatedClient.yandexMapURL});
    }

    catch(error) {
        res.send('Something went wrong');
        throw error;

    }


    async update(req, res) {
        try {
            const {db_code, status} = req.body;
            if (!db_code || !status) {
                return res.send('Invalid data');
            }
            await prisma.client.update({
                data: {
                    status,
                },
                where: {
                    db_code,
                }
            })

            const updatedClient = await prisma.client.findFirst({
                where: {
                    db_code,
                }
            })

            res.json(updatedClient);


        } catch (error) {
            res.send('Something went wrong');
            console.log(error);
        }
    }

    async deleteOne(req, res) {
        try {
            const {db_code, serverId} = req.body;

            if (!db_code) {
                return res.send("Нет кода базы данных!");
            }

            const result = await prisma.client.delete({
                where: {
                    db_code,
                    serverId
                }
            })

            await prisma.server.update({
                where: {id: serverId},
                data: {
                    clientsQty: {
                        decrement: 1, // Увеличиваем количество клиентов на 1
                    },
                },
            });

            res.send(result);
        } catch (error) {
            res.status(500).send('Error deleting client');
            console.error(error);
        }
    }
}

export default new ClientController();
