const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const connection = require('./db');
const cors = require('cors');
const e = require('express');
const app = express();
app.use(express.json());
app.use(cors());
app.get('/staffs', (req, res) => {
    connection.query('SELECT * FROM staffs', (err, results) => {
        if (err) {  
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

app.post('/staffs', (req, res) => {
    const { name, role, dateofjoin } = req.body;
    if (!name || !role || !dateofjoin) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    connection.query('INSERT INTO staffs (name, role, dateofjoin) VALUES (?, ?, ?)', [name, role, dateofjoin], (err, results) => {

        if (err) {  
            return res.status(500).json({ error: 'Database insert error' });
        }   
        res.status(201).json({ message: 'Staff added', staffId: results.insertId });
    });
}); 

app.put('/staffs/:id', (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!id || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    connection.query('UPDATE staffs SET name = ? WHERE sid = ?', [name, id], (err, results) => {
        if (err) {  
            return res.status(500).json({ error: 'Database update error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Staff not found' });
        }
        res.json({ message: 'Staff updated' });
    });
});

app.delete('/staffs/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM staffs WHERE sid = ?', [id], (err, results) => {
        if (err) {  
            return res.status(500).json({ error: 'Database delete error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Staff not found' });
        }

        res.json({ message: 'Staff deleted' });
    });
});

// Save file path in DB instead of binary
app.post('/upload', upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const name = req.body.name;
    const filePath = req.file.path; // path in "uploads/"

    connection.query(
        'INSERT INTO video_upload (name, file_path) VALUES (?, ?)',
        [name, filePath],
        (err, results) => {
            if (err) {
                console.error('Database insert error:', err);
                return res.status(500).json({ error: 'Database insert error' });
            }
            res.json({ message: 'File uploaded successfully', fileId: results.insertId });
        }
    );
});

// Download by ID


// List all uploaded files for frontend
app.get('/uploads', (req, res) => {
    connection.query('SELECT id, name FROM video_upload ORDER BY id DESC', (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results); // array of {id, name} for frontend
    });
});


app.get('/download/:id', (req, res) => {
    const { id } = req.params;

    connection.query('SELECT * FROM video_upload WHERE id = ?', [id], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = results[0];
        res.download(file.file_path, file.name, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({ error: 'Download failed' });
            }
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

