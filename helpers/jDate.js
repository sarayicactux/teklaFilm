var jalali = require('jalali-moment');


module.exports = {


    jDate: function (date) {

            jDate = jalali(date).locale('en');
            month = jDate.format('MMMM');
            day   = jDate.format('DD');
            year  = jDate.format('YYYY');
            return day+' '+month+' '+year;

    },


};