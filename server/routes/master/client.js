import Router from 'express';
import ClientController from "../../controllers/client-controller.js";

const ClientRouter = new Router();

ClientRouter.post('/create', ClientController.create);
ClientRouter.delete('/delete-one', ClientController.deleteOne);

export default ClientRouter;
