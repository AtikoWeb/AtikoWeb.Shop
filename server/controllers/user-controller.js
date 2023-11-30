import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

const saltRounds = 10; // количество "проходов" хеширования

// Генерация соли и хеширование пароля
const generateHash = async (password) => {
	try {
		const salt = await bcrypt.genSalt(saltRounds);
		const hash = await bcrypt.hash(password, salt);
		return hash;
	} catch (error) {
		throw new Error('Ошибка при генерации хэша');
	}
};

// Проверка пароля
const comparePassword = async (password, hashedPassword) => {
	try {
		const match = await bcrypt.compare(password, hashedPassword);
		return match;
	} catch (error) {
		throw new Error('Ошибка при сравнении паролей');
	}
};

class UserController {
	async signUp(req, res) {
		const { name, phone, password } = req.body;

		try {
			const hashPassword = await generateHash(password);

			const user = { username: name, phone, password: hashPassword };

			const newUser = await prisma.user.create({ data: user });

			res.json({ userId: newUser.id });
		} catch (error) {
			res.send('Ошибка создания');
			console.log('Ошибка создания', error);
		}
	}

	async signIn(req, res) {
		const { phone, password } = req.body;

		try {
			// Проверка, существует ли пользователь
			const user = await prisma.user.findUnique({
				where: {
					phone,
				},
			});

			if (!user) {
				return res.status(401).json({ error: 'Пользователь не найден' });
			}

			// Сравнение паролей
			const isPasswordMatch = await comparePassword(password, user.password);

			if (isPasswordMatch) {
				res.json({ userId: user.id, message: 'Вход выполнен успешно' });
			} else {
				res.status(401).json({ error: 'Неверный пароль' });
			}
		} catch (error) {
			res.status(500).json({ error: 'Внутренняя ошибка сервера' });
			console.log('Ошибка входа', error);
		}
	}
	async getUser(req, res) {
		const { id } = req.body;

		try {
			// Проверка, существует ли пользователь
			const user = await prisma.user.findUnique({
				where: {
					id,
				},
				select: {
					username: true,
					phone: true,
				},
			});

			if (!user) {
				return res.status(401).json({ error: 'Пользователь не найден' });
			}

			res.json();
		} catch (error) {
			res.status(500).json({ error: 'Внутренняя ошибка сервера' });
			console.log('Ошибка', error);
		}
	}
}

export default new UserController();
