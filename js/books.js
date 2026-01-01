// Books functionality
document.addEventListener('DOMContentLoaded', function() {
    initBooks();
});

function initBooks() {
    // Load initial books
    loadBooks();
    
    // Set up filter event listeners
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterBooks);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', sortBooks);
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreBooks);
    }
}

// Sample book data
const sampleBooks = [
    {
        id: 1,
        title: 'The AI Revolution',
        author: 'Dr. Alan Turing',
        category: 'science',
        rating: 4.8,
        coverColor: '#4361ee',
        year: 2023
    },
    {
        id: 2,
        title: 'Digital Transformation',
        author: 'Sarah Johnson',
        category: 'technology',
        rating: 4.5,
        coverColor: '#3a0ca3',
        year: 2022
    },
    {
        id: 3,
        title: 'The Quantum World',
        author: 'Prof. Richard Feynman',
        category: 'physics',
        rating: 4.9,
        coverColor: '#7209b7',
        year: 2023
    },
    {
        id: 4,
        title: 'Machine Learning Basics',
        author: 'Dr. Emily Chen',
        category: 'computer-science',
        rating: 4.7,
        coverColor: '#4cc9f0',
        year: 2022
    },
    {
        id: 5,
        title: 'Data Science Handbook',
        author: 'Michael Zhang',
        category: 'data-science',
        rating: 4.6,
        coverColor: '#f72585',
        year: 2023
    },
    {
        id: 6,
        title: 'Web Development Fundamentals',
        author: 'Jessica Williams',
        category: 'technology',
        rating: 4.4,
        coverColor: '#4895ef',
        year: 2022
    },
    {
        id: 7,
        title: 'The History of Computing',
        author: 'Robert Brown',
        category: 'history',
        rating: 4.3,
        coverColor: '#560bad',
        year: 2021
    },
    {
        id: 8,
        title: 'Artificial Intelligence Ethics',
        author: 'Dr. Lisa Anderson',
        category: 'ethics',
        rating: 4.8,
        coverColor: '#b5179e',
        year: 2023
    }
];

let currentBooks = [...sampleBooks];
let displayedBooks = 4;

function loadBooks() {
    const booksGrid = document.getElementById('booksGrid');
    
    if (booksGrid) {
        const booksToShow = currentBooks.slice(0, displayedBooks);
        
        booksGrid.innerHTML = booksToShow.map(book => `
            <div class="book-card" data-id="${book.id}" onclick="openBookDetail(${book.id})">
                <div class="book-cover" style="background: ${book.coverColor}">
                    <i class="fas fa-book fa-3x" style="color: white;"></i>
                </div>
                <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">by ${book.author}</div>
                    <div class="book-meta">
                        <span>⭐ ${book.rating}</span>
                        <span>${book.category}</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Show/hide load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = displayedBooks >= currentBooks.length ? 'none' : 'block';
        }
    }
}

function loadMoreBooks() {
    displayedBooks += 4;
    loadBooks();
}

function filterBooks() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    
    if (selectedCategory === 'all') {
        currentBooks = [...sampleBooks];
    } else {
        currentBooks = sampleBooks.filter(book => 
            book.category === selectedCategory
        );
    }
    
    displayedBooks = 4;
    loadBooks();
}

function sortBooks() {
    const sortFilter = document.getElementById('sortFilter');
    const sortBy = sortFilter.value;
    
    switch(sortBy) {
        case 'newest':
            currentBooks.sort((a, b) => b.year - a.year);
            break;
        case 'rating':
            currentBooks.sort((a, b) => b.rating - a.rating);
            break;
        case 'popularity':
        default:
            // Default sorting (could be based on views or downloads)
            currentBooks.sort((a, b) => b.rating - a.rating);
            break;
    }
    
    loadBooks();
}

function openBookDetail(bookId) {
    const book = sampleBooks.find(b => b.id === bookId);
    
    if (book) {
        // Create book detail modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <div class="book-detail">
                    <div class="book-detail-cover" style="background: ${book.coverColor}">
                        <i class="fas fa-book fa-4x" style="color: white;"></i>
                    </div>
                    <div class="book-detail-info">
                        <h2>${book.title}</h2>
                        <p class="book-detail-author">by ${book.author}</p>
                        <div class="book-detail-meta">
                            <span><i class="fas fa-star"></i> ${book.rating}/5.0</span>
                            <span><i class="fas fa-calendar"></i> ${book.year}</span>
                            <span><i class="fas fa-tag"></i> ${book.category}</span>
                        </div>
                        <div class="book-detail-actions">
                            <button class="btn btn-primary" onclick="readBook(${book.id})">
                                <i class="fas fa-book-open"></i> Read Now
                            </button>
                            <button class="btn btn-outline" onclick="addToLibrary(${book.id})">
                                <i class="fas fa-plus"></i> Add to My Library
                            </button>
                        </div>
                        <div class="book-detail-summary">
                            <h3>AI-Generated Summary</h3>
                            <p>This book provides comprehensive coverage of ${book.category} concepts with practical examples and real-world applications. The content is structured to help readers build a solid foundation while exploring advanced topics.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

function readBook(bookId) {
    const book = sampleBooks.find(b => b.id === bookId);
    alert(`Now reading: "${book.title}"\n\nIn a full implementation, this would open the book reader interface.`);
}

function addToLibrary(bookId) {
    const book = sampleBooks.find(b => b.id === bookId);
    alert(`"${book.title}" has been added to your personal library!`);
}

// Function to fetch books from backend API
async function fetchBooksFromAPI(filters = {}) {
    try {
        const response = await apiCall('/books', {
            method: 'POST',
            body: JSON.stringify(filters)
        });
        return response.books;
    } catch (error) {
        console.error('Failed to fetch books:', error);
        // Fallback to sample data
        return sampleBooks;
    }
}