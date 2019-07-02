var sequelize = require('../configs/seq-config');
// define Models

const User                  = require('../models/sequelize/User');
const FreeArticle           = require('../models/sequelize/FreeArticle');
const Pay                   = require('../models/sequelize/Pay');
const Slider                = require('../models/sequelize/Slider');
const Video                 = require('../models/sequelize/Video');





// define relations



User.hasMany(Pay,{foreignKey:'user_id'});
Pay.belongsTo(User,{foreignKey:'user_id'});

Video.hasMany(Pay,{foreignKey: 'video_id'});
Pay.belongsTo(Video,{foreignKey: 'video_id'});



// create Models OBJ
var Models = {} ;
Models.FreeArticle  = FreeArticle;
Models.Slider       = Slider;
Models.Pay          = Pay;
Models.Video        = Video;
Models.User         = User;





module.exports = Models;