var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const File = sequelize.define('File', {
    title: Sequelize.STRING,
    file_url: Sequelize.STRING,
    visits: Sequelize.INTEGER,
    downloads: Sequelize.INTEGER,
    sales: Sequelize.INTEGER,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
    {
        tableName:'file'
    }
);
module.exports = File;