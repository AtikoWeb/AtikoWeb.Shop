import Router from 'express';
import ProductController from '../../controllers/product-controller.js';

const productRouter = new Router();

productRouter.get('/products', ProductController.getAll);
productRouter.get('/products/:id', ProductController.getOne);
productRouter.get('/get-reviews', ProductController.getReviews);
productRouter.post('/create-review', ProductController.createReview);
productRouter.put('/update-review', ProductController.updateReview);

export default productRouter;
