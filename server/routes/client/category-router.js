import Router from 'express';
import CategoryController from '../../controllers/category-controller.js';

const categoryRouter = new Router();

categoryRouter.get('/categories', CategoryController.getAll);

export default categoryRouter;
