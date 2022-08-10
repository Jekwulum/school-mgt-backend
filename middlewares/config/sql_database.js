const { Sequelize } = require("sequelize");


module.exports = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
    host: process.env.POSTGRES_HOST,
    dialect: process.env.POSTGRES_DIALECT,
    logging: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 10000,
        idle: 5000
    },
});

// module.exports = new Sequelize(process.env.h_POSTGRES_DATABASE, process.env.h_POSTGRES_USER, process.env.h_POSTGRES_PASSWORD, {
//     host: process.env.h_POSTGRES_HOST,
//     dialect: process.env.h_POSTGRES_DIALECT,
//     logging: false,

//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 10000,
//         idle: 5000
//     },
// });