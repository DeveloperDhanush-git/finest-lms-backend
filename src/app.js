const express = require('express');

const app = express();

const swaggerDocs = require('./config/swagger');
swaggerDocs(app);

app.use(express.json());

const PORT = process.env.PORT || 5000;

const healthRoute = require('./routes/health.route');

app.use('/api/health', healthRoute);

app.get('/', (req, res) => {
    console.log('Received a request to the root endpoint');
    res.send('Welcome to the Finest LMS API!');
});

module.exports = app;