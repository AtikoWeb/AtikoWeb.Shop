import Router from 'express';
import ClientRouter from './client.js';
import ServerRouter from "./server.js";

const MasterRouter = new Router();

MasterRouter.use('/client', ClientRouter);
MasterRouter.use('/server', ServerRouter);

export default MasterRouter;
