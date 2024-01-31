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

// tell app to listen on port
app.listen(port, () => {
    console.log('Server listening on port ' + port);
})