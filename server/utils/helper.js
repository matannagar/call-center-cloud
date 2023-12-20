const Call = require('../models/Call.js');
const uuidv4 = require('uuid').v4;

function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);

    // Set the time to midnight
    midnight.setHours(24, 0, 0, 0);

    // Calculate the time difference between now and midnight
    const timeUntilMidnight = midnight - now;

    // Convert the time difference to seconds
    const secondsUntilMidnight = Math.floor(timeUntilMidnight / 1000);

    return secondsUntilMidnight;
}

async function generateCallEntity(callData) {
    const { first_name, last_name, age, gender, city, products, topic, call_start_time } = callData;
    const newCall = new Call({
        id: uuidv4(),
        firstName: first_name,
        lastName: last_name,
        age: age,
        gender: gender,
        city: city,
        products: products,
        topic: topic,
        callStartTime: new Date(call_start_time),
    });
    try {
        await newCall.save();
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    getTimeUntilMidnight,
    generateCallEntity
};
