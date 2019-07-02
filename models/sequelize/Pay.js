var sequelize = require('../../configs/seq-config');
const   Sequelize = require('sequelize');

const Pay = sequelize.define('Pay', {
        user_id: Sequelize.INTEGER,
        article_id: Sequelize.INTEGER,
        amount: Sequelize.INTEGER,
        t_code: Sequelize.STRING,
        date_time: Sequelize.STRING,
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
},
    {
        tableName:'pays'
    }
);
module.exports = Pay;