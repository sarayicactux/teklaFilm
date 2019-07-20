const   express = require('express'),
        path = require('path'),
        bodyParser = require('body-parser'),
        session = require('express-session'),
        parseurl = require('parseurl'),
        cors = require('cors'),
        errorHandler = require('errorhandler'),
        mysql = require('mysql'),
        cookieParser = require('cookie-parser'),
        ejs = require('ejs'),
        eslint = require('eslint-plugin-security'),
        rateLimit = require("express-rate-limit"),
        helmet = require('helmet'),
        multer = require('multer'),
        xssFilter = require('x-xss-protection'),
        fs = require('fs'),
        FileStore = require('session-file-store')(session);

        // MemoryStore = require('memorystore')(session);





global.appRoot = path.resolve(__dirname);
global.host = 'http://localhost:3000';
global.vDir = 'F7L97@I^ktA';
var     app = express();
app.use(helmet()); //برای جلوگیری از حملات XSS
app.use(xssFilter({ setOnOldIE: true }));
app.use(xssFilter());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('panel',express.static( 'public/panel'));
app.use('admin',express.static( 'public/admin'));
app.use('local',express.static( 'public/local'));
app.use(cookieParser());
app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');
app.set('views','./views');

app.use(session({

    // using FileStore with express-session
    // as the sore method, replacing the default memory store
    store: new FileStore({
        logFn: function(){},
        path: './session-store'

    }),
    // store: new MemoryStore({
    //     checkPeriod: 86400000 // prune expired entries every 24h
    // }),
    name: 'teklafilm.CoM', // cookie will show up as foo site
    secret: 'NZuy7r3s@#8!ddaN@',
    resave: false,
    saveUninitialized: false,
     cookie: {
        maxAge: 1000 * 60 * 60 * 1
    }
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Origin', host);
    res.setHeader( 'X-Powered-By', 'Express' );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


const siteLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 Min
    max: 50, // start blocking after 50 requests
    message:
        "Too many requests created from this IP, please try again after an 5Min"
});
//app.use("/", siteLimiter); //برای محدود کردن تعداد درخواست ها



var     siteRoutes  = require('./routes/site');
var     panel       = require('./routes/panel');
var     admin       = require('./routes/admin');

// ***************TinyUploadFile************
var storage = multer.diskStorage({

    destination: function(req, file, cb, res) {

        cb(null, 'public/panel/images');

    },

    filename: function(req, file, cb, res) {

        var name = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null, name);

        return name;
    }
});

var upload = multer({
    storage: storage
});
app.post('/upload', upload.single('file'), function(req, res) {
    res.json({
        "location": host+'/panel/images/' + req.file.filename
    });
});
// ******************************************

//app.use('/panel/seo', checkSeo,seo);
app.use('/panel/admin', checkAdmin,admin);
app.use('/panel', panel);
app.use('/', siteRoutes);





//middlewares
function checkAdmin(req,res,next){
    if (!req.session.user){
        res.redirect('/panel');
        return;
    }
    else {
        if(!req.session.otp){
            res.redirect('/panel/logOut');
            return;
        }
        else {
			if (req.session.user.id == 1){
				next();
				return;
			}
			else{
				res.redirect(host);
				return;
			}
            

        }



    }
}

app.get('*', function(req, res){
    res.render('errors/404');
});
app.post('*', function(req, res){
    res.render('errors/404');
});
app.listen(3000);