import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import fileUpload from 'express-fileupload';
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 7272;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({}));
app.use(cors());
app.use('/api', router);
app.use('/api/images', express.static(path.resolve(__dirname, 'images')));


const startApp = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server started on PORT ${PORT}`);
        });

    } catch (error) {
        console.log(error);
    }
};

startApp();
