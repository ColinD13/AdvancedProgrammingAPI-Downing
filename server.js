require('dotenv').config();

const express = require('express');

const { Pool } = require('pg');

const app = express();
app.use(express.json());

const pool = new Pool({
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false } // Required for Render
});

pool.connect().then(client => {
    console.log("Connected to PostgreSQL");
    client.release();
}).catch(err =>{
    console.error('Database connection error:',err);
});

app.get('/api/players', async (req, res) => {
    try{
        const result = await pool.query('select * from nfl_players');
        res.json(result.rows);
    }catch (err){
        console.error(err);
        res.status(500).json({error : "Database query fail"});
    }
});

app.get('/', (req,res) => {
    res.json({ message: 'API is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
})