// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && scrolled < window.innerHeight) {
        // Subtle parallax effect on background
        hero.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
        
        // Content moves slower than scroll for depth effect
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Navbar scroll effect
let lastScrollY = window.scrollY;
let navbarScrollTimeout;
const NAVBAR_SCROLL_DELAY = 120;

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    const currentScrollY = window.scrollY;
    const isScrollingUp = currentScrollY < lastScrollY;
    const isScrollingDown = currentScrollY > lastScrollY;

    if (currentScrollY <= 50) {
        navbar.classList.remove('hidden');
    } else {
        clearTimeout(navbarScrollTimeout);
        navbarScrollTimeout = setTimeout(() => {
            if (isScrollingUp && currentScrollY > 100) {
                navbar.classList.add('hidden');
            } else if (isScrollingDown) {
                navbar.classList.remove('hidden');
            }
        }, NAVBAR_SCROLL_DELAY);
    }

    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
});

// Simple mobile menu toggle logic
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    const isActive = navLinks.classList.contains('active');

    if (isActive) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    } else {
        navLinks.classList.add('active');
        hamburger.classList.add('active');
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const message = String(formData.get('message') || '').trim();

        const subject = encodeURIComponent(`Photoshoot enquiry from ${name || 'a visitor'}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=vanshgupta4845@gmail.com&su=${subject}&body=${body}`;

        window.open(gmailUrl, '_blank');
    });
}

// ==========================================
// Gallery Lightbox & Filter Functionality
// ==========================================

const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

let currentImageIndex = 0;

// Function to show content in lightbox
function showLightboxContent(index) {
    const item = galleryItems[index];
    
    // FIX 2: Dynamically check if a video element exists inside the item instead of relying on a specific class
    const videoEl = item.querySelector('video');
    const isVideo = videoEl !== null;

    // Hide both image and video initially
    lightboxImg.style.display = 'none';
    if (lightboxVideo) lightboxVideo.style.display = 'none';

    if (isVideo) {
        // Show video
        const sourceElement = videoEl.querySelector('source');
        if (lightboxVideo && sourceElement) {
            lightboxVideo.src = sourceElement.src;
            lightboxVideo.style.display = 'block';
            lightboxVideo.load(); // Reload video
        }
    } else {
        // Show image
        const imgEl = item.querySelector('img');
        if (imgEl) {
            lightboxImg.src = imgEl.src;
            lightboxImg.style.display = 'block';
        }
    }
}

// Open lightbox
galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
        // Don't open lightbox if clicking on video controls directly on the grid
        if (e.target.tagName === 'VIDEO' || e.target.closest('video')) {
            return;
        }

        currentImageIndex = index;
        showLightboxContent(index);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Close lightbox
lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
    // Pause video when closing
    if (lightboxVideo) {
        lightboxVideo.pause();
    }
});

// Close lightbox on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (lightboxVideo) {
            lightboxVideo.pause();
        }
    }
});

// Navigate to previous item
lightboxPrev.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
    showLightboxContent(currentImageIndex);
});

// Navigate to next item
lightboxNext.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
    showLightboxContent(currentImageIndex);
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
        if (lightboxVideo) {
            lightboxVideo.pause();
        }
    } else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        showLightboxContent(currentImageIndex);
    } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        showLightboxContent(currentImageIndex);
    }
});

// Gallery Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
// FIX 1: Removed the duplicate `const galleryItems` declaration from here

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
            if (filterValue === 'all') {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                // Wrap in a try-catch or safe check in case an item misses the data-category attribute
                const categoryAttr = item.getAttribute('data-category');
                if (categoryAttr) {
                    const categories = categoryAttr.split(' ');
                    if (categories.includes(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(30px)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            }
        });
    });
});

// Gallery Zoom Button Functionality
document.querySelectorAll('.gallery-zoom').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering the gallery item click
        const galleryItem = button.closest('.gallery-item');
        const index = Array.from(galleryItems).indexOf(galleryItem);

        currentImageIndex = index;
        showLightboxContent(index);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Load More Functionality (placeholder)
const loadMoreBtn = document.querySelector('.gallery-load-more .btn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        // Add loading state
        loadMoreBtn.innerHTML = '<span>Loading...</span><i class="fas fa-spinner fa-spin"></i>';
        loadMoreBtn.style.pointerEvents = 'none';

        // Simulate loading (replace with actual loading logic)
        setTimeout(() => {
            loadMoreBtn.innerHTML = '<span>Load More Work</span><i class="fas fa-plus"></i>';
            loadMoreBtn.style.pointerEvents = 'auto';

            // Show notification that more content would be loaded
            const notification = document.createElement('div');
            notification.textContent = 'More gallery items would be loaded here in a real implementation';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--gold);
                color: var(--bg-matte);
                padding: 15px 20px;
                border-radius: 8px;
                font-weight: 500;
                z-index: 10000;
                box-shadow: var(--shadow-strong);
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        }, 1500);
    });
}