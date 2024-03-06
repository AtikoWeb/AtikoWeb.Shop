import Router from 'express';
const userRouter = new Router();
import userController from '../controllers/user-controller.js';

userRouter.get('/get-one', userController.getUser);
userRouter.get('/get-all', userController.getUsers);
userRouter.post('/signup', userController.signUp);
userRouter.post('/signin', userController.signIn);
userRouter.post('/verify', userController.verificationUser);
userRouter.put('/change-password', userController.changePassword);
userRouter.delete('/delete-all', userController.deleteUsers);
userRouter.delete('/delete-one', userController.deleteUser);

export default userRouter;
