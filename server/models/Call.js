const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    city: { type: String, required: true },
    products: { type: String, required: true },
    topic: { type: String, required: true },
    callStartTime: { type: Date, default: Date.now, required: true },
});

const Call = mongoose.model('Call', userSchema);

module.exports = Call;
