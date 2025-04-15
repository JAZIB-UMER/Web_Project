// ResuScan Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    Dashboard.init();
});

const Dashboard = {
    // State variables
    state: {
        candidates: [],
        filteredCandidates: [],
        currentView: 'grid', // grid or list
        sortField: 'uploadDate',
        sortDirection: 'desc',
        filters: {
            skills: [],
            experience: null,
            education: null
        },
        currentPage: 1,
        itemsPerPage: 10
    },

    // UI elements
    elements: {},

    // Initialize the dashboard
    init: function() {
        this.cacheDOMElements();
        this.bindEvents();
        this.loadDashboardData();
        this.initCharts();
    },

    // Cache DOM elements for better performance
    cacheDOMElements: function() {
        this.elements = {
            candidatesList: document.getElementById('candidates-list'),
            searchInput: document.getElementById('search-input'),
            viewToggle: document.getElementById('view-toggle'),
            sortOptions: document.getElementById('sort-options'),
            filterOptions: document.querySelectorAll('.filter-option'),
            skillsFilter: document.getElementById('skills-filter'),
            pagination: document.getElementById('pagination'),
            uploadButton: document.getElementById('upload-button'),
            exportButton: document.getElementById('export-button'),
            candidateModal: document.getElementById('candidate-modal'),
            modalClose: document.getElementById('modal-close'),
            skillsChart: document.getElementById('skills-chart'),
            experienceChart: document.getElementById('experience-chart')
        };
    },

    // Bind event handlers
    bindEvents: function() {
        // Only bind events if elements exist (prevents errors on non-dashboard pages)
        if (!this.elements.candidatesList) return;

        // Search input
        this.elements.searchInput.addEventListener('input', this.handleSearch.bind(this));

        // View toggle (grid/list)
        if (this.elements.viewToggle) {
            this.elements.viewToggle.addEventListener('click', this.toggleView.bind(this));
        }

        // Sort options
        if (this.elements.sortOptions) {
            this.elements.sortOptions.addEventListener('change', this.handleSort.bind(this));
        }

        // Filter options
        this.elements.filterOptions.forEach(filter => {
            filter.addEventListener('change', this.handleFilter.bind(this));
        });

        // Skills filter
        if (this.elements.skillsFilter) {
            this.elements.skillsFilter.addEventListener('change', this.handleSkillsFilter.bind(this));
        }

        // Upload button
        if (this.elements.uploadButton) {
            this.elements.uploadButton.addEventListener('click', this.handleUpload.bind(this));
        }

        // Export button
        if (this.elements.exportButton) {
            this.elements.exportButton.addEventListener('click', this.handleExport.bind(this));
        }

        // Modal close button
        if (this.elements.modalClose) {
            this.elements.modalClose.addEventListener('click', this.closeModal.bind(this));
        }

        // Add event delegation for candidate cards
        if (this.elements.candidatesList) {
            this.elements.candidatesList.addEventListener('click', this.handleCandidateClick.bind(this));
        }
    },

    // Load dashboard data from API or local storage
    loadDashboardData: function() {
        // In a real implementation, this would fetch data from an API
        // For demo purposes, we'll use sample data
        this.generateSampleData().then(data => {
            this.state.candidates = data;
            this.state.filteredCandidates = [...data];
            this.renderCandidates();
            this.updateCharts();
        });
    },

    // Generate sample data for demo purposes
    generateSampleData: function() {
        return new Promise(resolve => {
            const sampleCandidates = [];
            const skills = [
                'JavaScript', 'Python', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 
                'MongoDB', 'SQL', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 
                'Data Analysis', 'UI/UX Design', 'Project Management', 'Agile', 'Scrum'
            ];

            const companies = [
                'Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple', 'Netflix', 'Twitter',
                'IBM', 'Oracle', 'Intel', 'Cisco', 'Uber', 'Airbnb', 'Spotify', 'LinkedIn'
            ];

            const universities = [
                'MIT', 'Stanford', 'Harvard', 'UC Berkeley', 'Georgia Tech', 'Caltech',
                'Carnegie Mellon', 'University of Michigan', 'Cornell', 'Princeton'
            ];

            const degrees = [
                'Computer Science', 'Information Technology', 'Software Engineering',
                'Data Science', 'Business Administration', 'Marketing', 'Design'
            ];

            for (let i = 1; i <= 50; i++) {
                // Generate random skills (3-7)
                const candidateSkills = [];
                const skillCount = 3 + Math.floor(Math.random() * 5);
                for (let j = 0; j < skillCount; j++) {
                    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
                    if (!candidateSkills.includes(randomSkill)) {
                        candidateSkills.push(randomSkill);
                    }
                }

                // Generate random experience (1-10 years)
                const experienceYears = 1 + Math.floor(Math.random() * 10);
                
                // Generate random education
                const university = universities[Math.floor(Math.random() * universities.length)];
                const degree = degrees[Math.floor(Math.random() * degrees.length)];
                
                // Generate random company
                const company = companies[Math.floor(Math.random() * companies.length)];
                
                // Generate random score (70-100)
                const matchScore = 70 + Math.floor(Math.random() * 31);
                
                // Generate random upload date (last 30 days)
                const daysAgo = Math.floor(Math.random() * 30);
                const uploadDate = new Date();
                uploadDate.setDate(uploadDate.getDate() - daysAgo);
                
                sampleCandidates.push({
                    id: i,
                    name: `Candidate ${i}`,
                    email: `candidate${i}@example.com`,
                    phone: `(555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
                    location: 'New York, NY',
                    title: `${['Senior', 'Junior', 'Lead', 'Staff'][Math.floor(Math.random() * 4)]} Developer`,
                    company: company,
                    experience: experienceYears,
                    education: {
                        degree: `Bachelor's in ${degree}`,
                        university: university
                    },
                    skills: candidateSkills,
                    matchScore: matchScore,
                    uploadDate: uploadDate,
                    resumeUrl: `#resume-${i}`
                });
            }
            
            resolve(sampleCandidates);
        });
    },

    // Render candidates list/grid
    renderCandidates: function() {
        if (!this.elements.candidatesList) return;
        
        // Clear existing candidates
        this.elements.candidatesList.innerHTML = '';
        
        // Calculate pagination
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const endIndex = startIndex + this.state.itemsPerPage;
        const candidatesToShow = this.state.filteredCandidates.slice(startIndex, endIndex);
        
        // Check if grid or list view
        const viewClass = this.state.currentView === 'grid' ? 'candidate-card' : 'candidate-row';
        
        // Render each candidate
        candidatesToShow.forEach(candidate => {
            const candidateEl = document.createElement('div');
            candidateEl.className = viewClass;
            candidateEl.dataset.id = candidate.id;
            
            if (this.state.currentView === 'grid') {
                candidateEl.innerHTML = `
                    <div class="candidate-header">
                        <div class="candidate-score">${candidate.matchScore}%</div>
                        <div class="candidate-actions">
                            <button class="candidate-action" data-action="view">View</button>
                            <button class="candidate-action" data-action="download">↓</button>
                            <button class="candidate-action" data-action="favorite">★</button>
                        </div>
                    </div>
                    <div class="candidate-info">
                        <h3 class="candidate-name">${candidate.name}</h3>
                        <p class="candidate-title">${candidate.title} at ${candidate.company}</p>
                        <p class="candidate-exp">${candidate.experience} years experience</p>
                        <div class="candidate-skills">
                            ${candidate.skills.slice(0, 3).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            ${candidate.skills.length > 3 ? `<span class="skill-more">+${candidate.skills.length - 3}</span>` : ''}
                        </div>
                    </div>
                    <div class="candidate-footer">
                        <div class="candidate-date">Uploaded ${this.formatDate(candidate.uploadDate)}</div>
                    </div>
                `;
            } else {
                candidateEl.innerHTML = `
                    <div class="candidate-row-score">${candidate.matchScore}%</div>
                    <div class="candidate-row-info">
                        <div class="candidate-row-name">${candidate.name}</div>
                        <div class="candidate-row-title">${candidate.title} at ${candidate.company}</div>
                    </div>
                    <div class="candidate-row-exp">${candidate.experience} years</div>
                    <div class="candidate-row-skills">
                        ${candidate.skills.slice(0, 2).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        ${candidate.skills.length > 2 ? `<span class="skill-more">+${candidate.skills.length - 2}</span>` : ''}
                    </div>
                    <div class="candidate-row-date">${this.formatDate(candidate.uploadDate)}</div>
                    <div class="candidate-row-actions">
                        <button class="candidate-action" data-action="view">View</button>
                        <button class="candidate-action" data-action="download">↓</button>
                        <button class="candidate-action" data-action="favorite">★</button>
                    </div>
                `;
            }
            
            this.elements.candidatesList.appendChild(candidateEl);
        });
        
        // Update pagination
        this.updatePagination();
    },

    // Update pagination controls
    updatePagination: function() {
        if (!this.elements.pagination) return;
        
        const totalPages = Math.ceil(this.state.filteredCandidates.length / this.state.itemsPerPage);
        
        this.elements.pagination.innerHTML = '';
        
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-button';
        prevButton.textContent = '←';
        prevButton.disabled = this.state.currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (this.state.currentPage > 1) {
                this.state.currentPage--;
                this.renderCandidates();
            }
        });
        this.elements.pagination.appendChild(prevButton);
        
        // Page numbers
        const maxPages = 5; // Show max 5 page numbers
        const startPage = Math.max(1, this.state.currentPage - Math.floor(maxPages / 2));
        const endPage = Math.min(totalPages, startPage + maxPages - 1);
        
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = `pagination-button ${i === this.state.currentPage ? 'active' : ''}`;
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                this.state.currentPage = i;
                this.renderCandidates();
            });
            this.elements.pagination.appendChild(pageButton);
        }
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-button';
        nextButton.textContent = '→';
        nextButton.disabled = this.state.currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (this.state.currentPage < totalPages) {
                this.state.currentPage++;
                this.renderCandidates();
            }
        });
        this.elements.pagination.appendChild(nextButton);
    },

    // Initialize charts
    initCharts: function() {
        // In a real implementation, this would use a charting library like Chart.js
        // For demo purposes, we'll implement simple charts
        this.updateCharts();
    },

    // Update charts with current data
    updateCharts: function() {
        if (!this.elements.skillsChart || !this.elements.experienceChart) return;
        
        // Skills chart
        this.renderSkillsChart();
        
        // Experience chart
        this.renderExperienceChart();
    },

    // Render skills chart
    renderSkillsChart: function() {
        // Simple implementation - in real app, use a chart library
        const skillsChart = this.elements.skillsChart;
        skillsChart.innerHTML = '';
        
        // Count skills frequency
        const skillsCount = {};
        this.state.candidates.forEach(candidate => {
            candidate.skills.forEach(skill => {
                skillsCount[skill] = (skillsCount[skill] || 0) + 1;
            });
        });
        
        // Sort skills by frequency
        const sortedSkills = Object.entries(skillsCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8); // Top 8 skills
        
        // Find max count for scaling
        const maxCount = sortedSkills.length > 0 ? sortedSkills[0][1] : 0;
        
        // Create chart bars
        sortedSkills.forEach(([skill, count]) => {
            const barContainer = document.createElement('div');
            barContainer.className = 'chart-bar-container';
            
            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = skill;
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.width = `${(count / maxCount) * 100}%`;
            
            const value = document.createElement('div');
            value.className = 'chart-value';
            value.textContent = count;
            
            barContainer.appendChild(label);
            barContainer.appendChild(bar);
            barContainer.appendChild(value);
            skillsChart.appendChild(barContainer);
        });
    },

    // Render experience chart
    renderExperienceChart: function() {
        // Simple implementation - in real app, use a chart library
        const experienceChart = this.elements.experienceChart;
        experienceChart.innerHTML = '';
        
        // Count experience ranges
        const expRanges = {
            '0-2 years': 0,
            '3-5 years': 0,
            '6-8 years': 0,
            '9+ years': 0
        };
        
        this.state.candidates.forEach(candidate => {
            const exp = candidate.experience;
            if (exp <= 2) expRanges['0-2 years']++;
            else if (exp <= 5) expRanges['3-5 years']++;
            else if (exp <= 8) expRanges['6-8 years']++;
            else expRanges['9+ years']++;
        });
        
        // Find max count for scaling
        const maxCount = Math.max(...Object.values(expRanges));
        
        // Create chart bars
        Object.entries(expRanges).forEach(([range, count]) => {
            const barContainer = document.createElement('div');
            barContainer.className = 'chart-bar-container';
            
            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = range;
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            bar.style.width = `${(count / maxCount) * 100}%`;
            
            const value = document.createElement('div');
            value.className = 'chart-value';
            value.textContent = count;
            
            barContainer.appendChild(label);
            barContainer.appendChild(bar);
            barContainer.appendChild(value);
            experienceChart.appendChild(barContainer);
        });
    },

    // Handle search input
    handleSearch: function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        if (!searchTerm) {
            this.state.filteredCandidates = [...this.state.candidates];
        } else {
            this.state.filteredCandidates = this.state.candidates.filter(candidate => {
                return (
                    candidate.name.toLowerCase().includes(searchTerm) ||
                    candidate.title.toLowerCase().includes(searchTerm) ||
                    candidate.company.toLowerCase().includes(searchTerm) ||
                    candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm))
                );
            });
        }
        
        this.state.currentPage = 1; // Reset to first page
        this.renderCandidates();
    },

    // Toggle between grid and list view
    toggleView: function(e) {
        this.state.currentView = this.state.currentView === 'grid' ? 'list' : 'grid';
        
        // Update toggle button
        if (e && e.target) {
            e.target.textContent = this.state.currentView === 'grid' ? 'List View' : 'Grid View';
        }
        
        this.renderCandidates();
    },

    // Handle sort option change
    handleSort: function(e) {
        const [field, direction] = e.target.value.split('-');
        this.state.sortField = field;
        this.state.sortDirection = direction;
        
        this.sortCandidates();
        this.renderCandidates();
    },

    // Sort candidates based on current sort settings
    sortCandidates: function() {
        this.state.filteredCandidates.sort((a, b) => {
            let comparison = 0;
            
            switch (this.state.sortField) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'matchScore':
                    comparison = a.matchScore - b.matchScore;
                    break;
                case 'experience':
                    comparison = a.experience - b.experience;
                    break;
                case 'uploadDate':
                    comparison = new Date(a.uploadDate) - new Date(b.uploadDate);
                    break;
                default:
                    comparison = 0;
            }
            
            return this.state.sortDirection === 'asc' ? comparison : -comparison;
        });
    },

    // Handle filter changes
    handleFilter: function(e) {
        const filter = e.target.name;
        const value = e.target.value;
        
        this.state.filters[filter] = value === 'all' ? null : value;
        this.applyFilters();
    },

    // Handle skills filter
    handleSkillsFilter: function(e) {
        const selectedSkills = Array.from(e.target.selectedOptions).map(option => option.value);
        this.state.filters.skills = selectedSkills;
        this.applyFilters();
    },

    // Apply all active filters
    applyFilters: function() {
        this.state.filteredCandidates = this.state.candidates.filter(candidate => {
            // Filter by experience
            if (this.state.filters.experience) {
                const [min, max] = this.state.filters.experience.split('-').map(Number);
                if (!(candidate.experience >= min && (max === 0 || candidate.experience <= max))) {
                    return false;
                }
            }
            
            // Filter by education
            if (this.state.filters.education && !candidate.education.degree.includes(this.state.filters.education)) {
                return false;
            }
            
            // Filter by skills
            if (this.state.filters.skills && this.state.filters.skills.length > 0) {
                if (!this.state.filters.skills.some(skill => candidate.skills.includes(skill))) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.state.currentPage = 1; // Reset to first page
        this.sortCandidates();
        this.renderCandidates();
    },

    // Handle upload button click
    handleUpload: function() {
        // Create a file input element
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.docx,.doc,.txt';
        fileInput.multiple = true;
        
        // Trigger click event on file input
        fileInput.click();
        
        // Handle file selection
        fileInput.addEventListener('change', e => {
            const files = e.target.files;
            if (files.length === 0) return;
            
            // Show upload progress (simulated)
            const uploadModal = document.getElementById('upload-modal');
            const progressBar = document.getElementById('upload-progress-bar');
            const resultText = document.getElementById('upload-result');
            
            if (uploadModal) {
                uploadModal.style.display = 'flex';
                
                let progress = 0;
                const interval = setInterval(() => {
                    progress += 5;
                    if (progressBar) progressBar.style.width = `${progress}%`;
                    
                    if (progress >= 100) {
                        clearInterval(interval);
                        if (resultText) resultText.textContent = `${files.length} resume(s) uploaded successfully!`;
                        
                        // Refresh dashboard data after delay
                        setTimeout(() => {
                            if (uploadModal) uploadModal.style.display = 'none';
                            this.loadDashboardData();
                        }, 1500);
                    }
                }, 100);
            }
        });
    },

    // Handle export button click
    handleExport: function() {
        const exportOptions = ['CSV', 'JSON', 'PDF', 'Excel'];
        const format = prompt(`Choose export format: ${exportOptions.join(', ')}`);
        
        if (!format || !exportOptions.map(o => o.toLowerCase()).includes(format.toLowerCase())) {
            alert('Invalid format selected. Please try again.');
            return;
        }
        
        // Simulate export (in real app, would generate actual file)
        alert(`Exporting ${this.state.filteredCandidates.length} candidates to ${format.toUpperCase()} format...`);
        
        // In a real implementation, we would generate and download the file here
        setTimeout(() => {
            alert(`Export complete! File saved as ResuScan_Candidates_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`);
        }, 1500);
    },

  // Handle candidate card click
  handleCandidateClick: function(e) {
    // Find the candidate element
    const candidateEl = e.target.closest('.candidate-card, .candidate-row');
    if (!candidateEl) return;
    
    const candidateId = parseInt(candidateEl.dataset.id);
    const candidate = this.state.candidates.find(c => c.id === candidateId);
    
    if (!candidate) return;
    
    // Check if action button was clicked
    const actionButton = e.target.closest('.candidate-action');
    if (actionButton) {
        const action = actionButton.dataset.action;
        
        switch (action) {
            case 'view':
                this.showCandidateModal(candidate);
                break;
            case 'download':
                this.downloadResume(candidate);
                break;
            case 'favorite':
                this.toggleFavorite(candidate, actionButton);
                break;
            default:
                // If no specific action, show modal
                this.showCandidateModal(candidate);
        }
    } else {
        // If general card area clicked, show modal
        this.showCandidateModal(candidate);
    }
},

// Show candidate details modal
showCandidateModal: function(candidate) {
    if (!this.elements.candidateModal) return;
    
    const modalBody = document.querySelector('#candidate-modal .modal-body');
    if (!modalBody) return;
    
    // Populate modal with candidate details
    modalBody.innerHTML = `
        <div class="candidate-profile">
            <div class="candidate-header">
                <h2>${candidate.name}</h2>
                <div class="candidate-match">
                    <div class="match-score">${candidate.matchScore}%</div>
                    <div class="match-label">Match</div>
                </div>
            </div>
            
            <div class="candidate-details">
                <div class="detail-section">
                    <h3>Contact Information</h3>
                    <p><strong>Email:</strong> ${candidate.email}</p>
                    <p><strong>Phone:</strong> ${candidate.phone}</p>
                    <p><strong>Location:</strong> ${candidate.location}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Professional Experience</h3>
                    <p><strong>Current Position:</strong> ${candidate.title} at ${candidate.company}</p>
                    <p><strong>Experience:</strong> ${candidate.experience} years</p>
                </div>
                
                <div class="detail-section">
                    <h3>Education</h3>
                    <p>${candidate.education.degree}</p>
                    <p>${candidate.education.university}</p>
                </div>
                
                <div class="detail-section">
                    <h3>Skills</h3>
                    <div class="skill-tags">
                        ${candidate.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    this.elements.candidateModal.style.display = 'flex';
},

// Close candidate modal
closeModal: function() {
    if (this.elements.candidateModal) {
        this.elements.candidateModal.style.display = 'none';
    }
},

// Download candidate resume
downloadResume: function(candidate) {
    // In a real app, this would download the actual resume file
    alert(`Downloading resume for ${candidate.name}...`);
    
    // Simulate download delay
    setTimeout(() => {
        alert(`Resume for ${candidate.name} downloaded successfully!`);
    }, 1000);
},

// Toggle favorite status
toggleFavorite: function(candidate, button) {
    // In a real app, this would update the database
    candidate.favorite = !candidate.favorite;
    
    // Update button appearance
    if (button) {
        button.classList.toggle('active');
        button.textContent = candidate.favorite ? '★' : '☆';
    }
    
    alert(`${candidate.name} ${candidate.favorite ? 'added to' : 'removed from'} favorites!`);
},

// Format date for display
formatDate: function(date) {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
        return `${Math.floor(diffDays / 30)} months ago`;
    }
}
};

// Export the Dashboard object for use in other scripts
window.Dashboard = Dashboard;