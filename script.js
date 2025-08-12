document.addEventListener('DOMContentLoaded', function() {
    initDesktopSiteDetection();
    initDesktopSiteDetection();
    initNavigation();
    initPropertyCards();
    initScrollEffects();
    initMobileMenu();
});

function initDesktopSiteDetection() {
    // Detect if desktop site is requested on mobile
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const screenWidth = window.screen.width;
    const windowWidth = window.innerWidth;
    
    // Multiple detection methods for desktop site request
    const isDesktopSiteRequested = 
        // Method 1: Window width is much larger than typical mobile
        windowWidth > 1024 ||
        // Method 2: On mobile device but window width suggests desktop mode
        (isMobileDevice && windowWidth >= 980) ||
        // Method 3: Screen width vs window width ratio suggests desktop mode
        (isMobileDevice && screenWidth > 0 && windowWidth / screenWidth > 0.8) ||
        // Method 4: Check if viewport was overridden by browser
        (isMobileDevice && window.outerWidth > 1000);
    
    if (isDesktopSiteRequested || windowWidth >= 992) {
        document.body.classList.add('force-desktop-layout');
        console.log('Desktop site detected - applying desktop layout');
        
        // Override viewport for better desktop site experience
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport && isMobileDevice) {
            // Set a fixed width that ensures desktop layout
            viewport.setAttribute('content', 'width=1200, initial-scale=0.25, minimum-scale=0.1, maximum-scale=2.0, user-scalable=yes');
            console.log('Viewport overridden for desktop site');
        }
        
        // Force navbar to show desktop layout
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse) {
            navbarCollapse.classList.add('show');
            console.log('Navbar forced to desktop layout');
        }
    } else {
        document.body.classList.remove('force-desktop-layout');
        console.log('Mobile layout applied');
    }
    
    // Listen for orientation changes and window resizes
    window.addEventListener('orientationchange', function() {
        setTimeout(initDesktopSiteDetection, 500);
    });
    
    window.addEventListener('resize', debounce(function() {
        initDesktopSiteDetection();
    }, 250));
}

function initDesktopSiteDetection() {
    // Detect if desktop site is requested on mobile
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const screenWidth = window.screen.width;
    const windowWidth = window.innerWidth;
    
    // Multiple detection methods for desktop site request
    const isDesktopSiteRequested = 
        // Method 1: Window width is much larger than typical mobile
        windowWidth > 1024 ||
        // Method 2: On mobile device but window width suggests desktop mode
        (isMobileDevice && windowWidth >= 980) ||
        // Method 3: Screen width vs window width ratio suggests desktop mode
        (isMobileDevice && screenWidth > 0 && windowWidth / screenWidth > 0.8) ||
        // Method 4: Check if viewport was overridden by browser
        (isMobileDevice && window.outerWidth > 1000);
    
    if (isDesktopSiteRequested || windowWidth >= 992) {
        document.body.classList.add('force-desktop-layout');
        console.log('Desktop site detected - applying desktop layout');
        
        // Override viewport for better desktop site experience
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport && isMobileDevice) {
            // Set a fixed width that ensures desktop layout
            viewport.setAttribute('content', 'width=1200, initial-scale=0.25, minimum-scale=0.1, maximum-scale=2.0, user-scalable=yes');
            console.log('Viewport overridden for desktop site');
        }
        
        // Force navbar to show desktop layout
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse) {
            navbarCollapse.classList.add('show');
            console.log('Navbar forced to desktop layout');
        }
    } else {
        document.body.classList.remove('force-desktop-layout');
        console.log('Mobile layout applied');
    }
    
    // Listen for orientation changes and window resizes
    window.addEventListener('orientationchange', function() {
        setTimeout(initDesktopSiteDetection, 500);
    });
    
    window.addEventListener('resize', debounce(function() {
        initDesktopSiteDetection();
    }, 250));
}

function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function initPropertyCards() {
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.addEventListener('click', function(e) {
            handlePropertyClick(card);
        });
        
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
}

function handlePropertyClick(card) {
    const propertyName = card.querySelector('img').alt;
    
    const propertyPages = {
        'Seaside Escape': 'property-seaside-escape.html',
        'Vista Luxe Villa': 'property-vista-luxe-villa.html',
        'Delta Heights Estate': 'property-delta-heights-estate.html',
        'Sa Ràpita Retreat': 'property-sa-rapita-retreat.html'
    };
    
    const pageUrl = propertyPages[propertyName];
    if (pageUrl) {
        window.location.href = pageUrl;
    } else {
        const propertyPrice = card.querySelector('.price-value').textContent;
        const propertyAddress = card.querySelector('.address-value').textContent;
        showPropertyModal(propertyName, propertyPrice, propertyAddress);
    }
}

function showPropertyModal(name, price, address) {
    const modalHTML = `
        <div class="modal fade" id="propertyModal" tabindex="-1" aria-labelledby="propertyModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="propertyModalLabel">${name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Price</h6>
                                <p class="text-primary fw-bold fs-4">${price}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Address</h6>
                                <p>${address}</p>
                            </div>
                        </div>
                        <div class="mt-3">
                            <p>Contact us for more information about this property.</p>
                            <div class="d-flex gap-2">
                                <a href="tel:+17783213122" class="btn btn-primary">
                                    <i class="fas fa-phone me-2"></i>Call Now
                                </a>
                                <a href="mailto:hi@realvantage.com" class="btn btn-outline-primary">
                                    <i class="fas fa-envelope me-2"></i>Email Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('propertyModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = new bootstrap.Modal(document.getElementById('propertyModal'));
    modal.show();
    
    document.getElementById('propertyModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.property-card').forEach(card => {
        observer.observe(card);
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initMobileMenu() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    hide: true
                });
            }
        });
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phoneNumber;
}

function handleContactForm(formData) {
    console.log('Contact form submitted:', formData);
    showNotification('Thank you for your inquiry! We will contact you soon.', 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 100px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'pageLoader';
    loader.className = 'd-flex justify-content-center align-items-center position-fixed';
    loader.style.cssText = 'top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); z-index: 9999;';
    loader.innerHTML = `
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        loader.remove();
    }
}

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

window.RealVantage = {
    showPropertyModal,
    showNotification,
    formatPhoneNumber,
    showLoading,
    hideLoading
};
