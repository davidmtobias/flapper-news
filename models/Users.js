var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken'); //npm install jsonwebtoken --save

var UserSchema = new mongoose.Schema({
  username: {type: String, lowercase: true, unique: true},
  hash: String,
  salt: String
});

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');

  //=== es estríctamente igual
  return this.hash === hash;
};


//Método para generar el toquen
UserSchema.methods.generateJWT = function() {

  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, 'SECRET');
};

//SECRET is used to sign our tokens. We're hard-coding it in this example, but it is strongly recommended
//that you use an environment variable for referencing the secret and keep it out of your codebase.


mongoose.model('User', UserSchema);
