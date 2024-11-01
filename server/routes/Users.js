const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');

const { sign } = require('jsonwebtoken');

router.post('/', async (req, res) => {
    const { email, password, nickname } = req.body;

    try {
        // Hash the password
        const hash = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await Users.create({
            email: email,
            nickname: nickname,
            password: hash,
        });

        // Generate access token
        const accessToken = sign(
            { nickname: newUser.nickname, email: newUser.email, id: newUser.id },
            "WSoLeXRHwLYJsMBDyfrW"
        );

        console.log('New user created:', newUser);
        console.log('Access token generated:', accessToken);

        // Send the access token as response
        res.json({ accessToken, id: newUser.id });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: "An error occurred during registration." });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await Users.findOne({ where: { email: email } });

        // Check if user was found
        if (!user) {
            return res.status(404).json({ error: "User doesn't exist." });
        }

        // Compare the password
        const match = await bcrypt.compare(password, user.password);
        
        if (!match) {
            return res.status(401).json({ error: "Wrong email and password combination." });
        }

        const accessToken = sign({nickname: user.nickname, email: user.email, id: user.id}, "WSoLeXRHwLYJsMBDyfrW")
        res.json({accessToken, id: user.id});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: "An error occurred during login." });
    }
});

router.get('/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const user = await Users.findOne({ where: { id }});
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        res.json(user);
    } catch (error) {
        console.log("Error fetching user:", error);
        res.status(500).json({error: "An error occured while fetching this user."})
    }
});


module.exports = router;