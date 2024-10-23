const express = require('express');
const router = express.Router();
const { Books, Authors, Genres } = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'covers');

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
    limits: { fileSize: 1000000000 },
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


router.get('/', async (req, res) => {
    try {
        const listOfBooks = await Books.findAll({
            attributes: ['id', 'title', 'cover', 'AuthorId'], // Only include necessary book attributes
            include: [{
                model: Authors,
                attributes: ['full_name'], // Include only the full name of the author
            }],
        });
        res.json(listOfBooks);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: 'Error fetching books' });
    }
});

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id;
    try {
        // Find the book by primary key and include the Author and Genre
        const book = await Books.findByPk(id, {
            include: [
                {
                    model: Authors,
                    attributes: ['id', 'full_name'], // Include author ID and full name
                },
                {
                    model: Genres, // Assuming you have a Genres model
                    attributes: ['name'], // Include genre ID and name
                }
            ]
        });

        // Check if book exists
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        console.error("Error fetching book details:", error);
        res.status(500).json({ error: 'Error fetching book details' });
    }
});

router.post('/', upload.single('cover'), async (req, res) => {
    try {
        const { title, description, AuthorId, GenreId } = req.body;

        // If an image is uploaded, get the file path
        const coverPath = req.file ? `covers/${req.file.filename}` : null;

        // Create a new book entry in the database
        const newBook = await Books.create({
            title,
            description,
            AuthorId,
            GenreId,
            cover: coverPath // Save the image path to the database
        });

        return res.status(201).json(newBook);
    } catch (error) {
        console.error("Error creating book:", error);
        return res.status(500).json({ error: 'Error creating book' });
    }
});

module.exports = router