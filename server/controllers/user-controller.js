import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
import nodemailer from 'nodemailer';

const saltRounds = 10; // количество "проходов" хеширования

// Настройка транспорта для nodemailer
const transporter = nodemailer.createTransport({
	service: 'mail.ru', // Можно использовать другой SMTP сервис или данные вашего почтового сервера
	secure: true,
	auth: {
		user: 'bil@atikoweb.ru', // Поменяйте на вашу почту
		pass: 'KW3NSYT4RyqtZwYsheKN', // Поменяйте на пароль от вашей почты
	},
	host: 'smtp.mail.ru',
	port: '465',
});

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
	// Временное хранилище для кодов подтверждения
	verificationCodes = {};

	constructor() {
		// Важно привязать методы к текущему экземпляру класса
		this.signUp = this.signUp.bind(this);
		this.verificationUser = this.verificationUser.bind(this);
		// Добавьте привязку для других методов, если это необходимо
	}

	async signUp(req, res) {
		const { name, password, phone, email } = req.body;

		try {
			const hashPassword = await generateHash(password);

			const user = {
				username: name,
				email,
				password: hashPassword,
				active: false,
				phone,
			};

			await prisma.user.create({ data: user });

			// Генерация кода подтверждения
			const verificationCode = Math.floor(1000 + Math.random() * 9000);
			this.verificationCodes[email] = verificationCode;

			const mailOptions = {
				from: {
					name: 'AtikoWeb',
					address: 'bil@atikoweb.ru'
				},
				to: email,
				html: `<div
			style="
				display: grid;
				place-content: center;
				place-items: center;
				margin: auto;
			"
		>
			<div style="margin-bottom: 40px">
				<img
					src="https://aokia.kz/aokia_logo.png"
					alt=""
					style="height: 40px;"
				/>
			</div>
			<div>
				<h1 style="font-weight: bold; color: #2d2d2e; font-size: x-large">
					Здравствуйте, ${name}!
				</h1>
				<h1 style="font-weight: normal; color: #2d2d2e; font-size: x-large">
					Ваш код подтверждения :
				</h1>
				<div style="display: flex; justify-content: center">
					<button
						style="
							padding: 20px;
							border: none;
							background-color: #f3f4f6;
							border-radius: 10px;
							color: black;
							width: 200px;
							font-size: 25px;
							font-weight: bold;
						"
					>
						${verificationCode}
					</button>
				</div>
			</div>
		</div>`,
				subject: 'Код подтверждения',
			};

			// Отправка письма
			transporter.sendMail(mailOptions, (error, info) => {
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});

			res.json('Ожидание верификации');
		} catch (error) {
			res.send('Ошибка создания');
			console.log('Ошибка создания', error);
		}
	}

	async verificationUser(req, res) {
		const { email, code } = req.body;

		// Получение кода подтверждения из временного хранилища
		const storedCode = this.verificationCodes[email];

		if (storedCode && storedCode.toString() === code) {
			// Коды совпадают - пользователь подтвержден
			delete this.verificationCodes[email]; // Удаляем использованный код
			const user = await prisma.user.update({
				where: { email },
				data: { active: true },
			});
			res.json({ userId: user.id });
		} else {
			// Коды не совпадают
			res.status(401).json('Неверный код подтверждения');
		}
	}

	async signIn(req, res) {
		const { email, phone, password } = req.body;
		let user;
  
		try {
			// Проверка, существует ли пользователь
			user = await prisma.user.findFirst({
			where: {
				OR: [
				{
					email,
					active: true,
				},
				{
					phone,
					active: true,
				},
				],
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
		const { id } = req.query;

		if (!id) {
			return res
				.status(400)
				.json({ error: 'Неверный запрос. Отсутствует параметр id.' });
		}

		// Теперь вы уверены, что id существует и не является пустым
		const user = await prisma.user.findUnique({
			where: {
				id: String(id),
			},
			select: {
				username: true,
				email: true,
				phone: true
			},
		});

		if (!user) {
			return res.status(401).json({ error: 'Пользователь не найден' });
		}

		res.json(user);
	}
	catch(error) {
		res.status(500).json({ error: 'Внутренняя ошибка сервера' });
		console.log('Ошибка', error);
	}

	async getUsers(req, res) {
		try {
			const users = await prisma.user.findMany({
				select: {
					id: true,
					username: true,
					active: true,
					phone: true,
					email: true
				},
			});
			res.json(users);
		} catch (error) {
			console.log(error);
			res.send('Ошибка при получении');
		}
	}

	async deleteUsers(req, res) {
		try {
			await prisma.user.deleteMany();
			res.send('Все пользователи успешно удалены!');
		} catch (error) {
			console.log(error);
			res.send('Ошибка при удалении');
		}
	}

	async deleteUser({ req, res }) {
		try {
			const { email } = req.query;
			await prisma.user.delete({ where: { email } });
			res.send('Пользователь успешно удален!');
		} catch (error) {
			console.log(error);
			res.send('Ошибка при удалении');
		}
	}

	async changePassword(req, res) {
		const { oldPassword, newPassword, email } = req.body;

		try {
			// Проверка, существует ли пользователь
			const user = await prisma.user.findFirst({
				where: {
					email,
					active: true,
				},
			});

			if (!user) {
				return res.status(401).json({ error: 'Пользователь не найден' });
			}

			// Проверка совпадения старого пароля
			const isOldPasswordMatch = await comparePassword(
				oldPassword,
				user.password
			);

			if (!isOldPasswordMatch) {
				return res.status(401).json({ error: 'Неверный старый пароль' });
			}

			// Генерация нового хэша пароля
			const newHashedPassword = await generateHash(newPassword);

			// Обновление пароля в базе данных
			await prisma.user.update({
				where: { email },
				data: { password: newHashedPassword },
			});

			res.json({ message: 'Пароль успешно изменен' });
		} catch (error) {
			console.log(error);
			res.send('Ошибка при смены пароля!');
		}
	}
}

export default new UserController();
