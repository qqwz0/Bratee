const express = require("express");
const router = express.Router();
const { Reviews } = require("../models");
const { validateToken } = require('../middleware/AuthMiddleware')

router.get('/:bookId', async (req, res) => {
    const bookId = req.params.bookId;
    const reviews = await Reviews.findAll({where: { BookId: bookId }});
    res.json(reviews);
});

router.post('/', validateToken, async (req, res) => {
    const review = req.body;
    const nickname = req.user.nickname
    review.nickname = nickname;
    await Reviews.create(review);
    res.json(review);
});

module.exports = router;