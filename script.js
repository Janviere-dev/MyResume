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

// Form Validation
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
        e.preventDefault(); // Always prevent default first
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
            // Scroll to and focus the first invalid field
            if (firstInvalidField) {
                firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalidField.focus();
            }
            return false;
        }

        // If all valid, show success popup
        const submitBtn = form.querySelector('.submit-btn');
        const successPopup = document.getElementById('successPopup');
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate form submission delay
        setTimeout(() => {
            // Show success popup
            successPopup.classList.add('show');
            
            // Reset button
            submitBtn.classList.add('submit-success');
            submitBtn.textContent = 'Sent Successfully!';
            
            // Hide popup and reset form after 3 seconds
            setTimeout(() => {
                successPopup.classList.remove('show');
                form.reset();
                submitBtn.disabled = false;
                submitBtn.classList.remove('submit-success');
                submitBtn.textContent = 'Submit';
                clearAllErrors();
            }, 3000);
        }, 1000);
    });
});

// GitHub API Configuration
const GITHUB_CONFIG = {
    username: 'Janviere-dev',
    // Token will be set via environment variable or configuration
    token: '', // DO NOT hardcode the token here
    cacheExpiry: 3600000, // 1 hour in milliseconds
};

// Cache helpers
function getFromCache(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > GITHUB_CONFIG.cacheExpiry) {
        localStorage.removeItem(key);
        return null;
    }
    return data;
}

function setCache(key, data) {
    localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now()
    }));
}

// GitHub API helpers
async function fetchGitHubAPI(endpoint) {
    console.log(`Fetching GitHub API endpoint: ${endpoint}`);
    const headers = {
        'Accept': 'application/vnd.github.v3+json'
    };
    
    if (window.GITHUB_CONFIG && window.GITHUB_CONFIG.token) {
        console.log('Using GitHub token for authentication');
        headers['Authorization'] = `Bearer ${window.GITHUB_CONFIG.token}`;
    } else {
        console.warn('No GitHub token found! This will limit the API rate.');
    }
    
    try {
        console.log('Making API request...');
        const response = await fetch(`https://api.github.com${endpoint}`, { headers });
        
        console.log('Response status:', response.status);
        console.log('Rate limit remaining:', response.headers.get('x-ratelimit-remaining'));
        
        if (!response.ok) {
            if (response.status === 403 || response.status === 429) {
                const resetTime = response.headers.get('x-ratelimit-reset');
                const waitTime = resetTime ? new Date(resetTime * 1000) - new Date() : 3600000;
                const errorMessage = `Rate limit exceeded. Try again in ${Math.ceil(waitTime / 1000 / 60)} minutes.`;
                console.error(errorMessage);
                throw new Error(errorMessage);
            }
            const errorText = await response.text();
            console.error('GitHub API error response:', errorText);
            throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('API response data:', data);
        return data;
    } catch (error) {
        console.error('Error in fetchGitHubAPI:', error);
        throw error;
    }
}

// GitHub Skills Integration
async function fetchGitHubSkills() {
    console.log('Starting fetchGitHubSkills...');
    const hardSkillsContainer = document.getElementById('hardSkills');
    if (!hardSkillsContainer) {
        console.error('Could not find hardSkills container!');
        return;
    }
    
    try {
        // Try to get cached data first
        const cachedSkills = getFromCache('github_skills');
        if (cachedSkills) {
            console.log('Using cached skills data');
            renderSkills(cachedSkills);
            return;
        }
        
        console.log('Fetching fresh skills data...');
        const repos = await fetchGitHubAPI(`/users/${GITHUB_CONFIG.username}/repos`);
        console.log(`Found ${repos.length} repositories`);
        
        // Count languages used across repositories
        const languageCounts = {};
        console.log('Fetching language data for each repository...');
        const languagePromises = repos.map(repo => {
            console.log(`Fetching languages for ${repo.name}...`);
            return fetchGitHubAPI(repo.languages_url.replace('https://api.github.com', ''))
                .then(languages => {
                    console.log(`Languages for ${repo.name}:`, languages);
                    return languages;
                })
                .catch(error => {
                    console.error(`Error fetching languages for ${repo.name}:`, error);
                    return {};
                });
        });
        
        const languagesData = await Promise.all(languagePromises);
        console.log('All language data fetched:', languagesData);
        
        languagesData.forEach(languages => {
            Object.keys(languages).forEach(lang => {
                languageCounts[lang] = (languageCounts[lang] || 0) + 1;
            });
        });
        
        console.log('Final language counts:', languageCounts);
        
        // Cache the results
        setCache('github_skills', languageCounts);
        
        // Render the skills
        renderSkills(languageCounts);
        
    } catch (error) {
        console.error('Error in fetchGitHubSkills:', error);
        hardSkillsContainer.innerHTML = `
            <div class="error-message">
                <p>${error.message}</p>
                <button onclick="fetchGitHubSkills()" class="retry-button">Retry</button>
            </div>
        `;
    }
}

function renderSkills(languageCounts) {
    const hardSkillsContainer = document.getElementById('hardSkills');
    hardSkillsContainer.innerHTML = '';
    
    Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([language, count]) => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            
            const languageIcon = getLanguageIcon(language);
            
            skillCard.innerHTML = `
                <img src="${languageIcon}" alt="${language}" class="language-icon">
                <div class="language-name">${language}</div>
                <div class="repo-count">${count} ${count === 1 ? 'repo' : 'repos'}</div>
            `;
            
            hardSkillsContainer.appendChild(skillCard);
        });
}

