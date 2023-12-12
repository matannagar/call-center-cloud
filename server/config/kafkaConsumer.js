require('dotenv').config();
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'call-center-server',
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
    sasl: {
        mechanism: 'scram-sha-512',
        username: process.env.KAFKA_USER,
        password: process.env.KAFKA_PASSWORD,
    },
})


const consumer = kafka.consumer({
    groupId: `${process.env.KAFKA_TOPIC}-call-center-group`
})

const connectConsumer = async () => {
    await consumer.connect(() => {
        console.log('Kafka consumer connected!');
    }, err => console.log('Kafka consumer failed to connect', err));
}

const disconnectConsumer = async () => {
    await consumer.disconnect(() => {
        console.log('Kafka consumer disconnected!');
    }, err => console.log('Kafka consumer failed to disconnect', err));
}

const run = async (eachMessageFunction) => {
    await consumer.connect();
    await consumer.subscribe({ topic: `${process.env.KAFKA_TOPIC}-calls-topic`, fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ message }) => {
            await eachMessageFunction(message);
        },
    });
};

module.exports = {
    connectConsumer,
    disconnectConsumer,
    run
}
