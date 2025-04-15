    document.addEventListener('DOMContentLoaded', function() {
        const uploadBox = document.getElementById('upload-box');
        const fileUpload = document.getElementById('file-upload');
        const progressBar = document.getElementById('upload-progress-bar');
        const progressContainer = document.querySelector('.upload-progress');
        const resultContainer = document.getElementById('upload-result');
        const resultModal = document.getElementById('result-modal');
        const modalBody = document.getElementById('modal-body');
        
        if (!uploadBox || !fileUpload) return;
        
        // Handle drag and drop events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        ['dragenter', 'dragover'].forEach(eventName => {
            uploadBox.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            uploadBox.addEventListener(eventName, unhighlight, false);
        });
        
        function highlight() {
            uploadBox.classList.add('highlight');
        }
        
        function unhighlight() {
            uploadBox.classList.remove('highlight');
        }
        
        // Handle file drop
        uploadBox.addEventListener('drop', handleDrop, false);
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
        }
        
        // Handle file input change
        fileUpload.addEventListener('change', function() {
            handleFiles(this.files);
        });
        
        function handleFiles(files) {
            if (files.length === 0) return;
            
            const validFileTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
            const maxFileSize = 10 * 1024 * 1024; // 10MB
            
            // Validate files
            let invalidFiles = [];
            
            for (const file of files) {
                if (!validFileTypes.includes(file.type)) {
                    invalidFiles.push(`${file.name} (Invalid file type)`);
                } else if (file.size > maxFileSize) {
                    invalidFiles.push(`${file.name} (File too large)`);
                }
            }
            
            if (invalidFiles.length > 0) {
                showError(`Invalid files: ${invalidFiles.join(', ')}`);
                return;
            }
            
            // Process valid files
            uploadFiles(files);
        }
        
        function uploadFiles(files) {
            // Change upload box state
            uploadBox.classList.add('processing');
            progressContainer.style.display = 'block';
            resultContainer.style.display = 'none';
            
            // Simulate file upload with progress
            let progress = 0;
            const totalFiles = files.length;
            let processedFiles = 0;
            
            // Track parsed data for each file
            const parsedData = [];
            
            const progressInterval = setInterval(() => {
                progress += 5;
                progressBar.style.width = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    processedFiles++;
                    
                    // Add mock parsed data
                    const mockData = generateMockResumeData();
                    parsedData.push(mockData);
                    
                    if (processedFiles === totalFiles) {
                        // All files processed
                        setTimeout(() => {
                            uploadBox.classList.remove('processing');
                            uploadBox.classList.add('success');
                            resultContainer.className = 'upload-result success';
                            resultContainer.style.display = 'block';
                            resultContainer.innerHTML = `Successfully parsed ${totalFiles} resume${totalFiles > 1 ? 's' : ''}!`;
                            
                            // Show modal with parsed data
                            showParseResults(parsedData);
                        }, 500);
                    } else {
                        // Reset progress for next file
                        progress = 0;
                        progressBar.style.width = '0%';
                    }
                }
            }, 100);
        }
        
        function showError(message) {
            uploadBox.classList.add('error');
            resultContainer.className = 'upload-result error';
            resultContainer.style.display = 'block';
            resultContainer.innerHTML = message;
            
            // Reset after a few seconds
            setTimeout(() => {
                uploadBox.classList.remove('error');
                resultContainer.style.display = 'none';
            }, 3000);
        }
        
        function showParseResults(parsedData) {
            if (!resultModal || !modalBody || parsedData.length === 0) return;
            
            let modalContent = '';
            
            parsedData.forEach((data, index) => {
                modalContent += `
                    <div class="parsed-resume ${index > 0 ? 'mt-4 pt-4 border-top' : ''}">
                        <h4>${data.name}</h4>
                        <p><strong>Email:</strong> ${data.email}</p>
                        <p><strong>Phone:</strong> ${data.phone}</p>
                        <p><strong>Location:</strong> ${data.location}</p>
                        
                        <h5 class="mt-3">Skills</h5>
                        <div class="skills-tags">
                            ${data.skills.map(skill => `<span class="badge badge-primary">${skill}</span>`).join(' ')}
                        </div>
                        
                        <h5 class="mt-3">Experience</h5>
                        <ul>
                            ${data.experience.map(exp => `
                                <li>
                                    <strong>${exp.title}</strong> at ${exp.company}<br>
                                    <small>${exp.period}</small>
                                </li>
                            `).join('')}
                        </ul>
                        
                        <h5 class="mt-3">Education</h5>
                        <ul>
                            ${data.education.map(edu => `
                                <li>
                                    <strong>${edu.degree}</strong> - ${edu.institution}<br>
                                    <small>${edu.period}</small>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            });
            
            modalBody.innerHTML = modalContent;
            resultModal.classList.add('active');
        }
        
        function generateMockResumeData() {
            const names = ['John Smith', 'Emma Wilson', 'Michael Brown', 'Sarah Davis', 'David Lee'];
            const companies = ['Tech Innovations', 'Digital Solutions', 'DataCraft', 'FutureTech', 'CodeMasters'];
            const skills = [
                'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 'Docker', 
                'Machine Learning', 'Data Analysis', 'Git', 'Java', 'C++', 'Ruby',
                'Project Management', 'Agile', 'Scrum', 'Leadership', 'Communication'
            ];
            
            const randomName = names[Math.floor(Math.random() * names.length)];
            const firstName = randomName.split(' ')[0].toLowerCase();
            
            // Create a random set of skills
            const skillCount = 5 + Math.floor(Math.random() * 5);
            const shuffledSkills = skills.sort(() => 0.5 - Math.random());
            const randomSkills = shuffledSkills.slice(0, skillCount);
            
            return {
                name: randomName,
                email: `${firstName}@example.com`,
                phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
                location: ['New York, NY', 'San Francisco, CA', 'Seattle, WA', 'Austin, TX', 'Boston, MA'][Math.floor(Math.random() * 5)],
                skills: randomSkills,
                experience: [
                    {
                        title: ['Senior Developer', 'Software Engineer', 'Full Stack Developer', 'Project Manager', 'Data Scientist'][Math.floor(Math.random() * 5)],
                        company: companies[Math.floor(Math.random() * companies.length)],
                        period: 'Jan 2022 - Present'
                    },
                    {
                        title: ['Developer', 'Junior Engineer', 'Analyst', 'Team Lead', 'Associate'][Math.floor(Math.random() * 5)],
                        company: companies[Math.floor(Math.random() * companies.length)],
                        period: 'May 2020 - Dec 2021'
                    }
                ],
                education: [
                    {
                        degree: ['BS Computer Science', 'MS Information Technology', 'BA Business', 'MS Computer Engineering', 'MBA'][Math.floor(Math.random() * 5)],
                        institution: ['Stanford University', 'MIT', 'UC Berkeley', 'Georgia Tech', 'Harvard University'][Math.floor(Math.random() * 5)],
                        period: '2016 - 2020'
                    }
                ]
            };
        }
    });