const express = require('express');
const router = express.Router();
const { Genres } = require('../models');


router.get('/', async (req, res) => {
    const listOfGenres = await Genres.findAll();
    res.json(listOfGenres);
});

router.post('/', async (req, res) => {
    const genre = req.body;
    const createdGenre = await Genres.create(genre);
    res.json(createdGenre);
});

module.exports = router