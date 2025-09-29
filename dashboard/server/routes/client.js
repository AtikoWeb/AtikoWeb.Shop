import Router from 'express';
import ClientController from "../controllers/client-controller.js";

const ClientRouter = new Router();

ClientRouter.post('/create', ClientController.create);
ClientRouter.delete('/delete-one', ClientController.deleteOne);
ClientRouter.get('/get-token', ClientController.getClientToken);
ClientRouter.get('/get-db', ClientController.getClientDbCode);
ClientRouter.get('/get-status', ClientController.getClientStatus);
ClientRouter.get('/get-atikowebURL', ClientController.getClientAtikowebURL);
ClientRouter.put('/update-yandexURL', ClientController.updateYandexMapURL);
ClientRouter.get('/get-yandexURL', ClientController.getClientYandexURL);
ClientRouter.put('/update', ClientController.update)

export default ClientRouter;
