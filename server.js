
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

const dbPath = path.join(__dirname, './db/db.json');

app.post('/api/notes', (req, res) => {
    const newNote = req.body;


    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }

        let notes = JSON.parse(data);
        notes.push(newNote);


        fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.json(newNote);
        });
    });
});

app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);