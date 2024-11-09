const express = require("express");
const router = express.Router();
const { Reviews, Books, Users } = require("../models");
const { validateToken } = require('../middleware/AuthMiddleware')

router.get('/:bookId', async (req, res) => {
    const { bookId } = req.params;
    try {
        const reviews = await Reviews.findAll({
            where: { BookId: bookId },
            include: [{ model: Users, attributes: ['nickname', 'profilePicture'] }]
        });
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ error: "Failed to fetch reviews." });
    }
});

router.post('/', validateToken, async (req, res) => {
    const { review_text, rating, BookId } = req.body; // Ensure BookId is extracted from the request body
    const userId = req.user.id;
    const nickname = req.user.nickname; // Get nickname from the validated token

    if (!BookId) {
        return res.status(400).json({ error: "BookId is required." });
    }

    try {
        // Create the review with UserId, BookId, and nickname
        const newReview = await Reviews.create({
            review_text,
            rating,
            BookId,
            UserId: userId,
            nickname
        });

        // Fetch the newly created review, including associated User data
        const completeReview = await Reviews.findOne({
            where: { id: newReview.id },
            include: [{ model: Users, attributes: ['nickname', 'profilePicture'] }]
        });

        res.json(completeReview);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ error: "Error creating review" });
    }
});

router.get('/byUserId/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const reviewsByUser = await Reviews.findAll({
            where: { UserId: userId }, // Assuming Reviews model has a UserId column
            include: [{
                model: Books,
                attributes: ['title', 'cover']
            }]
        });

        if (!reviewsByUser.length) {
            return res.status(404).json({ error: 'No reviews found for this user' });
        }

        res.json(reviewsByUser);
    } catch (error) {
        console.error("Error fetching reviews by user ID:", error);
        res.status(500).json({ error: 'Error fetching reviews by user ID' });
    }
});

router.delete('/:id', validateToken, async (req, res) => {
    const reviewId = req.params.id;
    const userId = req.user.id; // Get the user ID from the validated token

    try {
        // Find the review by ID
        const review = await Reviews.findOne({ where: { id: reviewId } });

        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Check if the authenticated user is the owner of the review
        if (review.UserId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this review' });
        }

        // Delete the review
        await review.destroy();

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ error: 'Error deleting review' });
    }
});


module.exports = router;