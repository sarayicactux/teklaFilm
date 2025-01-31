var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const User = sequelize.define('user', {
    password: Sequelize.STRING,
    name: Sequelize.STRING,
    family: Sequelize.STRING,
    email: Sequelize.STRING,
    email_val: Sequelize.STRING,
    status: Sequelize.INTEGER,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
    {
        tableName:'users'
    }
);
module.exports = User;