import Router from 'express';
import userController from '../../controllers/user-controller.js';

const userRouter = new Router();

userRouter.get('/get-one', userController.getUser);
// userRouter.get('/get-all', userController.getUsers);
userRouter.post('/signup', userController.signUp);
userRouter.post('/signin', userController.signIn);
userRouter.put('/verify', userController.verificationUser);
userRouter.get('/check-verification', userController.checkVerification);
userRouter.put('/change-password', userController.changePassword);
// userRouter.delete('/delete-all', userController.deleteUsers);
// userRouter.delete('/delete-one', userController.deleteUser);

export default userRouter;
