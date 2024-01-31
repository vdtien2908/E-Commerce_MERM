const mongoose = require('mongoose');

var categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['product', 'blog'],
            required: true,
        },
    },
    { timestamps: true }
);

//Export the model
module.exports = mongoose.model('Category', categorySchema);