// Add these functions to script.js if they're not already present

async function fetchGitHubAPI(endpoint) {
    console.log(`Fetching GitHub API endpoint: ${endpoint}`);
    const response = await fetch(`https://api.github.com${endpoint}`);
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }
    return response.json();
}

// ...existing code...
async function fetchGitHubSkills() {
    const username = "Janviere-dev";
    const hardSkillsContainer = document.getElementById('hardSkills');
    hardSkillsContainer.innerHTML = "Loading skills from GitHub...";

    try {
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await reposResponse.json();

        const languageSet = new Set();
        for (const repo of repos) {
            const langResponse = await fetch(repo.languages_url);
            const languages = await langResponse.json();
            Object.keys(languages).forEach(lang => languageSet.add(lang));
        }

        if (languageSet.size === 0) {
            hardSkillsContainer.innerHTML = "No skills found on GitHub.";
            return;
        }

        hardSkillsContainer.innerHTML = "";
        languageSet.forEach(lang => {
            const skillDiv = document.createElement('div');
            skillDiv.className = "skill-card";
            skillDiv.textContent = lang;
            hardSkillsContainer.appendChild(skillDiv);
        });
    } catch (error) {
        hardSkillsContainer.innerHTML = "Failed to load skills from GitHub.";
    }
}

// Call the function when the page loads
window.addEventListener('DOMContentLoaded', fetchGitHubSkills);
// ...existing code...

// GitHub Projects Integration
async function fetchGitHubProjects() {
    const projectsContainer = document.getElementById('projectsGrid');
    if (!projectsContainer) return;
    
    try {
        // Try to get cached data first
        const cachedProjects = getFromCache('github_projects');
        if (cachedProjects) {
            renderProjects(cachedProjects);
            return;
        }
        
        const repos = await fetchGitHubAPI(`/users/${GITHUB_CONFIG.username}/repos?sort=updated&direction=desc`);
        
        // Cache the results
        setCache('github_projects', repos);
        
        // Render the projects
        renderProjects(repos);
        
    } catch (error) {
        projectsContainer.innerHTML = `
            <div class="error-message">
                <p>${error.message}</p>
                <button onclick="fetchGitHubProjects()" class="retry-button">Retry</button>
            </div>
        `;
        console.error('Error fetching GitHub projects:', error);
    }
}

function renderProjects(repos) {
    const projectsContainer = document.getElementById('projectsGrid');
    projectsContainer.innerHTML = '';
    
    repos.forEach(repo => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        
        const description = repo.description || 'No description available';
        const language = repo.language || 'Other';
        const updatedAt = new Date(repo.updated_at).toLocaleDateString();
        
        projectCard.innerHTML = `
            <div class="project-header">
                <h3 class="project-title">
                    <img src="images/github-logo.png" alt="GitHub">
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
                </h3>
                <p class="project-description">${description}</p>
            </div>
            <div class="project-meta">
                <div class="project-language">
                    <span class="language-dot ${language}"></span>
                    ${language}
                </div>
                <div class="project-stats">
                    <span class="project-stat">
                        <svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/>
                        </svg>
                        ${repo.stargazers_count}
                    </span>
                    <span class="project-stat">
                        <svg height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"/>
                        </svg>
                        ${repo.forks_count}
                    </span>
                    <span class="project-stat">Updated: ${updatedAt}</span>
                </div>
            </div>
        `;
        
        projectsContainer.appendChild(projectCard);
    });
}

// Helper function to get language icons
function getLanguageIcon(language) {
    const icons = {
        JavaScript: 'images/javascript.jpg',
        Python: 'images/python.jpeg',
        HTML: 'images/HTML5.png',
        CSS: 'images/css.webp',
        // Add more language icons as needed
    };
    
    return icons[language] || 'images/logo.png'; // Default to logo if no specific icon
}

// Initialize skills page if we're on it
if (document.querySelector('.skills-section')) {
    fetchGitHubSkills();
}

// Initialize projects page if we're on it
if (document.querySelector('.projects-section')) {
    fetchGitHubProjects();
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
    fetchGitHubSkills();
    initializeSoftSkills();
}
