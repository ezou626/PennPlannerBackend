import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
const { Pool } = pg;
import { config } from 'dotenv';
import cors from 'cors';

config();

const app = express();
app.options('*', cors());
app.use(bodyParser.json());
app.use(cors());
const PORT = 5000;

var userRouter = require('./user.ts');

app.use('/user', userRouter);

app.listen(PORT, () => {
    console.log( `server started at http://localhost:${PORT}` );
});