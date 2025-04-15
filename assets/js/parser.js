// ResuScan AI Parser Logic
const ResuParser = {
    // Configuration options
    config: {
        apiEndpoint: 'https://api.resuscan.com/v1/parse',
        supportedFormats: ['pdf', 'docx', 'doc', 'txt'],
        maxFileSize: 10 * 1024 * 1024, // 10MB
        processingDelay: 2000 // Simulated processing time in ms
    },

    // Initialize the parser
    init: function() {
        console.log('ResuParser initialized');
        // Initialize NLP models and other necessary components
        this.loadModels();
    },

    // Load AI models (simulated)
    loadModels: function() {
        console.log('Loading NLP models...');
        // In a real implementation, this would load the required ML models
    },

    // Parse a single resume file
    parseResume: function(file) {
        return new Promise((resolve, reject) => {
            if (!this.validateFile(file)) {
                reject('Invalid file format or size');
                return;
            }

            // In a real implementation, this would send the file to an API
            // For demo purposes, we'll simulate the parsing process
            this.simulateProcessing(file).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    },

    // Parse multiple resume files
    parseMultipleResumes: function(files) {
        const promises = [];
        for (let i = 0; i < files.length; i++) {
            promises.push(this.parseResume(files[i]));
        }
        return Promise.all(promises);
    },

    // Validate file format and size
    validateFile: function(file) {
        // Check file size
        if (file.size > this.config.maxFileSize) {
            console.error('File too large:', file.name);
            return false;
        }

        // Check file extension
        const extension = file.name.split('.').pop().toLowerCase();
        if (!this.config.supportedFormats.includes(extension)) {
            console.error('Unsupported file format:', extension);
            return false;
        }

        return true;
    },

    // Simulate the parsing process (for demo)
    simulateProcessing: function(file) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate sample parsed data based on file name
                const fileName = file.name.toLowerCase();
                const parsedData = this.generateSampleData(fileName);
                resolve(parsedData);
            }, this.config.processingDelay);
        });
    },

    // Generate sample parsed data (for demo)
    generateSampleData: function(fileName) {
        // Generate different types of sample data based on file name
        const nameHints = fileName.split(/[_\-\.]/);
        const randomSkills = [
            'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS', 
            'Machine Learning', 'Data Analysis', 'Project Management',
            'UI/UX Design', 'Marketing', 'Sales', 'Customer Service'
        ];
        
        // Select random skills based on filename
        const skills = [];
        const nameSum = nameHints.join('').length;
        for (let i = 0; i < 3 + (nameSum % 4); i++) {
            const randomIndex = (nameSum * (i+1)) % randomSkills.length;
            if (!skills.includes(randomSkills[randomIndex])) {
                skills.push(randomSkills[randomIndex]);
            }
        }

        return {
            personalInfo: {
                name: this.capitalizeWords(nameHints[0].replace(/[0-9]/g, '') || 'John Doe'),
                email: `${nameHints[0].toLowerCase()}@example.com`,
                phone: `(555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
                location: 'New York, NY',
                linkedin: `linkedin.com/in/${nameHints[0].toLowerCase()}`
            },
            education: [
                {
                    degree: 'Bachelor of Science',
                    field: 'Computer Science',
                    institution: 'University of Technology',
                    location: 'Boston, MA',
                    dates: '2016 - 2020',
                    gpa: '3.8/4.0'
                }
            ],
            experience: [
                {
                    title: 'Senior Developer',
                    company: 'Tech Solutions Inc.',
                    location: 'Remote',
                    dates: 'Jan 2022 - Present',
                    description: 'Led a team of 5 developers in creating scalable web applications for enterprise clients.'
                },
                {
                    title: 'Web Developer',
                    company: 'Digital Innovations',
                    location: 'San Francisco, CA',
                    dates: 'Mar 2020 - Dec 2021',
                    description: 'Developed and maintained client websites using React, Node.js, and MongoDB.'
                }
            ],
            skills: skills,
            languages: ['English (Native)', 'Spanish (Intermediate)'],
            certifications: ['AWS Certified Developer', 'Google Professional Cloud Developer'],
            confidenceScore: Math.floor(85 + Math.random() * 15) // 85-99%
        };
    },

    // Helper function to capitalize words
    capitalizeWords: function(str) {
        return str.replace(/\b\w/g, l => l.toUpperCase());
    },

    // Export data in various formats
    exportData: function(parsedData, format) {
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(parsedData, null, 2);
            case 'csv':
                return this.convertToCSV(parsedData);
            case 'ats':
                return this.formatForATS(parsedData);
            default:
                return JSON.stringify(parsedData);
        }
    },

    // Convert parsed data to CSV format
    convertToCSV: function(data) {
        // Simplified implementation for demo purposes
        const header = 'Name,Email,Phone,Location,Skills\n';
        const row = `${data.personalInfo.name},${data.personalInfo.email},${data.personalInfo.phone},${data.personalInfo.location},"${data.skills.join(', ')}"\n`;
        return header + row;
    },

    // Format data for ATS systems
    formatForATS: function(data) {
        // Simplified implementation for demo purposes
        return {
            candidate: {
                fullName: data.personalInfo.name,
                contactInfo: {
                    email: data.personalInfo.email,
                    phone: data.personalInfo.phone,
                    location: data.personalInfo.location
                },
                education: data.education,
                workHistory: data.experience,
                skills: data.skills,
                additionalInfo: {
                    languages: data.languages,
                    certifications: data.certifications
                }
            },
            metadata: {
                parseDate: new Date().toISOString(),
                confidenceScore: data.confidenceScore,
                source: 'ResuScan AI Parser'
            }
        };
    }
};

// Initialize the parser when the script loads
document.addEventListener('DOMContentLoaded', function() {
    ResuParser.init();
});

// Export the parser for use in other scripts
window.ResuParser = ResuParser;