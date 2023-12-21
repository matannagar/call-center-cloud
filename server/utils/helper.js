const Call = require('../models/Call.js');
const uuidv4 = require('uuid').v4;

function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);

    midnight.setHours(24, 0, 0, 0);

    const timeUntilMidnight = midnight - now;
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

const generateKeyForRedis = (currentDate) => {
    const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfTheWeek[currentDate.getDay()];
    const key = `calls:${dayOfWeek}`;

    return key;
}

module.exports = {
    getTimeUntilMidnight,
    generateCallEntity,
    generateKeyForRedis
};
