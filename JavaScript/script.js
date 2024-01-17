document.addEventListener('DOMContentLoaded', function() {
    const projectsSection = document.getElementById('projects');

    // Fetch GitHub repositories
    fetch('https://api.github.com/users/Maximilian-Nesslauer/repos')
        .then(response => response.json())
        .then(data => {
            displayProjects(data);
        })
        .catch(error => console.error('Error fetching GitHub repositories:', error));
    
    function displayProjects(repos) {
        repos.forEach(repo => {
            // Filter or sort repositories if needed

            // Create project elements
            const projectDiv = document.createElement('div');
            projectDiv.className = 'project';

            const projectName = document.createElement('h3');
            projectName.textContent = repo.name;

            const projectDescription = document.createElement('p');
            projectDescription.textContent = repo.description || 'No description available';

            const projectLink = document.createElement('a');
            projectLink.href = repo.html_url;
            projectLink.textContent = 'View on GitHub';
            projectLink.target = '_blank';

            // Append elements to the projectDiv
            projectDiv.appendChild(projectName);
            projectDiv.appendChild(projectDescription);
            projectDiv.appendChild(projectLink);

            // Append projectDiv to the projects section
            projectsSection.appendChild(projectDiv);
        });
    }
    // Additional code in script.js

    function filterProjects(language) {
        fetch('https://api.github.com/users/Maximilian-Nesslauer/repos')
            .then(response => response.json())
            .then(data => {
                const filteredProjects = data.filter(repo => repo.language === language);
                displayProjects(filteredProjects);
            })
            .catch(error => console.error('Error fetching GitHub repositories:', error));
    }

    // Add event listeners for filter buttons (assuming you have buttons for filtering)
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            filterProjects(this.dataset.language);
        });
    });

    
});
