const express = require('express');
const router = express.Router();

// Sample book data (in real application, this would come from a database)
let books = [
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
        isbn: '978-1234567890',
        createdAt: new Date('2023-01-15')
    },
     
        {
        id: 2,
        title: 'Digital Age Economics',
        author: 'Michael Chen',
        category: 'economics',
        rating: 4.3,
        year: 2023,
        description: 'Economic theories and practices in the digital era.',
        pages: 310,
        language: 'English',
        isbn: '978-1122334455',
        createdAt: new Date('2023-06-10')
    }
      {
        id: 3,
        title: 'The AI Revolution',
        author: 'Dr. Alan Turing',
        category: 'science',
        rating: 4.8,
        year: 2023,
        description: 'A comprehensive guide to artificial intelligence and its impact on society.',
        pages: 320,
        language: 'English',
        isbn: '978-1234567890',
        createdAt: new Date('2023-01-15')
    },
    {
        id: 4,
        title: 'Digital Transformation',
        author: 'Sarah Johnson',
        category: 'technology',
        rating: 4.5,
        year: 2022,
        description: 'Exploring how digital technologies are reshaping businesses and industries.',
        pages: 280,
        language: 'English',
        isbn: '978-0987654321',
        createdAt: new Date('2022-03-20')
    },
    {
        id: 5,
        title: 'Digital Age Economics',
        author: 'Michael Chen',
        category: 'economics',
        rating: 4.3,
        year: 2023,
        description: 'Economic theories and practices in the digital era.',
        pages: 310,
        language: 'English',
        isbn: '978-1122334455',
        createdAt: new Date('2023-06-10')
    }
];

// Helper function to generate unique ID
const generateId = () => {
    return books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
};

// GET /api/books - Get all books with optional filtering and sorting
router.get('/', (req, res) => {
    const { 
        category, 
        search, 
        page = 1, 
        limit = 10, 
        sortBy = 'id',
        sortOrder = 'asc'
    } = req.query;
    
    let filteredBooks = [...books];
    
    // Filter by category
    if (category && category !== 'all') {
        filteredBooks = filteredBooks.filter(book => 
            book.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    // Search in title, author, or description
    if (search) {
        const searchTerm = search.toLowerCase();
        filteredBooks = filteredBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sorting
    filteredBooks.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        // Handle string comparison
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedBooks = filteredBooks.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        books: paginatedBooks,
        total: filteredBooks.length,
        page: parseInt(page),
        totalPages: Math.ceil(filteredBooks.length / limit),
        hasNextPage: endIndex < filteredBooks.length,
        hasPrevPage: startIndex > 0
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
    const { query, filters = {}, page = 1, limit = 10 } = req.body;
    
    let results = [...books];
    
    // Text search
    if (query) {
        const searchTerm = query.toLowerCase();
        results = results.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply additional filters
    if (filters.category && filters.category.length > 0) {
        results = results.filter(book => filters.category.includes(book.category));
    }
    
    if (filters.minRating) {
        results = results.filter(book => book.rating >= parseFloat(filters.minRating));
    }
    
    if (filters.yearRange) {
        const { start, end } = filters.yearRange;
        results = results.filter(book => {
            if (start && end) {
                return book.year >= parseInt(start) && book.year <= parseInt(end);
            } else if (start) {
                return book.year >= parseInt(start);
            } else if (end) {
                return book.year <= parseInt(end);
            }
            return true;
        });
    }
    
    // Pagination for search results
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedResults = results.slice(startIndex, endIndex);
    
    res.json({
        success: true,
        results: paginatedResults,
        total: results.length,
        page: parseInt(page),
        totalPages: Math.ceil(results.length / limit)
    });
});

// POST /api/books - Add new book
router.post('/', (req, res) => {
    const { title, author, category, description, year, pages, language, isbn } = req.body;
    
    // Validation
    if (!title || !author || !category) {
        return res.status(400).json({
            success: false,
            message: 'Title, author, and category are required'
        });
    }
    
    // Check if ISBN already exists
    if (isbn && books.some(book => book.isbn === isbn)) {
        return res.status(400).json({
            success: false,
            message: 'Book with this ISBN already exists'
        });
    }
    
    const newBook = {
        id: generateId(),
        title,
        author,
        category,
        description: description || '',
        year: year ? parseInt(year) : new Date().getFullYear(),
        pages: pages ? parseInt(pages) : 0,
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

// PUT /api/books/:id - Update book
router.put('/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);
    
    if (bookIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Book not found'
        });
    }
    
    const { title, author, category, description, year, pages, language, isbn, rating } = req.body;
    
    // Check if ISBN is being changed and if it already exists (excluding current book)
    if (isbn && isbn !== books[bookIndex].isbn) {
        const isbnExists = books.some(book => book.isbn === isbn && book.id !== bookId);
        if (isbnExists) {
            return res.status(400).json({
                success: false,
                message: 'Another book with this ISBN already exists'
            });
        }
    }
    
    // Update book
    const updatedBook = {
        ...books[bookIndex],
        title: title || books[bookIndex].title,
        author: author || books[bookIndex].author,
        category: category || books[bookIndex].category,
        description: description || books[bookIndex].description,
        year: year ? parseInt(year) : books[bookIndex].year,
        pages: pages ? parseInt(pages) : books[bookIndex].pages,
        language: language || books[bookIndex].language,
        isbn: isbn || books[bookIndex].isbn,
        rating: rating ? parseFloat(rating) : books[bookIndex].rating,
        updatedAt: new Date()
    };
    
    books[bookIndex] = updatedBook;
    
    res.json({
        success: true,
        message: 'Book updated successfully',
        book: updatedBook
    });
});

// DELETE /api/books/:id - Delete book
router.delete('/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const initialLength = books.length;
    
    books = books.filter(book => book.id !== bookId);
    
    if (books.length === initialLength) {
        return res.status(404).json({
            success: false,
            message: 'Book not found'
        });
    }
    
    res.json({
        success: true,
        message: 'Book deleted successfully'
    });
});

// GET /api/books/categories - Get all unique categories
router.get('/categories/all', (req, res) => {
    const categories = [...new Set(books.map(book => book.category))];
    
    res.json({
        success: true,
        categories
    });
});

// GET /api/books/stats/summary - Get books statistics
router.get('/stats/summary', (req, res) => {
    const totalBooks = books.length;
    const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0);
    const averageRating = books.length > 0 
        ? books.reduce((sum, book) => sum + book.rating, 0) / books.length 
        : 0;
    
    // Group by category
    const categories = books.reduce((acc, book) => {
        acc[book.category] = (acc[book.category] || 0) + 1;
        return acc;
    }, {});
    
    // Group by year
    const years = books.reduce((acc, book) => {
        acc[book.year] = (acc[book.year] || 0) + 1;
        return acc;
    }, {});
    
    res.json({
        success: true,
        stats: {
            totalBooks,
            totalPages,
            averageRating: parseFloat(averageRating.toFixed(2)),
            categories,
            years
        }
    });
});

module.exports = router;
