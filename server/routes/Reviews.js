const express = require("express");
const router = express.Router();
const { Reviews } = require("../models");

router.get('/:bookId', async (req, res) => {
    const bookId = req.params.bookId;
    const reviews = await Reviews.findAll({where: { BookId: bookId }});
    res.json(reviews);
});

router.post('/', async (req, res) => {
    const review = req.body;
    await Reviews.create(review);
    res.json(review);
});

module.exports = router;