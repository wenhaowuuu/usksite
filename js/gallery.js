// Gallery functionality for urban sketching website
class GalleryManager {
    constructor() {
        this.artworks = [];
        this.galleryContainer = document.getElementById('gallery');
        this.tooltip = document.getElementById('tooltip');
        this.tooltipTitle = document.getElementById('tooltip-title');
        this.tooltipMeta = document.getElementById('tooltip-meta');

        this.init();
    }

    async init() {
        try {
            await this.loadArtworks();
            this.renderGallery();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing gallery:', error);
            this.showErrorMessage();
        }
    }

    async loadArtworks() {
        const response = await fetch('data/artworks.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.artworks = data.artworks;
    }

    renderGallery() {
        this.galleryContainer.innerHTML = '';

        this.artworks.forEach((artwork, index) => {
            const galleryItem = this.createGalleryItem(artwork, index);
            this.galleryContainer.appendChild(galleryItem);
        });
    }

    createGalleryItem(artwork, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = `${(index + 1) * 0.1}s`;

        item.innerHTML = `
            <img src="images/${artwork.filename}"
                 alt="${artwork.title}"
                 loading="lazy">
            <div class="gallery-item-info">
                <h3>${artwork.title}</h3>
                <div class="meta">${artwork.year} • ${artwork.location}</div>
            </div>
        `;

        // Add click handler to navigate to individual artwork page
        item.addEventListener('click', () => {
            this.navigateToArtwork(artwork.id);
        });

        // Add hover handlers for tooltip
        this.setupTooltipHandlers(item, artwork);

        return item;
    }

    setupTooltipHandlers(element, artwork) {
        let tooltipTimeout;

        element.addEventListener('mouseenter', (e) => {
            clearTimeout(tooltipTimeout);
            this.showTooltip(e, artwork);
        });

        element.addEventListener('mousemove', (e) => {
            this.updateTooltipPosition(e);
        });

        element.addEventListener('mouseleave', () => {
            tooltipTimeout = setTimeout(() => {
                this.hideTooltip();
            }, 100);
        });
    }

    showTooltip(event, artwork) {
        this.tooltipTitle.textContent = artwork.title;
        this.tooltipMeta.textContent = `${artwork.year} • ${artwork.location}`;

        this.updateTooltipPosition(event);
        this.tooltip.classList.add('show');
    }

    updateTooltipPosition(event) {
        const tooltipWidth = this.tooltip.offsetWidth;
        const tooltipHeight = this.tooltip.offsetHeight;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = event.clientX + 15;
        let top = event.clientY - tooltipHeight - 15;

        // Adjust if tooltip would go off-screen
        if (left + tooltipWidth > viewportWidth) {
            left = event.clientX - tooltipWidth - 15;
        }

        if (top < 0) {
            top = event.clientY + 15;
        }

        this.tooltip.style.left = `${left}px`;
        this.tooltip.style.top = `${top}px`;
    }

    hideTooltip() {
        this.tooltip.classList.remove('show');
    }

    navigateToArtwork(artworkId) {
        // Navigate to individual artwork page
        window.location.href = `artwork/${artworkId}.html`;
    }

    setupEventListeners() {
        // Hide tooltip when scrolling
        window.addEventListener('scroll', () => {
            this.hideTooltip();
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideTooltip();
            }
        });

        // Handle responsive layout changes
        window.addEventListener('resize', () => {
            this.hideTooltip();
        });
    }

    showErrorMessage() {
        this.galleryContainer.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <h3>Unable to load gallery</h3>
                <p>Please check your connection and try again.</p>
            </div>
        `;
    }
}

// Utility functions for artwork page generation
class ArtworkPageGenerator {
    static async generatePages() {
        try {
            const response = await fetch('../data/artworks.json');
            const data = await response.json();

            // This would typically be done server-side or during build
            // For static hosting, we'll create the pages manually
            console.log('Artwork data loaded for page generation:', data.artworks);

            return data.artworks;
        } catch (error) {
            console.error('Error loading artwork data for page generation:', error);
            return [];
        }
    }

    static createArtworkPageHTML(artwork) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${artwork.title} - Wenhao Wu Urban Sketching</title>
    <meta name="description" content="${artwork.description}">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/artwork.css">
</head>
<body>
    <header>
        <nav class="nav-bar">
            <div class="nav-container">
                <div class="logo">
                    <a href="../index.html" style="text-decoration: none; color: inherit;">
                        <h1>Wenhao Wu</h1>
                        <p class="subtitle">Urban Sketching</p>
                    </a>
                </div>
                <ul class="nav-links">
                    <li><a href="../index.html">← Back to Gallery</a></li>
                    <li><a href="https://instagram.com/wenhaowu" target="_blank" rel="noopener">Artist Bio</a></li>
                    <li><a href="https://wenhaowu.com" target="_blank" rel="noopener">Professional Website</a></li>
                    <li><a href="https://venmo.com/wenhaowu" target="_blank" rel="noopener">Support My Sketches</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <main class="artwork-main">
        <div class="artwork-container">
            <div class="artwork-image">
                <img src="../images/${artwork.filename}" alt="${artwork.title}" loading="eager">
            </div>
            <div class="artwork-details">
                <h1>${artwork.title}</h1>
                <div class="artwork-meta">
                    <span class="year">${artwork.year}</span>
                    <span class="location">${artwork.location}</span>
                </div>
                <p class="artwork-description">${artwork.description}</p>
                <div class="artwork-actions">
                    <a href="../index.html" class="btn-back">← Back to Gallery</a>
                </div>
            </div>
        </div>
    </main>

    <footer>
        <div class="footer-content">
            <p>&copy; 2025 Wenhao Wu. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new GalleryManager();
});

// Export for potential use in other scripts
window.GalleryManager = GalleryManager;
window.ArtworkPageGenerator = ArtworkPageGenerator;