import Router from 'express';
import ClientRouter from './client.js';

const MasterRouter = new Router();

MasterRouter.use('/', ClientRouter);

export default MasterRouter;
