// Search functionality
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
});

function initSearch() {
    const searchBtn = document.getElementById('searchButton');
    const searchBox = document.getElementById('mainSearch');
    const searchSuggestions = document.querySelectorAll('.search-suggestions a');
    
    // Search button click
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Enter key in search box
    if (searchBox) {
        searchBox.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Search suggestions
    searchSuggestions.forEach(suggestion => {
        suggestion.addEventListener('click', function(e) {
            e.preventDefault();
            searchBox.value = this.textContent;
            performSearch();
        });
    });
}

function performSearch() {
    const query = document.getElementById('mainSearch').value.trim();
    
    if (!query) {
        alert('Please enter a search query');
        return;
    }
    
    // Show loading state
    const searchBtn = document.getElementById('searchButton');
    const originalText = searchBtn.textContent;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
    searchBtn.disabled = true;
    
    // In a real implementation, this would be an API call to the backend
    console.log('Performing AI search for:', query);
    
    // Simulate API call to backend
    setTimeout(() => {
        // Reset button
        searchBtn.textContent = originalText;
        searchBtn.disabled = false;
        
        // Show search results
        displaySearchResults(query);
    }, 1500);
}

function displaySearchResults(query) {
    // In a real implementation, this would display actual search results
    // For now, we'll show a modal with simulated results
    
    const results = [
        {
            title: 'Introduction to Machine Learning',
            author: 'Dr. Sarah Chen',
            category: 'Computer Science',
            match: '95%',
            summary: 'Comprehensive guide covering fundamental ML concepts, algorithms, and practical applications with Python examples.'
        },
        {
            title: 'Deep Learning Fundamentals',
            author: 'Prof. Michael Rodriguez',
            category: 'Artificial Intelligence',
            match: '88%',
            summary: 'Explores neural networks, backpropagation, and modern deep learning architectures with real-world case studies.'
        },
        {
            title: 'Machine Learning for Beginners',
            author: 'Emily Johnson',
            category: 'Technology',
            match: '82%',
            summary: 'Step-by-step introduction to machine learning concepts without heavy mathematics, perfect for newcomers.'
        }
    ];
    
    // Create and show results modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>AI Search Results for "${query}"</h2>
            <div class="search-results">
                ${results.map(result => `
                    <div class="search-result-item">
                        <h3>${result.title} <span class="match-badge">${result.match} match</span></h3>
                        <p class="result-meta">by ${result.author} • ${result.category}</p>
                        <p class="result-summary">${result.summary}</p>
                        <div class="result-actions">
                            <button class="btn btn-primary btn-sm" onclick="openBook('${result.title}')">Read Book</button>
                            <button class="btn btn-outline btn-sm" onclick="showSummary('${result.title}')">AI Summary</button>
                        </div>
                    </div>
                `).join('')}
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

// Function to open a book (simulated)
function openBook(title) {
    alert(`Opening book: "${title}"\n\nIn a full implementation, this would open the book reader.`);
}

// Function to show AI summary (simulated)
function showSummary(title) {
    alert(`AI Summary for "${title}":\n\nThis is a simulated AI-generated summary of the book. In a full implementation, this would use natural language processing to generate concise summaries of the content.`);
}

// Advanced search functionality
function advancedSearch(filters) {
    // This would be called with additional filters for more precise searching
    console.log('Advanced search with filters:', filters);
    
    // Implementation would make API call to backend with filter parameters
    return apiCall('/books/advanced-search', {
        method: 'POST',
        body: JSON.stringify(filters)
    });
}