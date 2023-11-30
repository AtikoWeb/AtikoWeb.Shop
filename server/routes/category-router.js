import Router from 'express';
const categoryRouter = new Router();
import CategoryController from '../controllers/category-controller.js';

categoryRouter.get('/categories', CategoryController.getAll);
categoryRouter.get('/categories/:id', CategoryController.getOne);

export default categoryRouter;
