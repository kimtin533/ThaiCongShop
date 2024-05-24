const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const Product = require('./Product')
const User = require('./User')

mongoose.plugin(slug);
mongoose.plugin(mongooseDelete, {overrideMethods: 'all'});
const Cart = new Schema({
    product: {type: ObjectId, ref: Product},
    user: {type: ObjectId, ref: User},
    amount:{ type: Number}
});

module.exports =  mongoose.model('Cart', Cart);