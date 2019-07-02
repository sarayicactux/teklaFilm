var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const Video = sequelize.define('Video', {
    text: Sequelize.INTEGER,
    thumb: Sequelize.STRING,
    title: Sequelize.STRING,
    slug: Sequelize.STRING,
    des: Sequelize.STRING,
    main_file: Sequelize.STRING,
    demo_file: Sequelize.STRING,
    visits: Sequelize.INTEGER,
    downloads: Sequelize.INTEGER,
    status: Sequelize.INTEGER,
    sales: Sequelize.INTEGER,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
    {
        tableName:'videos'
    }
);
module.exports = Video;