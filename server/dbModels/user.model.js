var mongoose = require('mongoose');

var user = new mongoose.Schema({
	    fname     : String,
			mname			: String,
      lname     : String,
			NIC	      : String,
			dob				: String,
			address		: String,
      email     : String,
	    type	    : String,
	    username  : String,
      password  : String

},{collection: 'user'});
//console.log(user);

module.exports = mongoose.model('user', user);
