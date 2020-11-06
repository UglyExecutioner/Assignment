const mongoose = require('mongoose');
const orderModel = mongoose.Schema({
    orderId: {type: Number, required:true},
    userId: {type: Number, required:true},
    subtotal: {type: Number, required: true},
    date: {type: Date, required:true}
});

module.exports = mongoose.model('Order', orderModel);