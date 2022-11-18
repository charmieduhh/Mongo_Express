const mongoose = require('mongoose');
const { Schema } = mongoose

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum: ['fruit', 'vegetable', 'dairy']
    },
    farm: {
        type: Schema.Types.ObjectId,
        ref: 'Farm' //references farm model
    }
})

const Product = mongoose.model('Product', productSchema); //to require model in index.js

module.exports = Product; //imports mongoose model to allow use somewhere else 