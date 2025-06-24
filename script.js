const words = ["Frontend Developer", "UI Designer", "Backend Developer", "Teacher"];
let i = 0;
let txt = '';
let wordIndex = 0;
let isDeleting = false;
let speed = 150;
const element = document.querySelector(".typing-text");

function typeEffect() {
  if (!element) return; // Add early return if element doesn't exist
  
  const current = words[wordIndex];
  
  if (isDeleting) {
    txt = current.substring(0, txt.length - 1);
  } else {
    txt = current.substring(0, txt.length + 1);
  }

  element.textContent = txt;

  if (!isDeleting && txt === current) {
    isDeleting = true;
    speed = 1000;
  } else if (isDeleting && txt === '') {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 150;
  } else {
    speed = isDeleting ? 50 : 150;
  }

  setTimeout(typeEffect, speed);
}

// Only start the typing effect if the element exists
if (element) {
  typeEffect();
}

// Function to toggle education sections
function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const header = content.previousElementSibling;
    
    // Toggle active class on content
    content.classList.toggle('active');
    
    // Toggle active class on header for icon rotation
    header.classList.toggle('active');
    
    // Update the toggle icon
    const icon = header.querySelector('.toggle-icon');
    if (content.classList.contains('active')) {
        icon.textContent = '×';
    } else {
        icon.textContent = '+';
    }
}

// Close all sections initially
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.classList.remove('active');
    });
});

// Add this function at the beginning for page transitions
function fadeOutAndRedirect(url) {
    document.body.style.opacity = '0';
    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

// Update the form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Clear all error messages
    function clearAllErrors() {
        form.querySelectorAll('.error-message').forEach(error => {
            error.classList.remove('active');
            error.textContent = '';
        });
        form.querySelectorAll('input, textarea').forEach(field => {
            field.classList.remove('error', 'valid');
        });
    }

    const validators = {
        firstName: {
            validate: (value) => {
                if (!value) return 'First name is required';
                if (value.length < 2) return 'First name must be at least 2 characters long';
                if (!/^[A-Za-z]+$/.test(value)) return 'First name should only contain letters';
                return '';
            }
        },
        lastName: {
            validate: (value) => {
                if (!value) return 'Last name is required';
                if (value.length < 2) return 'Last name must be at least 2 characters long';
                if (!/^[A-Za-z]+$/.test(value)) return 'Last name should only contain letters';
                return '';
            }
        },
        email: {
            validate: (value) => {
                if (!value) return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
                return '';
            }
        },
        phone: {
            validate: (value) => {
                if (!value) return 'Phone number is required';
                if (!/^\+250\s?7[0-9]{2}\s?[0-9]{3}\s?[0-9]{3}$/.test(value)) {
                    return 'Please enter a valid Rwanda phone number (+250 7XX XXX XXX)';
                }
                return '';
            }
        },
        subject: {
            validate: (value) => {
                if (!value) return 'Subject is required';
                if (value.length < 3) return 'Subject must be at least 3 characters long';
                return '';
            }
        },
        message: {
            validate: (value) => {
                if (!value) return 'Message is required';
                if (value.length < 10) return 'Message must be at least 10 characters long';
                return '';
            }
        }
    };

    // Validate single field
    function validateField(field) {
        const value = field.value.trim();
        const validator = validators[field.id];
        const errorElement = document.getElementById(`${field.id}Error`);
        
        if (!errorElement) {
            console.error(`Error element not found for field: ${field.id}`);
            return false;
        }

        if (validator) {
            const errorMessage = validator.validate(value);
            if (errorMessage) {
                field.classList.add('error');
                field.classList.remove('valid');
                errorElement.textContent = errorMessage;
                errorElement.classList.add('active');
                return false;
            } else {
                field.classList.remove('error');
                field.classList.add('valid');
                errorElement.classList.remove('active');
                errorElement.textContent = '';
                return true;
            }
        }
        return true;
    }

    // Format phone number as user types
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0 && !value.startsWith('250')) {
                value = '250' + value;
            }
            if (value.length > 0) {
                value = '+' + value;
            }
            if (value.length > 4) {
                value = value.slice(0, 4) + ' ' + value.slice(4);
            }
            if (value.length > 8) {
                value = value.slice(0, 8) + ' ' + value.slice(8);
            }
            if (value.length > 12) {
                value = value.slice(0, 12) + ' ' + value.slice(12);
            }
            e.target.value = value.slice(0, 16);
            validateField(phoneInput);
        });
    }

    // Add validation on input and blur
    form.querySelectorAll('input, textarea').forEach(field => {
        // Validate on input after a short delay
        let timeout;
        field.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => validateField(field), 500);
        });

        // Validate immediately on blur
        field.addEventListener('blur', () => {
            clearTimeout(timeout);
            validateField(field);
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        clearAllErrors();

        let isValid = true;
        let firstInvalidField = null;

        // Validate all fields
        form.querySelectorAll('input, textarea').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        });

        if (!isValid) {
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }
            return false;
        }

        // If all valid, show loading state and redirect
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Simulate form submission (replace with actual form submission if needed)
        setTimeout(() => {
            // Store form data in localStorage for thank you page
            const formData = {
                name: form.querySelector('#firstName').value + ' ' + form.querySelector('#lastName').value,
                email: form.querySelector('#email').value
            };
            localStorage.setItem('formData', JSON.stringify(formData));

            // Fade out and redirect
            fadeOutAndRedirect('thank-you.html');
        }, 1000);
    });

    // Add page transition effect for all links
    document.querySelectorAll('a').forEach(link => {
        if (link.href && link.href.startsWith(window.location.origin)) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                fadeOutAndRedirect(this.href);
            });
        }
    });
});

// Add this code for the thank you page
if (document.body.classList.contains('thank-you-page')) {
    const formData = JSON.parse(localStorage.getItem('formData') || '{}');
    const nameSpan = document.querySelector('.user-name');
    if (nameSpan && formData.name) {
        nameSpan.textContent = formData.name;
    }
    // Clear the form data
    localStorage.removeItem('formData');
}

// Soft Skills Toggle
function initializeSoftSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        item.addEventListener('click', () => {
            // If this item is already active and is clicked, close it
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                return;
            }
            
            // Close any other open items
            skillItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Open this item
            item.classList.add('active');
        });
    });
}

// Initialize soft skills if we're on the skills page
if (document.querySelector('.skills-section')) {
    initializeSoftSkills();
}

// Project Card Flip Functionality
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Flip card when clicking on the image container
        const imageContainer = card.querySelector('.project-image-container');
        if (imageContainer) {
            imageContainer.addEventListener('click', () => {
                card.classList.add('flipped');
            });
        }
        
        // Flip back when clicking the back button
        const backButton = card.querySelector('.back-to-image');
        if (backButton) {
            backButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                card.classList.remove('flipped');
            });
        }
    });
});

// Add these functions at the beginning of the file
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.navbar ul');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Page transition
    document.querySelectorAll('a').forEach(link => {
        if (link.href && link.href.startsWith(window.location.origin)) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.href;
                document.body.classList.add('page-transition');
                setTimeout(() => {
                    window.location.href = target;
                }, 300);
            });
        }
    });
});


