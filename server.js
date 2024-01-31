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

