//var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
var UH       = require('./modules/userHandaling');
module.exports = function(app) {

	app.get('/', function(req, res) {
		res.render('index');
	});
	app.get('/index', function(req, res) {
		res.render('index');
	});
	app.get('/login', function(req, res) {
		if (req.cookies.user == undefined || req.cookies.pass == undefined){
			res.render('index', { title: 'Hello - Please Login To Your Account' });
		}else{
			// attempt automatic login //
			UH.autoSignIn(req.cookies.user, req.cookies.pass, function(o){
				if (o != null){
					req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('index', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
		res.render('index');
	});
	app.post('/login', function(req, res){
		UH.manualSignIn(req.body['username'], req.body['password'], function(error, output){
			//console.log("Error : "+error);
			//console.log("Respond : "+output);
			if (!output){
				res.status(400).send(error);
			}	else {
				req.session.user = output;
				if (req.body['remember-me'] == 'on'){
					res.cookie('username', output.username, { maxAge: 900000 });
					res.cookie('password', output.password, { maxAge: 900000 });
				}
				//console.log("render : "+req.session.user);
				//res.redirect('/home');
				//res.json(output);
			res.redirect('home');
			}
		});
	});
	/*
	app.get('/home', function(req, res) {
		if (req.session.user == null){
			res.redirect('/');
		}	else{
			res.render('home');
		}
	});*/
	app.get('/logout', function(req, res){
		res.clearCookie('username');
		res.clearCookie('password');
		req.session.destroy();
		console.log(req.session.user);
		res.redirect('/');
	});
};
