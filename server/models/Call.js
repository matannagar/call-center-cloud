const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
    id: String,
    firstName: String,
    lastName: String,
    age: Number,
    gender: String,
    city: String,
    products: String,
    topic: String,
    call_start_time: Date,
});

// Create the User model
const Call = mongoose.model('Call', userSchema);

module.exports = Call;
