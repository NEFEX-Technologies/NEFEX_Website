// Relative URL for Netlify, since frontend and backend share the same domain
const API_BASE_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {

    // UI Elements
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    const jobsList = document.getElementById('jobs-list');
    const addJobBtn = document.getElementById('add-job-btn');
    const jobFormModal = document.getElementById('job-form-modal');
    const jobForm = document.getElementById('job-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const modalTitle = document.getElementById('modal-title');

    // Check auth on load
    const token = localStorage.getItem('admin_token');
    if (token) {
        showDashboard();
    } else {
        showLogin();
    }

    // --- Authentication --- //
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('admin_token', data.token);
                showDashboard();
            } else {
                loginError.textContent = data.message || 'Login failed';
                loginError.style.display = 'block';
            }
        } catch (error) {
            loginError.textContent = 'Network error. Make sure API is running.';
            loginError.style.display = 'block';
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('admin_token');
        showLogin();
    });

    // --- UI Navigation --- //
    function showLogin() {
        loginScreen.style.display = 'block';
        dashboardScreen.style.display = 'none';
        jobFormModal.style.display = 'none';
        loginError.style.display = 'none';
    }

    function showDashboard() {
        loginScreen.style.display = 'none';
        dashboardScreen.style.display = 'block';
        fetchJobs(); // Load jobs when dashboard is shown
    }

    // --- Job Management --- //
    async function fetchJobs() {
        const token = localStorage.getItem('admin_token');
        try {
            const res = await fetch(`${API_BASE_URL}/jobs/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem('admin_token');
                showLogin();
                return;
            }

            const jobs = await res.json();
            renderJobs(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            jobsList.innerHTML = '<p>Error loading jobs.</p>';
        }
    }

    function renderJobs(jobs) {
        jobsList.innerHTML = '';
        if (jobs.length === 0) {
            jobsList.innerHTML = '<p>No job postings found.</p>';
            return;
        }

        jobs.forEach(job => {
            const div = document.createElement('div');
            div.className = 'job-card';
            div.innerHTML = `
                <div class="job-details">
                    <h3>${job.title} ${job.is_active ? '<span style="color:#00d4ff; font-size:12px;">(Active)</span>' : '<span style="color:#ff4d4d; font-size:12px;">(Inactive)</span>'}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${job.location || 'N/A'} | Experience: ${job.experience || 'N/A'}</p>
                </div>
                <div class="job-actions">
                    <button class="btn-edit" onclick="editJob(${job.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn-delete" onclick="deleteJob(${job.id})"><i class="fas fa-trash"></i> Delete</button>
                </div>
            `;
            jobsList.appendChild(div);
        });
    }

    // Form Modal logic
    addJobBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Add Job';
        jobForm.reset();
        document.getElementById('job-id').value = '';
        jobFormModal.style.display = 'flex';
    });

    cancelBtn.addEventListener('click', () => {
        jobFormModal.style.display = 'none';
    });

    // Save Job (Create or Update)
    jobForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('job-id').value;

        // Convert text to JSON format
        const skillsRaw = document.getElementById('job-skills-data').value;
        let skillsJson = null;

        if (skillsRaw.trim() !== '') {
            const categories = [];
            let currentCategory = null;

            const lines = skillsRaw.split('\n');
            lines.forEach(line => {
                const text = line.trim();
                if (!text) return; // Skip empty lines

                // If line ends with a colon, or contains one but no commas, we treat it as a header
                if (text.endsWith(':') || (text.includes(':') && !text.includes(','))) {
                    const name = text.replace(':', '').trim();
                    currentCategory = { name: name, skills: [] };
                    categories.push(currentCategory);
                }
                // Alternatively, if there's no colon but we don't have a category yet, make a default one
                else if (!currentCategory && !text.includes(':')) {
                    currentCategory = { name: 'Skills', skills: [] };
                    categories.push(currentCategory);

                    // Add items directly instead of greedy split
                    if (text.includes(',') && !text.includes('(')) {
                        const skills = text.split(',').map(s => s.trim()).filter(s => s);
                        currentCategory.skills.push(...skills);
                    } else {
                        currentCategory.skills.push(text);
                    }
                }
                // If it has a colon and comma, it might be the old "Header: skill, skill" format
                else if (text.includes(':') && text.includes(',')) {
                    const parts = text.split(':');
                    const name = parts[0].trim();
                    const skills = parts[1].split(',').map(s => s.trim()).filter(s => s !== '');
                    categories.push({ name, skills });
                    currentCategory = categories[categories.length - 1]; // update pointer
                }
                // Otherwise it's a skill line belonging to the current category
                else {
                    if (!currentCategory) {
                        currentCategory = { name: 'Skills', skills: [] };
                        categories.push(currentCategory);
                    }
                    currentCategory.skills.push(text);
                }
            });

            if (categories.length > 0) {
                skillsJson = JSON.stringify(categories);
            }
        }

        const payload = {
            title: document.getElementById('job-title').value,
            location: document.getElementById('job-location').value,
            experience: document.getElementById('job-experience').value,
            description: document.getElementById('job-description').value,
            skills_data: skillsJson,
            is_active: parseInt(document.getElementById('job-status').value)
        };

        const currentToken = localStorage.getItem('admin_token');
        const url = id ? `${API_BASE_URL}/jobs/${id}` : `${API_BASE_URL}/jobs`;
        const method = id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                jobFormModal.style.display = 'none';
                fetchJobs(); // Refresh list
            } else {
                alert('Error saving job.');
            }
        } catch (error) {
            console.error(error);
            alert('Network error.');
        }
    });

    // Edit Job
    window.editJob = async function (id) {
        const token = localStorage.getItem('admin_token');
        try {
            // First fetch all jobs to get the data (or we could have a single job endpoint)
            const res = await fetch(`${API_BASE_URL}/jobs/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const jobs = await res.json();
            const job = jobs.find(j => j.id === id);

            if (job) {
                modalTitle.textContent = 'Edit Job';
                document.getElementById('job-id').value = job.id;
                document.getElementById('job-title').value = job.title;
                document.getElementById('job-location').value = job.location;
                document.getElementById('job-experience').value = job.experience;
                document.getElementById('job-description').value = job.description;

                // Convert JSON format back to text for editing
                let skillsText = '';
                if (job.skills_data) {
                    try {
                        const parsed = JSON.parse(job.skills_data);
                        if (Array.isArray(parsed)) {
                            skillsText = parsed.map(cat => `${cat.name} :\n\n${cat.skills.join('\n\n')}`).join('\n\n');
                        }
                    } catch (e) {
                        console.error("Error parsing skills data on edit", e);
                    }
                }

                document.getElementById('job-skills-data').value = skillsText;
                document.getElementById('job-status').value = job.is_active ? "1" : "0";

                jobFormModal.style.display = 'flex';
            }
        } catch (error) {
            console.error('Error loading job details', error);
        }
    };

    // Delete Job
    window.deleteJob = async function (id) {
        if (!confirm('Are you sure you want to delete this job posting?')) return;

        const token = localStorage.getItem('admin_token');
        try {
            const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                fetchJobs(); // Refresh list
            } else {
                alert('Error deleting job.');
            }
        } catch (error) {
            console.error(error);
            alert('Network error.');
        }
    };
});
