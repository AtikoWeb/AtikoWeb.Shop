import Router from 'express';
import categoryRouter from './category-router.js';
import imagesRouter from './images-router.js';
import getTokenRouter from './get-token-router.js';
import productRouter from './product-router.js';
import uploadCategoriesRouter from './upload-categories-router.js';
import uploadImagesRouter from './upload-images-router.js';
import uploadProductsRouter from './upload-products-router.js';
import settingsRouter from './settings-router.js';
import testRouter from './test.js';
import userRouter from './user-router.js';
import interestingRouter from './interesting-router.js';
import uploadBrandsRouter from './upload-brands-router.js';
import brandsRouter from './brands-router.js';
import orderRouter from './order-router.js';

const clientRouter = new Router();

clientRouter.use('/upload-products', uploadProductsRouter);
clientRouter.use('/upload-categories', uploadCategoriesRouter);
clientRouter.use('/upload-brands', uploadBrandsRouter);
clientRouter.use('/upload-images', uploadImagesRouter);
clientRouter.use('/product', productRouter);
clientRouter.use('/category', categoryRouter);
clientRouter.use('/brand', brandsRouter);
clientRouter.use('/token', getTokenRouter);
clientRouter.use('/order', orderRouter);
clientRouter.use('/images', imagesRouter);
clientRouter.use('/settings', settingsRouter);
clientRouter.use('/GetData', testRouter);
clientRouter.use('/user', userRouter);
clientRouter.use('/interesting', interestingRouter);

export default clientRouter;
