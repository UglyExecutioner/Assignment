const mongoose = require('mongoose');
const userModel = mongoose.Schema({
    name: {type: String, required:true},
    userId: {type: Number, required:true},
    noOfOrders: {type: Number, default: 0}
});

module.exports = mongoose.model('User', userModel);