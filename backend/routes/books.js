const express = require('express');
const router = express.Router();

// Sample book data (in real application, this would come from a database)
const books = [
    {
        id: 1,
        title: 'The AI Revolution',
        author: 'Dr. Alan Turing',
        category: 'science',
        rating: 4.8,
        year: 2023,
        description: 'A comprehensive guide to artificial intelligence and its impact on society.',
        pages: 320,
        language: 'English',
        isbn: '978-1234567890'
    },
    {
        id: 2,
        title: 'Digital Transformation',
        author: 'Sarah Johnson',
        category: 'technology',
        rating: 4.5,
        year: 2022,
        description: 'Exploring how digital technologies are reshaping businesses and industries.',
        pages: 280,
        language: 'English',
        isbn: '978-0987654321'
    }
];

// GET /api/books - Get all books with optional filtering
router.get('/', (req, res) => {
    const { category, search, page = 1, limit = 10 } = req.query;
    
    let filteredBooks = [...books];
    
    // Filter by category
    if (category && category !== 'all') {
        filteredBooks = filteredBooks.filter(book => 
            book.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Search in title or author
    if (search) {
        const searchTerm = search.toLowerCase();
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        );
    }
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        books: paginatedBooks,
        total: filteredBooks.length,
        page: parseInt(page),
        totalPages: Math.ceil(filteredBooks.length / limit)
    });
});

// GET /api/books/:id - Get book by ID
router.get('/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        return res.status(404).json({
            success: false,
            message: 'Book not found'
        });
    }
    
    res.json({
        success: true,
        book
    });
});

// POST /api/books/search - Advanced search
router.post('/search', (req, res) => {
    const { query, filters = {} } = req.body;
    
    // In a real application, this would use AI/NLP for semantic search
    let results = [...books];
    
    if (query) {
        const searchTerm = query.toLowerCase();
        results = results.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply additional filters
    if (filters.category) {
        results = results.filter(book => book.category === filters.category);
    }
    
    if (filters.minRating) {
        results = results.filter(book => book.rating >= filters.minRating);
    }
    
    if (filters.year) {
        results = results.filter(book => book.year === parseInt(filters.year));
    }
    
    res.json({
        success: true,
        results,
        count: results.length
    });
});

// POST /api/books - Add new book (admin functionality)
router.post('/', (req, res) => {
    const { title, author, category, description, year, pages, language, isbn } = req.body;
    
    // Validation
    if (!title || !author || !category) {
        return res.status(400).json({
            success: false,
            message: 'Title, author, and category are required'
        });
    }
    
    const newBook = {
        id: books.length + 1,
        title,
        author,
        category,
        description: description || '',
        year: year || new Date().getFullYear(),
        pages: pages || 0,
        language: language || 'English',
        isbn: isbn || '',
        rating: 0, // Initial rating
        createdAt: new Date()
    };
    
    books.push(newBook);
    
    res.status(201).json({
        success: true,
        message: 'Book added successfully',
        book: newBook
    });
});

module.exports = router;