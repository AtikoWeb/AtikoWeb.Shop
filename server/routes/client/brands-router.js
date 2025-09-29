import Router from 'express';
import BrandsController from '../../controllers/brands-controller.js';

const brandsRouter = new Router();

brandsRouter.get('/brands', BrandsController.getAll);

export default brandsRouter;
