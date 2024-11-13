const express = require('express');
const router = express.Router();
const { Books, Authors, Genres, Users } = require('../models');
const { validateToken } = require('../middleware/AuthMiddleware')
const { Op, fn, col } = require('sequelize');
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


// router.get('/', async (req, res) => {
//     try {
//         const listOfBooks = await Books.findAll({
//             attributes: ['id', 'title', 'cover', 'AuthorId', 'rating', 'createdAt'], // Only include necessary book attributes
//             include: [{
//                 model: Authors,
//                 attributes: ['full_name'], // Include only the full name of the author
//             }],
//         });
//         res.json(listOfBooks);
//     } catch (error) {
//         console.error("Error fetching books:", error);
//         res.status(500).json({ error: 'Error fetching books' });
//     }
// });

router.get('/', async (req, res) => {
    try {
        // Check if 'isAdmin' is passed as a query parameter
        const { isAdmin } = req.query;

        // Set the status filter based on the presence of 'isAdmin'
        const statusFilter = isAdmin ? 'pending' : 'approved';

        const listOfBooks = await Books.findAll({
            where: { status: statusFilter }, // Use the dynamic status filter
            include: [
                {
                    model: Authors,
                    attributes: ['id', 'full_name'],
                },
                {
                    model: Genres,
                    attributes: ['name'],
                },
                {
                    model: Users,
                    attributes: ['email'],
                }
            ]
        });
        res.json(listOfBooks);
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ error: 'Error fetching books' });
    }
});

// router.get('/byId/:id', async (req, res) => {
//     const id = req.params.id;
//     try {
//         // Find the book by primary key and include the Author and Genre
//         const book = await Books.findByPk(id, {
//             include: [
//                 {
//                     model: Authors,
//                     attributes: ['id', 'full_name'], // Include author ID and full name
//                 },
//                 {
//                     model: Genres, // Assuming you have a Genres model
//                     attributes: ['name'], // Include genre ID and name
//                 }
//             ]
//         });

//         // Check if book exists
//         if (!book) {
//             return res.status(404).json({ error: 'Book not found' });
//         }

//         res.json(book);
//     } catch (error) {
//         console.error("Error fetching book details:", error);
//         res.status(500).json({ error: 'Error fetching book details' });
//     }
// });

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const book = await Books.findOne({
            where: { id, status: 'approved' }, // Only find if status is approved
            include: [
                {
                    model: Authors,
                    attributes: ['id', 'full_name'],
                },
                {
                    model: Genres,
                    attributes: ['name'],
                }
            ]
        });

        if (!book) {
            return res.status(404).json({ error: 'Book not found or not approved' });
        }

        res.json(book);
    } catch (error) {
        console.error("Error fetching book details:", error);
        res.status(500).json({ error: 'Error fetching book details' });
    }
});

// router.get('/byUserId/:userId', async (req, res) => {
//     const userId = req.params.userId;
//     try {
//         const booksByUser = await Books.findAll({
//             where: { UserId: userId }, // Filter books by UserId
//             attributes: ['id', 'title', 'cover', 'CreatedAt', 'description', 'rating' ], // Include necessary book attributes
//             include: [{
//                 model: Authors,
//                 attributes: ['full_name'], // Include only the full name of the author
//             }],
//         });

//         // Check if books were found
//         if (!booksByUser.length) {
//             return res.status(404).json({ error: 'No books found for this user' });
//         }

//         res.json(booksByUser);
//     } catch (error) {
//         console.error("Error fetching books by user ID:", error);
//         res.status(500).json({ error: 'Error fetching books by user ID' });
//     }
// });

router.get('/byUserId/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const booksByUser = await Books.findAll({
            where: { UserId: userId }, // Filter books by UserId
            attributes: ['id', 'title', 'cover', 'createdAt', 'description', 'rating', 'status'], // Include necessary attributes and status
            include: [{
                model: Authors,
                attributes: ['full_name'], // Include only the full name of the author
            }],
        });

        // Check if books were found
        if (!booksByUser.length) {
            return res.status(404).json({ error: 'No books found for this user' });
        }

        res.json(booksByUser);
    } catch (error) {
        console.error("Error fetching books by user ID:", error);
        res.status(500).json({ error: 'Error fetching books by user ID' });
    }
});

// router.post('/', validateToken, upload.single('cover'), async (req, res) => {
//     try {
//         const { title, description, AuthorId, GenreId } = req.body;
//         const userId = req.user.id;

