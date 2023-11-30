import Router from 'express';
import categoryRouter from './category-router.js';
import imagesRouter from './images-router.js';
import getTokenRouter from './get-token-router.js';
import productRouter from './product-router.js';
import uploadCategoriesRouter from './upload-categories-router.js';
import uploadImagesRouter from './upload-images-router.js';
const router = new Router();
import uploadProductsRouter from './upload-products-router.js';
import settingsRouter from './settings-router.js';
import testRouter from './test.js';
import userRouter from './user-router.js';

router.use('/upload-products', uploadProductsRouter);
router.use('/upload-categories', uploadCategoriesRouter);
router.use('/upload-images', uploadImagesRouter);
router.use('/product', productRouter);
router.use('/category', categoryRouter);
router.use('/token', getTokenRouter);
router.use('/images', imagesRouter);
router.use('/settings', settingsRouter);
router.use('/GetData', testRouter);
router.use('/user', userRouter);

export default router;
