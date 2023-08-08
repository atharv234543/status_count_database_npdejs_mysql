
const express = require('express');
const mysql = require('mysql');

const app = express();

app.use(express.json()); // Parsing the JSON data in request body

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'status_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
    }
});

app.post('/get/status_cnt', (req, res) => {
    const uid = req.body.uid; // Extracting uid from the request body

    const query = `
        SELECT
            user.id,
            COUNT(candidate.cid) AS TotalCandidates,
            SUM(status_tb.status = 'joined') AS joined,
            SUM(status_tb.status = 'interview') AS interview
        FROM user
        LEFT JOIN candidate ON user.id = candidate.uid
        LEFT JOIN status_tb ON candidate.cid = status_tb.cid
        WHERE user.id = ?`;

    db.query(query, [uid], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Internal server error'); // Sending plain text response
        } else {
            // Create a plain text response
            const responseText = `User ID: ${results[0].id}\nTotal Candidates: ${results[0].TotalCandidates}\nJoined : ${results[0].joined}\nInterview : ${results[0].interview}`;
            res.send(responseText);
        }
    });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
