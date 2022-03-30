const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Remove this file once you confirm the back end is working

const app = express();
const corsOptions = {
    origin: 'http://localhost:8081'
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
// simple route
const db = require('./models');

db.sequelize.sync();
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Dibs Home.'
    });
});
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
