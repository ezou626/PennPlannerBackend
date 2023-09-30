import { NextFunction, Request, Response } from 'express';
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import { config } from 'dotenv';
config();

const router = express.Router()

//establish elephantsql db connection
const client = new Pool({connectionString: process.env.PG_URL, max: 5});
await client.connect();
console.log("Connected to DB!");

//create database and table
console.log(await client.query("SELECT * FROM PennData"))

//await client.query('CREATE TABLE PennData (name varchar(1000), email varchar(1000), data varchar(8000))');

router.get('/ping', (req: Request, res: Response) => {
    res.send('pong');
})

router.post('/user', async (req: Request, res: Response) => {
    let body = req.body;
    res.json({message: "not yet implemented"})
    // if (body.secret != process.env.API_SECRET) {
    //     res.json({completed: false})
    //     return;
    // }

    // //check if exists
    // const checkQuery = {
    //     text: `SELECT * FROM PennData WHERE name = ${body.name} AND email = ${body.email};`
    // }

    // const exists = await client.query(checkQuery);

    // if (!exists.rows[0]) {
    //     const createQuery = {
    //         text: `INSERT INTO PennData (name, email, data) VALUES (${body.name}, ${body.email}, []);`
    //     }
    //     await client.query(createQuery);
    //     res.json({created: true});
    // } else {
    //     res.json({created: false});
    // }
})

router.post('/data', async (req: Request, res: Response) => {
    let body = req.body;

    res.json({message: "not yet implemented"})

    // if (body.secret != process.env.API_SECRET) {
    //     res.json({completed: false})
    //     return;
    // }

    // //check if exists
    // const checkQuery = {
    //     text: `SELECT data FROM PennData WHERE name = ${body.name} AND email = ${body.email};`
    // }

    // const data = await client.query(checkQuery);

    // res.json({data: JSON.parse(data.rows[0])});

})

router.post('/semester', async (req: Request, res: Response) => {
    let body = req.body;

    res.json({message: "not yet implemented"});

    // if (body.secret != process.env.API_SECRET) {
    //     res.json({completed: false})
    //     return;
    // }

    // //get data
    // const getQuery = {
    //     text: `SELECT data FROM PennData WHERE name = ${body.name} AND email = ${body.email};`
    // }
    // const data = await client.query(getQuery);
    // const semesters = JSON.parse(data.rows[0]);

    // semesters.push([]);

    // //update data
    // const newData = JSON.stringify(semesters);
    // const updateQuery = {
    //     text: `UPDATE PennData SET data = ${newData} WHERE  name = ${body.name} AND email = ${body.email};`
    // }
    // await client.query(updateQuery);

    // res.json({completed: true});
})

router.delete('/semester', async (req: Request, res: Response) => {
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
router.post('/course', async (req: Request, res: Response) => {
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

router.delete('/course', async (req: Request, res: Response) => {
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


export default router;