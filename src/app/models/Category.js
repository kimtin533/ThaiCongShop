const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');

mongoose.plugin(slug);
mongoose.plugin(mongooseDelete, {overrideMethods: 'all'});
const Category = new Schema({
    name: {type: String}
});

module.exports =  mongoose.model('Category', Category);