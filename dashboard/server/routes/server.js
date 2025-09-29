import Router from 'express';
import ServerController from "../controllers/server-controller.js";

const ServerRouter = new Router();

ServerRouter.post('/create', ServerController.create);
ServerRouter.get('/get-all', ServerController.getAll);
ServerRouter.get('/get-one', ServerController.getOne);
ServerRouter.delete('/delete-one', ServerController.deleteOne);

export default ServerRouter;
