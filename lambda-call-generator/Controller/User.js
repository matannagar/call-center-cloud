const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sequelize } = require('../configs/sqlConnection');
const { produceMessage, connectProducer, disconnectProducer } = require('../configs/kafkaConnection');
const { getRandomElement, calculateAge } = require('../utils/utils');

router.post('/users', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving users' });
    }
});

router.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findByPk(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving user' });
    }
});

router.put('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findByPk(userId);
        if (user) {
            await user.update(req.body);
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating user' });
    }
});

router.delete('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findByPk(userId);
        if (user) {
            await user.destroy();
            res.status(204).end();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting user' });
    }
});

router.post('/generate-calls', async (req, res) => {
    try {
        const users = await User.findAll({
            order: sequelize.random(),
            limit: 100
        });

        await connectProducer();
        await Promise.all(users.map(async (user) => {
            const call = {
                user_id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                age: calculateAge(user.birthday),
                gender: user.gender,
                city: user.city,
                products: user.products,
                topic: getRandomElement(['joining', 'service', 'complaint', 'disconnecting']),
                call_start_time: new Date(),
            };
            await produceMessage(JSON.stringify(call));
        }));

        await disconnectProducer();

        res.status(200).json({ message: 'Calls generated successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error generating calls' });
    }
})

module.exports = router;
