const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);
mongoose.plugin(mongooseDelete, {overrideMethods: 'all'});
const User = new Schema({
    username: {type: String},
    password: {type: String},
    role: {type: Number},
    display_name: {type: String},
    admin: {type: Boolean},
});

module.exports =  mongoose.model('User', User);