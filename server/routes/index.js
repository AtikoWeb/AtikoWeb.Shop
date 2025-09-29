import Router from 'express';
import MasterRouter from './master/index.js';
import ClientRouter from './client/index.js';

const router = new Router();

router.use('/client', ClientRouter);
router.use('/master', MasterRouter);

export default router;
