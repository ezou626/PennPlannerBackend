import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
const { Pool } = pg;
import { config } from 'dotenv';
import cors from 'cors';

config();

const app = express();
app.options('*', cors())
app.use(bodyParser.json());
app.use(cors());
const PORT = 5000;

//establish elephantsql db connection
const client = new pg.Pool({connectionString: process.env.PG_URL, max: 5});
await client.connect();
console.log("Connected to DB!");

//create database and table
await client.query('CREATE TABLE PennData (name varchar(1000), email varchar(1000), data varchar(8000))');

app.get('/ping', (req, res, next) => {
    res.send('pong');
})

app.post('/user', async (req, res, next) => {
    let body = req.body;

    if (body.secret != process.env.API_SECRET) {
        res.json({completed: false})
        return;
    }

    //check if exists
    const checkQuery = {
        text: `SELECT * FROM PennData WHERE name = ${body.name} AND email = ${body.email};`
    }

    const exists = await client.query(checkQuery);

    if (!exists.rows[0]) {
        const createQuery = {
            text: `INSERT INTO PennData (name, email, data) VALUES (${body.name}, ${body.email}, []);`
        }
        await client.query(createQuery);
        res.json({created: true});
    } else {
        res.json({created: false});
    }
})

app.post('/data', async (req, res, next) => {
    let body = req.body;

    if (body.secret != process.env.API_SECRET) {
        res.json({completed: false})
        return;
    }

    //check if exists
    const checkQuery = {
        text: `SELECT data FROM PennData WHERE name = ${body.name} AND email = ${body.email};`
    }

    const data = await client.query(checkQuery);

    res.json({data: JSON.parse(data.rows[0])});

})

app.post('/semester', async (req, res, next) => {
    let body = req.body;

    if (body.secret != process.env.API_SECRET) {
        res.json({completed: false})
        return;
    }

    //get data
    const getQuery = {
        text: `SELECT data FROM PennData WHERE name = ${body.name} AND email = ${body.email};`
    }
    const data = await client.query(getQuery);
    const semesters = JSON.parse(data.rows[0]);

    semesters.push([]);

    //update data
    const newData = JSON.stringify(semesters);
    const updateQuery = {
        text: `UPDATE PennData SET data = ${newData} WHERE  name = ${body.name} AND email = ${body.email};`
    }
    await client.query(updateQuery);

    res.json({completed: true});
})

app.delete('/semester', async (req, res, next) => {
    let body = req.body;

    if (body.secret != process.env.API_SECRET) {
        res.json({completed: false})
        return;
    }

    //get data
    const getQuery = {
        text: `SELECT data FROM PennData WHERE name = ${body.name} AND email = ${body.email};`
    }
    const data = await client.query(getQuery);
    const semesters = JSON.parse(data.rows[0]) as string[][];

    semesters.splice(body.semesterIndex, 1);

    //update data
    const newData = JSON.stringify(semesters);
    const updateQuery = {
        text: `UPDATE PennData SET data = ${newData} WHERE  name = ${body.name} AND email = ${body.email};`
    }
    await client.query(updateQuery);

    res.json({completed: true});
})

//needs semesterIndex, courseName
app.post('/course', async (req, res, next) => {
    let body = req.body;

    if (body.secret != process.env.API_SECRET) {
        res.json({completed: false})
        return;
    }

    //get data
    const getQuery = {
        text: `SELECT data FROM PennData WHERE name = ${body.name} AND email = ${body.email};`
    }
    const data = await client.query(getQuery);
    const semesters = JSON.parse(data.rows[0]) as string[][];

    semesters[body.semesterIndex].push(body.courseName);

    //update data
    const newData = JSON.stringify(semesters);
    const updateQuery = {
        text: `UPDATE PennData SET data = ${newData} WHERE  name = ${body.name} AND email = ${body.email};`
    }
    await client.query(updateQuery);

    res.json({completed: true});
})

app.delete('/course', async (req, res, next) => {
    let body = req.body;

    if (body.secret != process.env.API_SECRET) {
        res.json({completed: false})
        return;
    }

    //get data
    const getQuery = {
        text: `SELECT data FROM PennData WHERE name = ${body.name} AND email = ${body.email};`
    }
    const data = await client.query(getQuery);
    const semesters = JSON.parse(data.rows[0]) as string[][];

    semesters[body.semesterIndex].splice(body.courseIndex, 1);

    //update data
    const newData = JSON.stringify(semesters);
    const updateQuery = {
        text: `UPDATE PennData SET data = ${newData} WHERE  name = ${body.name} AND email = ${body.email};`
    }
    await client.query(updateQuery);

    res.json({completed: true});
})

app.listen(PORT, () => {
    console.log( `server started at http://localhost:${PORT}` );
});