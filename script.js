loadTime = performance.now();
  console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);


// Public API
window.RealVantage = {
  showPropertyModal,
  showNotification,
  formatPhoneNumber,
  showLoading,
  hideLoading
};
// RealVantage site interactions
// Cleaned and de-duplicated. Adds reliable detection for "Desktop site" on mobile Chrome

(function immediateDesktopPreferenceApply() {
  try {
    const params = new URLSearchParams(window.location.search);
    const preferDesktop = params.get('desktop');
    if (preferDesktop === '1') localStorage.setItem('rv_desktop_layout', '1');
    if (preferDesktop === '0') localStorage.removeItem('rv_desktop_layout');

    // Honor saved preference only on widths >= 768px (never force desktop on small phones)
    if (localStorage.getItem('rv_desktop_layout') === '1' && window.innerWidth >= 768) {
      document.body.classList.add('force-desktop-layout');
    }
  } catch (e) {
    // no-op
  }
})();

// Boot
document.addEventListener('DOMContentLoaded', function() {
  initDesktopSiteDetection();
  initNavigation();
  initPropertyCards();
  initScrollEffects();
  initMobileMenu();
});

function initDesktopSiteDetection() {
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const windowWidth = window.innerWidth;
  const screenWidth = window.screen.width;

  // Simple and reliable desktop site detection
  const isDesktopSiteRequested = detectDesktopSiteRequest(isMobileDevice, windowWidth, screenWidth);

  console.log('Detection:', {
    isMobileDevice,
    windowWidth,
    screenWidth,
    isDesktopSiteRequested
  });

  if (isDesktopSiteRequested) {
    enableDesktopLayout();
  } else {
    enableResponsiveLayout();
  }

  // Add resize listener (only once)
  if (!window.desktopSiteListenerAdded) {
    window.addEventListener('resize', debounce(initDesktopSiteDetection, 300));
    window.desktopSiteListenerAdded = true;
  }
}

function detectDesktopSiteRequest(isMobileDevice, windowWidth, screenWidth) {
  // URL and user preference overrides
  try {
    const params = new URLSearchParams(location.search);
    if (params.get('desktop') === '1') return true;
    if (params.get('desktop') === '0') return false;
  } catch (e) {}

  // Enforce: saved preference only applies when viewport is >= 768px
  if (localStorage.getItem('rv_desktop_layout') === '1' && windowWidth >= 768) {
    return true;
  }

  // If not a mobile device, use natural responsive behavior
  if (!isMobileDevice) {
    return windowWidth >= 992; // Standard desktop breakpoint
  }

  // Mobile device case: only treat as desktop when the viewport itself is truly wide
  // These checks avoid false positives and keep phones responsive by default
  if (window.visualViewport && window.visualViewport.width >= 980) return true;
  if (windowWidth >= 980) return true;
  if (window.devicePixelRatio && (windowWidth / window.devicePixelRatio) >= 980) return true;

  return false;
}

function enableDesktopLayout() {
  document.body.classList.add('force-desktop-layout');
  console.log('🖥️ Desktop layout enabled');

  // Force desktop grid layout
  setTimeout(() => {
    const propertyColumns = document.querySelectorAll('.properties-section .col-12.col-md-6');
    propertyColumns.forEach(col => {
      col.style.flex = '0 0 50%';
      col.style.maxWidth = '50%';
    });
  }, 50);
}

function enableResponsiveLayout() {
  document.body.classList.remove('force-desktop-layout');
  console.log('📱 Responsive layout enabled');

  // Reset any forced styles
  const propertyColumns = document.querySelectorAll('.properties-section .col-12.col-md-6');
  propertyColumns.forEach(col => {
    col.style.flex = '';
    col.style.maxWidth = '';
  });
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
    link.addEventListener('click', function() {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
}

function initPropertyCards() {
  const propertyCards = document.querySelectorAll('.property-card');

  propertyCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;

    card.addEventListener('click', function() {
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
    </div>`;

  const existingModal = document.getElementById('propertyModal');
  if (existingModal) existingModal.remove();

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
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function initMobileMenu() {
  // Custom slide-in menu (no Bootstrap offcanvas)
  const customMenu = document.getElementById('mobileMenuCustom');
  const toggler = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.menu-close');

  if (customMenu && toggler) {
    const openMenu = () => {
      customMenu.classList.add('open');
      document.body.classList.add('menu-open');
      toggler.setAttribute('aria-expanded', 'true');
    };
    const closeMenu = () => {
      customMenu.classList.remove('open');
      document.body.classList.remove('menu-open');
      toggler.setAttribute('aria-expanded', 'false');
    };

    toggler.addEventListener('click', (e) => {
      e.preventDefault();
      if (customMenu.classList.contains('open')) closeMenu();
      else openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    // Close when clicking any nav link
    customMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    return;
  }

  // Fallback: Bootstrap collapse (desktop and pages without custom menu)
  const navbarCollapse = document.getElementById('navbarNav');
  const bsToggler = document.querySelector('.navbar-toggler');
  if (navbarCollapse && bsToggler) {
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false });
    bsToggler.removeAttribute('data-bs-toggle');
    bsToggler.removeAttribute('data-bs-target');
    bsToggler.addEventListener('click', (e) => {
      e.preventDefault();
      bsCollapse.toggle();
    });
  }
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
  // Keep only digits
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  // Format as (XXX) XXX-XXXX when there are exactly 10 digits
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  // Fallback to original input when it doesn't match 10-digit pattern
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
  if (loader) loader.remove();
}

window.addEventListener('error', function(e) {
  console.error('JavaScript error:', e.error);
});

window.addEventListener('load', function() {
  const loadTime = performance.now();
  console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
});

// Public API
window.RealVantage = {
  showPropertyModal,
  showNotification,
  formatPhoneNumber,
  showLoading,
  hideLoading
};
