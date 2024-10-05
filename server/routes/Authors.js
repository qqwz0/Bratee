const express = require('express');
const router = express.Router();
const { Authors } = require('../models');


router.get('/', async (req, res) => {
    const listOfAuthors = await Authors.findAll();
    res.json(listOfAuthors); 
});

router.post('/', async (req, res) => {
    const author = req.body;
    const createdAuthor = await Authors.create(author);
    res.json(createdAuthor);
});

module.exports = router