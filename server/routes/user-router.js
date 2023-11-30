import Router from 'express';
const userRouter = new Router();
import userController from '../controllers/user-controller.js';

userRouter.post('/signup', userController.signUp);
userRouter.post('/signin', userController.signIn);

export default userRouter;
