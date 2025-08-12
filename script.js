document.addEventListener('DOMContentLoaded', function() {
    initDesktopSiteDetection();
    initNavigation();
    initPropertyCards();
    initScrollEffects();
    initMobileMenu();
});

function initDesktopSiteDetection() {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTabletDevice = /iPad|Android(?=.*Tablet)|Android.*Tab/i.test(navigator.userAgent);
    const screenWidth = window.screen.width;
    const windowWidth = window.innerWidth;
    const devicePixelRatio = window.devicePixelRatio || 1;
    
    console.log('Device Detection:', {
        isMobileDevice,
        isTabletDevice,
        screenWidth,
        windowWidth,
        devicePixelRatio,
        userAgent: navigator.userAgent
    });
    
    // Enhanced multi-method desktop site detection
    const isDesktopSiteRequested = detectDesktopSiteRequest(isMobileDevice, isTabletDevice, screenWidth, windowWidth);
    
    if (isDesktopSiteRequested) {
        applyDesktopLayout(isMobileDevice, isTabletDevice);
    } else {
        applyResponsiveLayout();
    }
    
    // Add event listeners (only once)
    if (!window.desktopDetectionListenersAdded) {
        window.addEventListener('orientationchange', function() {
            setTimeout(initDesktopSiteDetection, 500);
        });
        
        window.addEventListener('resize', debounce(function() {
            initDesktopSiteDetection();
        }, 250));
        
        window.desktopDetectionListenersAdded = true;
    }
}

function detectDesktopSiteRequest(isMobileDevice, isTabletDevice, screenWidth, windowWidth) {
    // Only apply desktop layout in very specific cases to avoid interfering with responsive design
    
    // Method 1: Actual desktop/laptop (not mobile device)
    if (!isMobileDevice && !isTabletDevice && windowWidth >= 992) {
        return true;
    }
    
    // Method 2: Mobile device with VERY wide viewport (clear desktop site request)
    // This happens when user clicks "Desktop site" in mobile browser
    if (isMobileDevice && windowWidth >= 1100) {
        return true;
    }
    
    // Method 3: Tablet in landscape with desktop request indicators
    if (isTabletDevice && windowWidth >= 1000) {
        return true;
    }
    
    // Method 4: Mobile device where viewport is much wider than expected for the screen
    // This indicates browser is forcing desktop viewport
    if (isMobileDevice && screenWidth > 0 && screenWidth < 600 && windowWidth >= 980) {
        return true;
    }
    
    // For all other cases, use responsive design
    return false;
}

function applyDesktopLayout(isMobileDevice, isTabletDevice) {
    document.body.classList.add('force-desktop-layout');
    console.log('✅ Desktop layout applied');
    
    // Override viewport for better desktop experience
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && (isMobileDevice || isTabletDevice)) {
        viewport.setAttribute('content', 'width=1200, initial-scale=0.25, minimum-scale=0.1, maximum-scale=3.0');
        console.log('🔧 Viewport overridden for desktop site');
    }
    
    // Force navbar to desktop layout
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarCollapse) {
        navbarCollapse.classList.add('show');
        navbarCollapse.style.display = 'flex';
    }
    
    if (navbarToggler) {
        navbarToggler.style.display = 'none';
    }
    
    // Ensure 2x2 grid layout for properties
    setTimeout(() => {
        const propertyCards = document.querySelectorAll('.col-12, .col-md-6');
        propertyCards.forEach(card => {
            if (card.closest('.properties-section')) {
                card.style.flex = '0 0 50%';
                card.style.maxWidth = '50%';
                card.style.width = '50%';
            }
        });
    }, 100);
}

function applyResponsiveLayout() {
    document.body.classList.remove('force-desktop-layout');
    console.log('📱 Responsive layout applied');
    
    // Reset viewport to responsive
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
    
    // Reset inline styles
    const propertyCards = document.querySelectorAll('.col-12, .col-md-6');
    propertyCards.forEach(card => {
        card.style.flex = '';
        card.style.maxWidth = '';
        card.style.width = '';
    });
    
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarCollapse && window.innerWidth < 992) {
        navbarCollapse.style.display = '';
        navbarCollapse.classList.remove('show');
    }
    
    if (navbarToggler && window.innerWidth < 992) {
        navbarToggler.style.display = '';
    }
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
            if (window.innerWidth < 992 && !document.body.classList.contains('force-desktop-layout')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    hide: true
                });
            }
        });
    });
    
    // Handle touch events for better mobile experience
    if ('ontouchstart' in window) {
        document.addEventListener('touchstart', function() {}, { passive: true });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 992 && 
            !document.body.classList.contains('force-desktop-layout') &&
            !e.target.closest('.navbar') && 
            navbarCollapse.classList.contains('show')) {
            
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                hide: true
            });
        }
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
