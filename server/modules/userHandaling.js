var crypto = require('crypto');
var User = require('../dbModels/user.model');
/* login validation methods */

exports.autoSignIn = function(username, password, callback)
{
	console.log(username);
	User.findOne({username:username}, function(e, o) {
		if (o){
			o.password == password ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualSignIn = function(username, password, callback)
{
	User.findOne({username : username}).exec().then(users => {
		if (users == null) {
			callback('invalid-user');
		}else {
			validatePassword(password, users.password, function(e, res) {
				if (res==true){
					callback(null,users);
				}	else{
					callback('invalid-password');
				}
			});
		}
	}).catch(err => {
		callback(err);
	});
}




/* record insertion, update & deletion methods

exports.addNewAccount = function(newData, callback)
{
accounts.findOne({user:newData.user}, function(e, o) {
if (o){
callback('username-taken');
}	else{
accounts.findOne({email:newData.email}, function(e, o) {
if (o){
callback('email-taken');
}	else{
saltAndHash(newData.pass, function(hash){
newData.pass = hash;
// append date stamp when record was created //
newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
accounts.insert(newData, {safe: true}, callback);
});
}
});
}
});
}

exports.updateAccount = function(newData, callback)
{
accounts.findOne({_id:getObjectId(newData.id)}, function(e, o){
o.name 		= newData.name;
o.email 	= newData.email;
o.country 	= newData.country;
if (newData.pass == ''){
accounts.save(o, {safe: true}, function(e) {
if (e) callback(e);
else callback(null, o);
});
}	else{
saltAndHash(newData.pass, function(hash){
o.pass = hash;
accounts.save(o, {safe: true}, function(e) {
if (e) callback(e);
else callback(null, o);
});
});
}
});
}

exports.updatePassword = function(email, newPass, callback)
{
accounts.findOne({email:email}, function(e, o){
if (e){
callback(e, null);
}	else{
saltAndHash(newPass, function(hash){
o.pass = hash;
accounts.save(o, {safe: true}, callback);
});
}
});
}
*/
/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	User.remove({_id: getObjectId(id)}, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	User.findOne({email:email}, function(e, o){ callback(o); });
}

exports.validateResetLink = function(email, passHash, callback)
{
	User.find({ $and: [{email:email, pass:passHash}] }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
	User.find().toArray(
		function(e, res) {
			if (e) callback(e)
			else callback(null, res)
		});
	}

	exports.delAllRecords = function(callback)
	{
		User.remove({}, callback); // reset accounts collection for testing //
	}

	/* private encryption & validation methods */

	var generateSalt = function()
	{
		var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
		var salt = '';
		for (var i = 0; i < 10; i++) {
			var p = Math.floor(Math.random() * set.length);
			salt += set[p];
		}
		return salt;
	}

	var md5 = function(str) {
		return crypto.createHash('md5').update(str).digest('hex');
	}

	var saltAndHash = function(pass, callback)
	{
		var salt = generateSalt();
		callback(salt + md5(pass + salt));
	}

	var validatePassword = function(plainPass, hashedPass, callback)
	{
		var salt = hashedPass.substr(0, 10);
		var validHash = salt + md5(plainPass + salt);
		callback(null, hashedPass === validHash);
	}

	var getObjectId = function(id)
	{
		return new require('mongodb').ObjectID(id);
	}

	var findById = function(id, callback)
	{
		User.findOne({_id: getObjectId(id)},
		function(e, res) {
			if (e) callback(e)
			else callback(null, res)
		});
	}

	var findByMultipleFields = function(a, callback)
	{
		// this takes an array of name/val pairs to search against {fieldName : 'value'} //
		User.find( { $or : a } ).toArray(
			function(e, results) {
				if (e) callback(e)
				else callback(null, results)
			});
		}
