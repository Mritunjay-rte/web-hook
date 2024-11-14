const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/BeekhealthDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));

// Schema and Model for storing API responses
const apiResponseSchema = new mongoose.Schema({
    apiName: String,
    data: Object,
    receivedAt: { type: Date, default: Date.now },
});

const ApiResponse = mongoose.model('ApiResponse', apiResponseSchema);
app.post('/api/*', async (req, res) => {
    const fullPath = req.params[0];
    const eventData = req.body;

    console.log("Request received for:", fullPath);
    console.log("Request body:", eventData);

    try {
        // Create a new ApiResponse document with the data
        const apiResponse = new ApiResponse({
            apiName: fullPath,
            data: eventData,
        });

        // Save the document to the database
        await apiResponse.save();
        // Send a success response
        res.status(200).send('Data received and stored');
    } catch (error) {
        console.error('Error storing data:', error);
        res.status(500).send('Error storing data');
    }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Webhook server running on port ${PORT}`));
