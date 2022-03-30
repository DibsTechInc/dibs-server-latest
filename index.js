const express = require('express');
const cors = require('cors');
require('dotenv').config();

// const db = require('./models');

// db.sequelize.sync();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Dibs Base API Back End Start.'
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));
