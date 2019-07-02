var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const FreeArticle = sequelize.define('FreeArticle', {
    type: Sequelize.INTEGER,
    thumb: Sequelize.STRING,
    title: Sequelize.STRING,
    slug: Sequelize.STRING,
    des: Sequelize.STRING,
    file_url: Sequelize.STRING,
    visits: Sequelize.INTEGER,
    downloads: Sequelize.INTEGER,
    status: Sequelize.INTEGER,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
    {
        tableName:'free_articles'
    }
);
module.exports = FreeArticle;