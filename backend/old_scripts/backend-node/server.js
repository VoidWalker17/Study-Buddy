const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Set up MongoDB later when tested
// mongoose.connect('mongodb://localhost:27017/studybuddy', { useNewUrlParser: true, useUnifiedTopology: true });

// Setup multer for PDF uploads
const upload = multer({ storage: multer.memoryStorage() });

const PYTHON_SERVICE_URL = 'http://localhost:8000';

app.post('/api/resources/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        // Forward the file to the Python service
        const formData = new FormData();
        const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
        formData.append('file', blob, req.file.originalname);
        
        // Use standard axios POST with fetch/FormData compatible headers
        // Since axios doesn't strictly take FormData like fetch in older nodes, we will use native fetch
        const response = await fetch(`${PYTHON_SERVICE_URL}/ml/process-document`, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Python service error: ${errText}`);
        }
        
        const data = await response.json();
        
        // MVP: Just return the generated concepts and questions to the frontend
        res.json({
            message: 'Document processed successfully',
            concepts: data.concepts,
            questions: data.questions
        });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: 'Failed to process document' });
    }
});

app.post('/api/teaching/message', async (req, res) => {
    try {
        const { explanation } = req.body;
        
        const response = await axios.post(`${PYTHON_SERVICE_URL}/ml/extract-concepts`, { explanation });
        
        res.json({
            extracted_concepts: response.data.concepts
        });
    } catch (error) {
        console.error('Teaching Message Error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Node backend running on port ${PORT}`);
});
