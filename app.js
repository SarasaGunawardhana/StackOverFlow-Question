var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var engines = require('consolidate');
var flash    = require('connect-flash');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
app.use(cookieParser());
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname));
var dbHost = process.env.DB_HOST || 'localhost';
var dbPort = process.env.DB_PORT || 27017;
var dbName = process.env.DB_NAME || 'mastercoders';
var dbURL = 'mongodb://'+dbHost+':'+dbPort+'/'+dbName;
mongoose.connect(dbURL, function(res, err){
  if (err) {
    console.log("There is a problem connecting to the MongoDB");
  } else {
    console.log("Successfully Connected to the MongoDB");  }
});

app.use(session({
	secret: 'faeb4453e5d14fe6f6d04637f78077c76c73d1b4',
	proxy: true,
	resave: true,
	saveUninitialized: true,
	store: new MongoStore({ url: dbURL })
	})
);

require('./server/routes')(app);

app.use(function (req, res){
  res.type('text/html');
  res.status(404);
  res.render('404');
});
app.use(function (err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});


//server start
app.listen(app.get('port'), function(){
  console.log("Express Started on http://localhost:"+app.get('port')+ " press ctrl-c to terminate ");
});
