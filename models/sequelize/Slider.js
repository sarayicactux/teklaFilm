var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const Slider = sequelize.define('Slider', {
    image_url: Sequelize.STRING,
    title: Sequelize.STRING,
    des: Sequelize.STRING,
    link: Sequelize.STRING,
    status: Sequelize.INTEGER,
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
},
    {
        tableName:'slider'
    }
);
module.exports = Slider;