const express = require('express');
const router = express.Router();
const { Books, Authors, Genres, Users } = require('../models');
const { validateToken } = require('../middleware/AuthMiddleware')
const { Op, fn, col } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('../models');

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
        // Check if 'isAdmin' is passed as a query parameter
        const { isAdmin } = req.query;

        // Set the status filter based on the presence of 'isAdmin'
        const statusFilter = isAdmin ? ['pending'] : ['approved', 'pending-update'];

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

router.get('/updated-books', async (req, res) => {
    try {
        // Fetch all books with the "updatedata" status
        const updatedBooks = await Books.findAll({
            where: { status: 'updatedata' },
            attributes: ['id', 'title', 'description', 'cover', 'updated_book_id', 'UserId'], // Include updated_book_id to check
            include: [
                {
                    model: Users,
                    attributes: ['email'],  // Ensure email is included
                }
            ]
        });

        const updatedBooksWithOriginal = await Promise.all(updatedBooks.map(async (updatedBook) => {
            // For each "updatedata" book, find the original book using the updated_book_id field
            const originalBook = await Books.findByPk(updatedBook.updated_book_id, {
                attributes: ['title', 'description', 'cover']
            });

            console.log(updatedBook.User); 

            return {
                updatedBookData: {
                    id: updatedBook.id,
                    title: updatedBook.title,
                    description: updatedBook.description,
                    cover: updatedBook.cover,
                    email: updatedBook.Users ? updatedBook.Users.dataValues.email : null,
                    userid: updatedBook.UserId
                },
                originalBookData: originalBook ? {
                    title: originalBook.title,
                    description: originalBook.description,
                    cover: originalBook.cover,
                } : null
            };
        }));

        res.json(updatedBooksWithOriginal);
    } catch (error) {
        console.error("Error fetching updated books:", error);
        res.status(500).json({ error: 'Error fetching updated books' });
    }
});


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

router.get('/byUserId/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const booksByUser = await Books.findAll({
            where: {
                UserId: userId, // Filter books by UserId
                status: { [Sequelize.Op.ne]: 'updatedata' } // Exclude books with status 'updatedata'
            },
            attributes: ['id', 'title', 'cover', 'createdAt', 'description', 'rating', 'status', 'UserId'], // Include necessary attributes and status
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
    const updatedFields = req.body; // Contains form data excluding file

    try {
        // Define the cover path if a new file is uploaded
        const coverPath = req.file ? `covers/${req.file.filename}` : updatedFields.cover;

        // Create a new book entry with updated fields and 'rejected' status
        const newBook = await Books.create({
            title: updatedFields.title,
            description: updatedFields.description,
            cover: coverPath,
            status: 'updatedata',
            UserId: updatedFields.UserId, // Dummy user ID
            GenreId: 1, // Dummy genre ID
            updated_book_id: id
        });

        await Books.update(
            { status: 'pending-update' },
            { where: { id } }
        );

        res.status(200).json({ message: 'Update request submitted', updatedBookId: newBook.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error processing update request' });
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

router.put('/approve-update/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Received ID for approval:', id);

    try {
        
        // Step 1: Find the book with status 'updatedata' by the provided ID
        const updatedBook = await Books.findOne({ where: { id, status: 'updatedata' } });

        if (!updatedBook) {
            return res.status(404).json({ error: 'Book with update data not found' });
        }

        // Step 2: Find the original book using the updated_book_id
        const originalBook = await Books.findOne({ where: { id: updatedBook.updated_book_id } });

        if (!originalBook) {
            return res.status(404).json({ error: 'Original book not found' });
        }

        // Step 3: Update the original book with the new fields from the updated book
        await Books.update(
            {
                title: updatedBook.title,
                description: updatedBook.description,
                cover: updatedBook.cover,
                status: 'approved' // Set the original book's status to 'approved' (or whatever status you want)
            },
            { where: { id: originalBook.id } }
        );

        // Step 4: Delete the updated book with status 'updatedata'
        await Books.destroy({ where: { id: updatedBook.id } });

        res.status(200).json({ message: 'Update applied successfully and update data book deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error applying update' });
    }
});

router.delete('/reject-update/:id', async (req, res) => {
    const { id } = req.params;
    console.log('Received ID for rejection:', id);

    try {
        // Find the book with the status 'updatedata' by the provided ID
        const updatedBook = await Books.findOne({ where: { id, status: 'updatedata' } });

        if (!updatedBook) {
            return res.status(404).json({ error: 'Book with update data not found' });
        }

        // Delete the book with status 'updatedata'
        await Books.destroy({ where: { id: updatedBook.id } });

        res.status(200).json({ message: 'Book update rejected and update data deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error rejecting update' });
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