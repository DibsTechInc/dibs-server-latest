const express = require('express');
const cors = require('cors');
require('dotenv').config();
const models = require('@dibs-tech/models');

const {
    Sequelize: { Op }
} = models;

const app = express();

console.log(`env file is: ${process.env.DATABASE_HOST}`);
console.log(`production environment is: ${process.env.NODE_ENV}`);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    async function getEvents() {
        try {
            const events = await models.event.findAll({
                where: {
                    dibs_studio_id: 218,
                    canceled: 0,
                    deleted: 0,
                    start_date: {
                        [Op.gte]: '2022-03-22 00:00:00'
                    }
                }
            });
            console.log(`events from db are: ${JSON.stringify(events)}`);
        } catch (err) {
            console.log(`error in getEvents: ${err}`);
        }
    }
    getEvents();
    res.json({
        message: 'Welcome to Dibs Base API Back End Start.'
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}, http://localhost:${port}`));