//         // If an image is uploaded, get the file path
//         const coverPath = req.file ? `covers/${req.file.filename}` : null;

//         // Create a new book entry in the database
//         const newBook = await Books.create({
//             title,
//             description,
//             AuthorId,
//             GenreId,
//             cover: coverPath,
//             UserId: userId // Save the image path to the database
//         });

//         return res.status(201).json(newBook);
//     } catch (error) {
//         console.error("Error creating book:", error);
//         return res.status(500).json({ error: 'Error creating book' });
//     }
// });

router.post('/', validateToken, upload.single('cover'), async (req, res) => {
    try {
        const { title, description, AuthorId, GenreId, status = 'pending' } = req.body; // Use default 'pending' if status is not provided
        const userId = req.user.id;

        const coverPath = req.file ? `covers/${req.file.filename}` : null;

        const newBook = await Books.create({
            title,
            description,
            AuthorId,
            GenreId,
            cover: coverPath,
            UserId: userId,
            status // Store the book's status
        });

        return res.status(201).json(newBook);
    } catch (error) {
        console.error("Error creating book:", error);
        return res.status(500).json({ error: 'Error creating book' });
    }
});

router.put('/:id', upload.single('cover'), async (req, res) => {
    const { id } = req.params;
    const { title, description, genreId, authorId } = req.body;
    
    try {
        const book = await Books.findByPk(id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // Handle cover path if a new file is uploaded
        const coverPath = req.file ? `covers/${req.file.filename}` : book.cover;

        await book.update({
            title,
            description,
            cover: coverPath,
            genreId,
            authorId,
            status: 'pending-update' 
        });

        return res.status(200).json({ message: 'Book updated successfully', book });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while updating the book' });
    }
});

// Delete Book API
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Books.findByPk(id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Delete the book
        await book.destroy();
        return res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while deleting the book' });
    }
});

router.put("/rating/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { rating } = req.body;
  
      // Update the rating in your database (adjust for your database)
      await Books.update({ rating }, { where: { id } });
  
      res.status(200).json({ message: "Rating updated successfully", rating: rating });
    } catch (err) {
      res.status(500).json({ error: "Failed to update rating" });
    }
  });

//   router.get('/search', async (req, res) => {
//     const { title } = req.query;

//     try {
//         // Use LOWER function for case-insensitive matching on title
//         const books = await Books.findAll({
//             where: {
//                 title: {
//                     [Op.like]: fn('LOWER', `%${title.toLowerCase()}%`)  // Case-insensitive partial matching
//                 }
//             },
//             include: [{
//                 model: Authors,
//                 attributes: ['full_name'],
//             }],
//         });

//         // Check if books were found
//         if (books.length === 0) {
//             return res.status(404).json({ error: 'No books found with the specified title' });
//         }

//         res.json(books);
//     } catch (error) {
//         console.error("Error searching for books:", error);
//         res.status(500).json({ error: 'Error searching for books' });
//     }
// });

router.get('/search', async (req, res) => {
    const { title } = req.query;

    try {
        const books = await Books.findAll({
            where: {
                title: {
                    [Op.like]: fn('LOWER', `%${title.toLowerCase()}%`)
                },
                status: 'approved' // Only search in approved books
            },
            include: [{
                model: Authors,
                attributes: ['full_name'],
            }],
        });

        if (books.length === 0) {
            return res.status(404).json({ error: 'No approved books found with the specified title' });
        }

        res.json(books);
    } catch (error) {
        console.error("Error searching for books:", error);
        res.status(500).json({ error: 'Error searching for books' });
    }
});

router.post('/approve/:bookId', async (req, res) => {
    const { bookId } = req.params;
    try {
        const book = await Books.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Update status to 'approved'
        await book.update({ status: 'approved' });
        res.json({ message: 'Book approved successfully' });
    } catch (error) {
        console.error('Error approving book:', error);
        res.status(500).json({ error: 'Error approving book' });
    }
});

// Reject book (updates status to 'rejected')
router.post('/reject/:bookId', async (req, res) => {
    const { bookId } = req.params;
    try {
        const book = await Books.findByPk(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Update status to 'rejected'
        await book.update({ status: 'rejected' });
        res.json({ message: 'Book rejected successfully' });
    } catch (error) {
        console.error('Error rejecting book:', error);
        res.status(500).json({ error: 'Error rejecting book' });
    }
});

module.exports = router;

module.exports = router