import Router from 'express';

const uploadImagesRouter = new Router();
const accessToken = process.env.ACCESS_TOKEN;

uploadImagesRouter.post('/', (req, res) => {
	const token = req.headers[process.env.HEADER_TOKEN_NAME];
	let images = req.files.images;

	if (token != accessToken || !token) {
		return res.send('ACCESS DENIED');
	}

	if (!Array.isArray(images)) {
		images = [images];
	}

	images.forEach((image) => {
		image.mv(`./images/${image.name}`, (err) => {
			if (err) return res.status(500).send(err);
		});
	});

	res.send('Files uploaded!');
});

export default uploadImagesRouter;
