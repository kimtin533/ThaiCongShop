const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const slug = require('mongoose-slug-updater');
const mongooseDelete = require('mongoose-delete');
const Category = require('./Category');
mongoose.plugin(slug);
mongoose.plugin(mongooseDelete, { overrideMethods: 'all' });

const Product = new Schema({
    name: { type: String },
    description: { type: String },
    image: { type: String },
    price: { type: Number },
    amount: { type: Number },
    category: { type: ObjectId, ref: Category },
    slug: { type: String, slug: 'name', unique: true }
}, {
    timestamps: true
});

Product.index({ name: 'text' }, {
    weights: {
        name: 1 // Thiết lập trọng số cho trường name
    },
    name: 'TextIndex' // Tên index
});
module.exports = mongoose.model('Product', Product);