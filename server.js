const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const dbPath = path.join(__dirname, './db/db.json');

// Function to read data from db.json
const readDbFile = () => {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
};

// Function to write data to db.json
const writeDbFile = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
};

// GET route to fetch notes and send them to notes.html
app.get('/api/notes', (req, res) => {
    const notes = readDbFile();
    res.json(notes);
});

// POST route to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();

    const notes = readDbFile();
    notes.push(newNote);

    writeDbFile(notes);

    res.json(newNote);
});

// DELETE route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    const notes = readDbFile();
    const updatedNotes = notes.filter((note) => note.id !== noteId);

    writeDbFile(updatedNotes);

    res.json({ success: true });
});

// GET route to serve the notes.html file
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);


app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
