const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

console.log(`env file is: ${process.env.DATABASE_HOST}`);
console.log(`production environment is: ${process.env.NODE_ENV}`);

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
