import ClientService from '../services/client-service.js';

class ClientController {
    async create(req, res) {
        try {
            const {domain, db_code} = req.body;
            const result = await ClientService.create(domain, db_code);

            if (!result) {
                return res.json('Что-то пошло не так');
            }

            res.json(result);
        } catch (error) {
            res.json('Что-то пошло не так');
            console.log(error);
        }
    }

    async deleteOne(req, res) {
        try {
            const {db_code} = req.body;
            const result = await ClientService.deleteOne(db_code);
            res.send(result);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error deleting client');
        }
    }

}

export default new ClientController();
