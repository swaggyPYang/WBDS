var mongoose = require('./mongoose');
var Schema = mongoose.mongoose.Schema;
var UserSchema = new Schema({
    // id: {type: String, default: '1'},
    name: String,
    mailbox: String,
    password: String
});

exports.getuser=mongoose.mongoose.model('users', UserSchema);