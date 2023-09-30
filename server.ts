import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user/user.js';

config();

const app = express();
app.options('*', cors());
app.use(bodyParser.json());
app.use(cors());
const PORT = 5000;

app.use('/', userRouter);

app.listen(PORT, () => {
    console.log( `server started at http://localhost:${PORT}` );
});