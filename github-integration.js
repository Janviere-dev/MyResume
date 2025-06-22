// GitHub API Integration
const GITHUB_USERNAME = 'Janviere-dev';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Get GitHub token from environment
function getGitHubToken() {
    const token = localStorage.getItem('github_token') || '';
    console.log('Getting token:', token ? 'Token exists' : 'No token found');
    return token;
}

// Set GitHub token
function setGitHubToken(token) {
    console.log('Setting new token');
    localStorage.setItem('github_token', token);
}

// Clear GitHub token
function clearGitHubToken() {
    console.log('Clearing token');
    localStorage.removeItem('github_token');
}

// Loading state management
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading">Loading... Please wait</div>';
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="error">${message}</div>`;
    }
}

// Cache management
function getFromCache(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION) {
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

// GitHub API fetching with rate limiting and error handling
async function fetchGitHubAPI(endpoint) {
    try {
        const token = getGitHubToken();
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log(`Fetching GitHub API: ${endpoint}`);
        const response = await fetch(`https://api.github.com/${endpoint}`, { headers });
        console.log('API Response status:', response.status);

        if (!response.ok) {
            if (response.status === 401) {
                clearGitHubToken();
                throw new Error('Invalid GitHub token. Please provide a valid token.');
            }
            if (response.status === 403) {
                clearGitHubToken();
                throw new Error('GitHub API rate limit exceeded. Please provide a token to increase the limit.');
            }
            if (response.status === 404) {
                throw new Error(`GitHub profile '${GITHUB_USERNAME}' not found. Please check the username.`);
            }
            throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        console.log(`API Response for ${endpoint}:`, data.length ? `${data.length} items` : 'Object received');
        return data;
    } catch (error) {
        console.error('Error in fetchGitHubAPI:', error);
        throw error;
    }
}

// Fetch and process GitHub skills
async function fetchGitHubSkills() {
    console.log('Fetching GitHub skills...');
    try {
        const repos = await fetchGitHubAPI(`users/${GITHUB_USERNAME}/repos`);
        console.log(`Found ${repos.length} repositories`);
        
        const languageCounts = {};
        
        // Fetch languages for each repository
        await Promise.all(repos.map(async (repo) => {
            if (!repo.fork) {
                console.log(`Fetching languages for ${repo.name}`);
                const languages = await fetchGitHubAPI(`repos/${GITHUB_USERNAME}/${repo.name}/languages`);
                Object.keys(languages).forEach(lang => {
                    languageCounts[lang] = (languageCounts[lang] || 0) + 1;
                });
            }
        }));

        console.log('Final language counts:', languageCounts);
        setCache('github-skills', languageCounts);
        return languageCounts;
    } catch (error) {
        console.error('Error in fetchGitHubSkills:', error);
        throw error;
    }
}

// Fetch and process GitHub projects
async function fetchGitHubProjects() {
    showLoading('projects-container');
    
    const cachedProjects = getFromCache('github-projects');
    if (cachedProjects) return cachedProjects;

    try {
        const repos = await fetchGitHubAPI(`users/${GITHUB_USERNAME}/repos`);
        const projects = repos
            .filter(repo => !repo.fork)
            .map(repo => ({
                name: repo.name,
                description: repo.description || 'No description available',
                url: repo.html_url,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                updatedAt: new Date(repo.updated_at).toLocaleDateString(),
                topics: repo.topics || []
            }));

        setCache('github-projects', projects);
        return projects;
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        showError('projects-container', 'Failed to load projects. Please refresh the page.');
        return [];
    }
}

// Helper function to get language icons from CDN
function getLanguageIcon(language) {
    const icons = {
        'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
        'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
        'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
        'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
        'Ruby': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg',
        'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
        'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        'PHP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg',
        'Shell': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg'
    };
    return icons[language] || 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/devicon/devicon-original.svg';
}

// Export functions
window.GitHubAPI = {
    fetchSkills: fetchGitHubSkills,
    fetchProjects: fetchGitHubProjects,
    getLanguageIcon: getLanguageIcon,
    setGitHubToken: setGitHubToken,
    getGitHubToken: getGitHubToken,
    clearGitHubToken: clearGitHubToken
};