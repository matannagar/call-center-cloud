const mongoose = require('mongoose');

// Define the User schema
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

// Create the User model
const Call = mongoose.model('Call', userSchema);

module.exports = Call;
