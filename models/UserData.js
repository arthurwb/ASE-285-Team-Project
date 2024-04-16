const mongoose = require('mongoose');
const crypto = require('crypto');
const userDataSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  hash: String,
  salt: String
});

userDataSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

userDataSchema.methods.validatePassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};
module.exports = mongoose.model('Users',userDataSchema);

// https://medium.com/@diogo.fg.pinheiro/simple-to-do-list-app-with-node-js-and-mongodb-chapter-2-3780a1c5b039