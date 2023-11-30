import Router from 'express';
const productRouter = new Router();
import ProductController from '../controllers/product-controller.js';

productRouter.get('/products', ProductController.getAll);
productRouter.get('/products/:id', ProductController.getOne);

export default productRouter;
