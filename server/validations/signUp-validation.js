import { body } from 'express-validator';

export const authValidation = [
  body('email', 'Некорректный email').isEmail(),
  body(
    'username',
    'Имя пользователя не должно быть короче 4 символов'
  ).isLength({ min: 4 }),
  body('password', 'Пароль должен быть больше 5 и меньше 20 символов').isLength(
    { min: 5, max: 20 }
  ),
];
