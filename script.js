
document.addEventListener('DOMContentLoaded', function() {
    console.log('Efficient Energy Website Loaded');
    
    initFormValidation();
    initGallery();
    initSmoothScrolling();
    initMobileMenu();
    initScrollAnimations();
    initServiceFilter();
    initMap();
    setActiveNavLink();
});

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                submitForm(this);
            }
        });
        
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const fields = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.getAttribute('id');
    let isValid = true;
    let errorMessage = '';
    
    clearError(field);
    
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'This field is required';
        isValid = false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
    }
    
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
    }
    
    const minLength = field.getAttribute('minlength');
    if (minLength && value.length < minLength) {
        errorMessage = `Minimum ${minLength} characters required`;
        isValid = false;
    }
    
    if (!isValid) {
        showError(field, errorMessage);
    }
    
    return isValid;
}

function showError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function clearError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function submitForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showSuccessMessage(form, 'Thank you for your message! We will get back to you soon.');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showSuccessMessage(form, message) {
    let successElement = form.querySelector('.success-message');
    if (!successElement) {
        successElement = document.createElement('div');
        successElement.className = 'success-message';
        form.insertBefore(successElement, form.firstChild);
    }
    
    successElement.textContent = message;
    successElement.style.display = 'block';
    
    setTimeout(() => {
        successElement.style.display = 'none';
    }, 5000);
}

function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length === 0) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <span class="close-modal">&times;</span>
        <img class="modal-content" id="modal-image">
    `;
    document.body.appendChild(modal);
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img') ? this.querySelector('img').src : '';
            openModal(imgSrc, this.textContent);
        });
    });
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function openModal(imgSrc, altText) {
    const modal = document.querySelector('.modal');
    const modalImg = document.getElementById('modal-image');
    
    if (imgSrc) {
        modalImg.src = imgSrc;
        modalImg.alt = altText;
    } else {
        modalImg.style.display = 'none';
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initMobileMenu() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav ul');
    if (!nav) return;
    
    const menuToggle = document.createElement('button');
    menuToggle.innerHTML = '☰';
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    
    header.querySelector('.header-content').appendChild(menuToggle);
    
    menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        nav.classList.toggle('active');
        this.classList.toggle('active');
        this.setAttribute('aria-expanded', !isExpanded);
    });
    
    const navLinks = nav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!header.contains(e.target) && nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .stat-item, .about-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initServiceFilter() {
    const servicesSection = document.querySelector('#services');
    if (!servicesSection) return;
    
    const filterContainer = document.createElement('div');
    filterContainer.className = 'service-filter';
    filterContainer.innerHTML = `
        <input type="text" id="service-search" placeholder="Search services..." aria-label="Search services">
        <select id="service-category" aria-label="Filter by category">
            <option value="">All Categories</option>
            <option value="healthcare">Healthcare</option>
            <option value="commercial">Commercial</option>
            <option value="education">Education</option>
            <option value="office">Office</option>
            <option value="individual">Individual</option>
        </select>
    `;
    
    const servicesGrid = servicesSection.querySelector('.services-grid');
    if (servicesGrid) {
        servicesSection.querySelector('.container').insertBefore(filterContainer, servicesGrid);
        
        const searchInput = document.getElementById('service-search');
        const categorySelect = document.getElementById('service-category');
        const serviceCards = servicesSection.querySelectorAll('.service-card');
        
        // Add data-category attributes to service cards
        serviceCards.forEach((card, index) => {
            const categories = ['healthcare', 'commercial', 'education', 'office', 'individual', 'commercial'];
            card.dataset.category = categories[index] || 'commercial';
        });
        
        function filterServices() {
            const searchTerm = searchInput.value.toLowerCase();
            const category = categorySelect.value;
            
            serviceCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const cardCategory = card.dataset.category || '';
                
                const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
                const matchesCategory = !category || cardCategory === category;
                
                if (matchesSearch && matchesCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        searchInput.addEventListener('input', debounce(filterServices, 300));
        categorySelect.addEventListener('change', filterServices);
    }
}

function initMap() {
    const contactSection = document.querySelector('#contact');
    if (!contactSection) return;
    
    const mapContainer = document.createElement('div');
    mapContainer.id = 'map';
    mapContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <h3 style="margin-bottom: 1rem;">Johannesburg CBD Area</h3>
            <p>Efficient Energy Headquarters</p>
            <p>📍 Location: Just outside Johannesburg CBD</p>
            <p>🕒 Operating Hours: 24/7 Emergency Service</p>
        </div>
    `;
    
    const contactInfo = contactSection.querySelector('.contact-info');
    if (contactInfo) {
        contactInfo.appendChild(mapContainer);
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

window.EfficientEnergy = {
    validateForm,
    openModal,
    closeModal,
    filterServices: initServiceFilter
};

window.addEventListener('load', function() {
    console.log('Efficient Energy Website Fully Loaded');
});