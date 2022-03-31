/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
console.log(`path in the db/models/index file is: ${__dirname}`);
const config = require(`${__dirname}/../../config/database.json`)[env];
console.log(`config is: ${JSON.stringify(config)}`);
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs.readdirSync(__dirname)
    .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
    .forEach((file) => {
        console.log(`file name of model is: ${file}`);
        console.log(`dirname is: ${__dirname}`);
        const pathstring = path.join(__dirname, file);
        console.log(`pathstring is: ${pathstring}`);
        // eslint-disable-next-line global-require
        // const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        // eslint-disable-next-line global-require
        const model = require(pathstring)(sequelize, Sequelize.DataTypes);
        console.log(`model is: ${model}`);
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
