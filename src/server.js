require('dotenv').config();

const express = require('express');

const app = require('./app');

const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Server is running in http://192.168.1.24:${PORT}`);
            console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

startServer();
