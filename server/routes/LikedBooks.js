const express = require('express');
const router = express.Router();
const { LikedBooks, Books, Users, Authors } = require('../models');

// Endpoint for liking a book
router.post('/', async (req, res) => {
  const { userId, bookId, category } = req.body; // Extract category from the request body

  try {
    // Check if the book and user exist
    const book = await Books.findByPk(bookId);
    const user = await Users.findByPk(userId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Validate the category
    const validCategories = ['currently reading', 'in plan', 'abandoned', 'completed', 'favourite'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid or missing category.' });
    }

    // Check if the like already exists
    const existingLike = await LikedBooks.findOne({
      where: { userId, bookId },
    });

    if (existingLike) {
      // If the like already exists, update the category
      await existingLike.update({ category });
      return res.status(200).json({ message: 'Book like updated successfully!' });
    }

    // If no existing like, create a new like entry
    await LikedBooks.create({ userId, bookId, category });
    res.status(201).json({ message: 'Book liked successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to like the book.', error });
  }
});
  

  // Endpoint to get all books liked by a specific user
  // router.get('/:userId', async (req, res) => {
  //   const { userId } = req.params;
  
  //   try {
  //     // Check if the user exists
  //     const user = await Users.findByPk(userId);
  //     if (!user) {
  //       return res.status(404).json({ message: 'User not found.' });
  //     }
  
  //     // Retrieve books liked by the user through the 'likedBooks' alias
  //     const likedBooks = await user.getLikedBooks();
  
  //     res.status(200).json({ likedBooks });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Failed to retrieve liked books.', error });
  //   }
  // });
  
  router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { category } = req.query; // Get the category from the query parameters
  
    try {
        // Check if the user exists
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
  
        // Set up the query filter based on the category if it's provided
        const filter = { userId };
        if (category) {
            filter.category = category; // Add category to filter if it's specified
        }
  
        // Retrieve books liked by the user, filtered by category if applicable
        const likedBooks = await LikedBooks.findAll({
            where: filter,
            include: [
                {
                    model: Books,
                    as: 'book',
                    attributes: ['id','title', 'description', 'cover', 'rating', 'createdAt', 'updatedAt'],
                    include: [
                        {
                            model: Authors,
                            attributes: ['full_name'], // Include author full name
                        }
                    ]
                }
            ]
        });
  
        res.status(200).json({ likedBooks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve liked books.', error });
    }
});

  

  router.delete('/', async (req, res) => {
    const { userId, bookId, category } = req.body;
  
    try {
      // Check if the book and user exist
      const book = await Books.findByPk(bookId);
      const user = await Users.findByPk(userId);
  
      if (!book) {
        return res.status(404).json({ message: 'Book not found.' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Validate the category
      const validCategories = ['currently reading', 'in plan', 'abandoned', 'completed', 'favourite'];
      if (!category || !validCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid or missing category.' });
      }
  
      // Find the existing like to remove
      const existingLike = await LikedBooks.findOne({
        where: { userId, bookId, category },
      });
  
      if (!existingLike) {
        return res.status(404).json({ message: 'Like not found for this category.' });
      }
  
      // Delete the like entry
      await existingLike.destroy();
      res.status(200).json({ message: 'Category removed successfully!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to remove the liked book category.', error });
    }
  });

  router.get('/:userId/:bookId', async (req, res) => {
    const { userId, bookId } = req.params;
    
  
    try {
      // Check if the user exists
      const user = await Users.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Check if the book exists
      const book = await Books.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ message: `Book not found.${bookId}` });
      }
  
      // Retrieve the liked book entry for the specified user and book
      const likedBook = await LikedBooks.findOne({
        where: { userId, bookId },
        include: [
          {
            model: Books,
            as: 'book', // Use the alias defined in the association
            attributes: ['title', 'description', 'cover', 'rating'] // Specify what fields to include from the Books model
          },
          {
            model: Users,
            as: 'user', // Include user data if needed
            attributes: ['id', 'nickname']
          }
        ]
      });
  
      if (!likedBook) {
        return res.status(404).json({ message: 'Book not found in user’s liked list.' });
      }
  
      res.status(200).json({ likedBook });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to retrieve liked book.', error });
    }
  });

  
  module.exports = router;