import Router from 'express';
const brandsRouter = new Router();
import BrandsController from '../controllers/brands-controller.js';

brandsRouter.get('/brands', BrandsController.getAll);
brandsRouter.get('/brands/:id', BrandsController.getOne);

export default brandsRouter;
