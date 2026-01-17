const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api', dashboardRoutes);



// Base Route
app.get('/', (req, res) => {
    res.send('Hotel Management API is running...');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
