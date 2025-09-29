import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

class ServerController {
    async create(req, res) {
        try {
            const {name, ip} = req.body;
            const result = await prisma.server.create({
                data: {
                    name,
                    ip,
                }
            })

            if (!result) {
                return res.json('Что-то пошло не так');
            }

            res.json(result);
        } catch (error) {
            res.json('Something went wrong');
            console.log(error);
        }
    }

    async getAll(req, res) {

        try {
            const servers = await prisma.server.findMany({
                orderBy: {
                    clientsQty: 'desc'
                }
            });
            res.json(servers);
        } catch (error) {
            throw error;
        }
    }

    async getOne(req, res) {
        const {id, domain} = req.query;
        let server;
        try {

            if (!domain) {

                server = await prisma.server.findFirst({
                    where: {
                        id,
                    },
                    select: {
                        id: true,
                        name: true,
                        ip: true,
                        client: {
                            select: {
                                id: true,
                                domain: true,
                                db_code: true,
                                status: true,
                            },
                            orderBy: {
                                status: 'asc',
                            }
                        }
                    }
                })
            } else {
                server = await prisma.server.findFirst({
                    where: {
                        client: {
                            some: {
                                domain,
                            }
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                    }
                })
            }


            if (!server) {
                return res.send("Server doesn't exist");
            }

            // Фильтрация активных клиентов
            if (!domain) {
                const activeClients = server.client.filter(client => client.status === 'active');
                const activeClientsQty = activeClients.length;

                // Отправка ответа с количеством активных клиентов
                return res.json({clientsQty: server.client.length, activeClientsQty, server});
            }
            res.json({server});
        } catch (error) {
            res.send('Something went wrong');
            throw error;
        }
    }


    async deleteOne(req, res) {
        try {
            const {id} = req.body;
            const result = await prisma.server.delete({
                where: {
                    id,
                }
            })

            if (!result) {
                return res.json('Что-то пошло не так');
            }

            res.json(result);
        } catch (error) {
            res.json('Something went wrong');
            console.log(error);
        }
    }

}

export default new ServerController();
