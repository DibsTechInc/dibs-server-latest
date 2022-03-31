// if (process.env.NODE_ENV !== 'production') {
//     // eslint-disable-next-line
//     require('dotenv').load();
// }
// // should delete this file once we confirm it is not needed
// // const fs = require('fs');

// // const rdsCa = fs.readFileSync(__dirname + '/certificates/rds-combined-ca-bundle.pem');

// console.log(`database user - this one: ${process.env.DATABASE_USER}`);

// module.exports = {
//     development: {
//         username: process.env.DATABASE_USER,
//         password: process.env.DATABASE_PW,
//         database: process.env.DATABASE_NAME,
//         host: process.env.DATABASE_HOST,
//         dialect: 'postgres',
//         logging: process.env.DATABASE_LOGGING && console.log
//     },
//     production: {
//         use_env_variable: 'DATABASE_URL',
//         dialect: 'postgres',
//         logging: process.env.DATABASE_LOGGING && console.log,
//         dialectOptions: {
//             ssl: true
//         },
//         migrationStorage: 'sequelize',
//         migrationStorageTableName: 'sequelize_migrations',
//         pool: {
//             max: 100,
//             min: 0,
//             idle: 20000,
//             acquire: 0
//         }
//     },
//     test: {
//         autoMigrateOldSchema: '',
//         username: '',
//         password: '',
//         database: '',
//         host: '',
//         port: '',
//         dialect: 'sqlite',
//         logging: process.env.DATABASE_LOGGING && console.log
//     }
// };
