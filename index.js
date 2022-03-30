const express = require('express');
const cors = require('cors');
const { Sequelize } = require('@sequelize/core');
require('dotenv').config();
const settings = require('./models/config/config');

if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line
    require('dotenv').config();
}
const env = process.env.NODE_ENV || 'development';
const config = settings[env];
// const db = {};

const sequelize =
    env === 'production'
        ? new Sequelize(process.env.DATABASE_URL, config)
        : new Sequelize(config.database, config.username, config.password, config);

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    async function getData() {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
    getData();
    res.json({
        message: 'Welcome to Dibs Base API Back End Start.'
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));
