require('dotenv').config();
const { Kafka, Partitioners } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'call-center',
    brokers: [process.env.KAFKA_BROKER],
    ssl: true,
    sasl: {
        mechanism: 'scram-sha-512',
        username: process.env.KAFKA_USER,
        password: process.env.KAFKA_PASSWORD,
    },
});

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});

const topic = `${process.env.KAFKA_USER}-calls-topic`;

const connectProducer = async () => {
    await producer.connect(() => {
        console.log('Kafka producer connected!')
    }, (err) => {
        console.log('Problem connecting to Kafka', err)
    });
};

const disconnectProducer = async () => {
    await producer.disconnect(() => {
        console.log('Kafka producer disconnected!')
    }, (err) => {
        console.log('Problem disconnecting from Kafka', err)
    });
};

const produceMessage = async (message) => {
    await producer.send({
        topic: topic,
        messages: [{ value: message }],
    });
};

module.exports = {
    produceMessage,
    connectProducer,
    disconnectProducer
};
