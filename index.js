const express = require('express');
const cors = require('cors');
const models = require('@dibs-tech/models');
const session = require('express-session');
const flash = require('express-flash');

require('./globals');

// if (process.env.NODE_ENV !== 'production') {
//     // eslint-disable-next-line global-require
//     require('dotenv').config();
// }

const {
    Sequelize: { Op }
} = models;

const app = express();

console.log(`env file is: ${process.env.DATABASE_HOST}`);
console.log(`production environment is: ${process.env.NODE_ENV}`);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(flash());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    })
);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
// const { createProxyMiddleware } = require('http-proxy-middleware');

app.use('/api', require('./api/routes'));

// webhook routes
app.use('/webhooks', require('./routes/webhooks'));

// app.use('/api', createProxyMiddleware({ target: 'http://localhost:8080', changeOrigin: true }));

app.get('/', (req, res) => {
    async function getEvents() {
        try {
            const events = await models.event.findAll({
                where: {
                    dibs_studio_id: 153,
                    canceled: 0,
                    deleted: 0,
                    start_date: {
                        [Op.gte]: '2022-03-22 00:00:00'
                    }
                },
                limit: 1
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
