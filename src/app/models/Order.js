const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const Product = require('./Product')
const GeneralOrder = require('./GeneralOrder')
const User = require('./User')

mongoose.plugin(slug);
mongoose.plugin(mongooseDelete, {overrideMethods: 'all'});
const Order = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    generalOrder: { type: Schema.Types.ObjectId, ref: 'GeneralOrder' },
    amount: { type: Number }
    
});

module.exports =  mongoose.model('Order', Order);