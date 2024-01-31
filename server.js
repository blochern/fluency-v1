// import dependencies
import express from 'express';
import pkg from 'pg';
import dotenv from 'dotenv';

// dotenv config
dotenv.config();

// environment variables
const port = process.env.port || 1987 // 1987 means no env variable set
const database_url = process.env.database_url;

// connect to data pool
const { Pool } = pkg;
const pool = new Pool({
    connectionString: database_url
});

// initialize app
const app = express();

// middlewares
app.use(express.json(), express.static('client'));

// get all route
app.get("/people", (req, res) => {
    pool.query('select * from people')
        .then((results) => {
            try {
                res.send(results.rows); return;
            }
            catch (err) {
                console.error(err.message);
                res.sendStatus(500);
            }
        })
});

// get one route
app.get("/people/:id", (req, res) => {
    const { id } = req.params;
    if (isNaN(+id)) {
        res.sendStatus(400); return;
    }
    pool.query("select * from people where id = $1", [id])
        .then((results) => {
            try {
                if (results.rowCount < 1) {
                    res.sendStatus(404); return;
                } else {
                    res.send(results.rows[0]); return;
                }
            }
            catch (err) {
                console.error(err.message);
                res.sendStatus(500);
            }
        })
});

// post one route
app.post("/people", (req, res) => {
    const { name, age, paid_rent } = req.body;
    // validate incoming data types
    if (!name || isNaN(+age) || typeof paid_rent !== 'boolean') {
        res.sendStatus(400); return;
    }
    pool.query('insert into people (name, age, paid_rent) values ($1, $2, $3) returning *',
        [name, age, paid_rent])
        .then((results) => {
            try {
                res.status(201).send(results.rows[0]); return;
            }
            catch (err) {
                console.error(err.message);
                res.sendStatus(500);
            }
        });
});

// put one route
app.put("/people/:id", (req, res) => {
    // destruct id
    const { id } = req.params;

    // destruct request object
    const { name, age, paid_rent } = req.body;

    // validate data
    if (!name || isNaN(+age) || typeof paid_rent !== 'boolean') {
        res.sendStatus(400); return;
    }

    pool.query("update people set name = $1, age = $2, paid_rent = $3 where id = $4 returning *",
    [name, age, paid_rent, id])
    .then((results) => {
        try {
            if (results.rowCount < 1) {
                res.sendStatus(404); return;
            }
            res.send(results.rows[0]); return;
        }
        catch (err) {
            console.error(err.message);
            res.sendStatus(500);
        }
    })
});

// delete one route
app.delete("/people/:id", (req, res) => {
    // destruct id
    const { id } = req.params;
    pool.query('delete from people where id = $1 returning *', [id])
    .then((results) => {
        try {
            if (results.rowCount < 1) {
                res.sendStatus(404); return;
            }
            res.send(results.rows[0]); return;
        }
        catch (err) {
            console.error(err.message);
            res.sendStatus(500);
        }
    });
});

// tell app to listen on port
app.listen(port, () => {
    console.log('Server listening on port ' + port);
})