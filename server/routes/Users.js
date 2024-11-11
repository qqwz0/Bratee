const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const { sign } = require('jsonwebtoken');

const client = new OAuth2Client('1091135261905-gms21fiehp0gok4ke1r2r23jrtmsoq6g.apps.googleusercontent.com');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'pfps');

        // Ensure directory exists
        fs.mkdir(dir, { recursive: true }, (err) => {
            if (err) {
                return cb(err);
            }
            cb(null, dir);
        });
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + path.extname(file.originalname); // Unique file name
        cb(null, uniqueSuffix); // Just return the unique filename
    }
});

const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 5000000 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper formate to upload')
    }
});

router.post('/', upload.single('profilePicture'), async (req, res) => {
    const { email, password, nickname } = req.body;
    const profilePicturePath = req.file ? `pfps/${req.file.filename}` : null;

    try {
        const hash = await bcrypt.hash(password, 10);

        const newUser = await Users.create({
            email: email,
            nickname: nickname,
            password: hash,
            profilePicture: profilePicturePath,
        });

        const accessToken = sign(
            { nickname: newUser.nickname, email: newUser.email, id: newUser.id },
            "WSoLeXRHwLYJsMBDyfrW"
        );

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

router.post('/google-signup', async (req, res) => {
    const { id_token } = req.body;

    try {
        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: '1091135261905-gms21fiehp0gok4ke1r2r23jrtmsoq6g.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
        });

        const { email, name } = ticket.getPayload(); // Get user details from token

        // Check if the user already exists
        let user = await Users.findOne({ where: { email: email } });

        // If the user exists, send an error response
        if (user) {
            return res.status(400).json({ error: "Email already exists. Please log in." });
        }

        // Create a new user
        user = await Users.create({
            email: email,
            nickname: name, // Customize this as needed
            password: 'N/A' // No password needed for social sign-in
        });

        // Generate access token
        const accessToken = sign({ nickname: user.nickname, email: user.email, id: user.id }, "WSoLeXRHwLYJsMBDyfrW");

        // Respond with access token and user ID
        res.json({ accessToken, id: user.id });
    } catch (error) {
        console.error('Google Sign-Up error:', error);
        res.status(500).json({ error: "An error occurred during Google Sign-Up." });
    }
});

// Route for logging in an existing user
router.post('/google-login', async (req, res) => {
    const { id_token } = req.body;

    try {
        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: '1091135261905-gms21fiehp0gok4ke1r2r23jrtmsoq6g.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
        });

        const { email } = ticket.getPayload(); // Get user details from token

        // Check if the user exists
        const user = await Users.findOne({ where: { email: email } });

        // If the user does not exist, send a goodbye response
        if (!user) {
            return res.status(404).json({ error: "User not found. Please sign up." });
        }

        // Generate access token
        const accessToken = sign({ nickname: user.nickname, email: user.email, id: user.id }, "WSoLeXRHwLYJsMBDyfrW");

        // Respond with access token and user ID
        res.json({ accessToken, id: user.id });
    } catch (error) {
        console.error('Google Login error:', error);
        res.status(500).json({ error: "An error occurred during Google Login." });
    }
});

router.put('/:id', upload.single('profilePicture'), async (req, res) => {
    const { nickname } = req.body;
    const userId = req.params.id;
    const profilePicturePath = req.file ? `pfps/${req.file.filename}` : null;

    try {
        // Build the fields to update, only including profilePicture if a file was uploaded
        const updatedFields = { nickname };
        if (profilePicturePath) {
            updatedFields.profilePicture = profilePicturePath;
        }

        // Update the user with the selected fields
        await Users.update(updatedFields, { where: { id: userId } });

        // Retrieve the updated user
        const updatedUser = await Users.findByPk(userId);

        // Return the full updated user information
        return res.json({
            message: 'User updated successfully',
            user: updatedUser, // This will include the full user information
        });
    } catch (error) {
        console.error('Update error:', error);
        return res.status(500).json({ error: "An error occurred while updating the user." });
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }

    // Generate a reset token and expiry time
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    // Save the token and expiry time to the user record
    await user.update({ resetToken, resetTokenExpiry });

    // Send email with token
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'bratee.kursova@gmail.com', // replace with your email
            pass: 'hell0w0r1d3'   // replace with your email password
        }
    });

    const mailOptions = {
        to: email,
        from: 'bratee.kursova@gmail.com',
        subject: 'Password Reset',
        text: `Please click on the following link to reset your password: 
               http://localhost:3000/reset-password/${resetToken}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Error sending email.' });
        }
        res.json({ message: 'Password reset email sent.' });
    });
});

router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await Users.findOne({ where: { resetToken: token, resetTokenExpiry: { [Op.gt]: Date.now() } } });

    if (!user) {
        return res.status(400).json({ error: "Token is invalid or has expired." });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        await user.update({ password: hash, resetToken: null, resetTokenExpiry: null });
        res.json({ message: "Password has been reset successfully." });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).json({ error: "Error resetting password." });
    }

    res.json({ message: "Password has been reset successfully." });
});


module.exports = router;