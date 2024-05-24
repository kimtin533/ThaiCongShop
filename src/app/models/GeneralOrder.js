const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const Product = require('./Product')
const User = require('./User')
const Order = require('./Order');
const { types } = require('node-sass');

mongoose.plugin(slug);
mongoose.plugin(mongooseDelete, {overrideMethods: 'all'});
const GeneralOrder = new Schema({
    // product: {type: ObjectId, ref: Product},
    order: {type: [{ type: Schema.Types.ObjectId, ref: 'Order' }]},
    user: {type: ObjectId, ref: User},
    phone:{type: Number},
    name:{type: String},
    address:{type: String},
    price:{type: Number},
    status: { type: Number, default: 0 }
},{
    timestamps: true
});

module.exports =  mongoose.model('GeneralOrder', GeneralOrder);