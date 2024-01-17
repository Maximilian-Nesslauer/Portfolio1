document.addEventListener('DOMContentLoaded', function() {
    fetchGithubRepositories();
});

function fetchGithubRepositories() {
    fetch('https://api.github.com/users/Maximilian-Nesslauer/repos')
        .then(response => response.json())
        .then(data => {
            data.forEach(repo => displayRepository(repo));
        })
        .catch(error => console.error('Error fetching GitHub repositories:', error));
}

function displayRepository(repo) {
    const projectsSection = document.getElementById('projects');
    const projectDiv = document.createElement('div');
    projectDiv.id = `project-${repo.name}`;
    projectDiv.className = 'project';

    const projectName = document.createElement('h3');
    projectName.textContent = repo.name;

    const projectDescription = document.createElement('p');
    projectDescription.textContent = repo.description || 'No description available';

    const projectDetails = document.createElement('p');
    projectDetails.innerHTML = `Stars: ${repo.stargazers_count} | Forks: ${repo.forks_count}`;

    projectDiv.appendChild(projectName);
    projectDiv.appendChild(projectDescription);
    projectDiv.appendChild(projectDetails);

    const viewFilesButton = document.createElement('button');
    viewFilesButton.textContent = 'View Files';
    viewFilesButton.onclick = () => fetchFileTree(repo.name);
    projectDiv.appendChild(viewFilesButton);

    projectsSection.appendChild(projectDiv);
}

function fetchFileTree(repoName) {
    const projectDiv = document.getElementById(`project-${repoName}`);
    const existingTreeDiv = projectDiv.querySelector('.file-tree');

    // Toggle the visibility of the file tree if it already exists
    if (existingTreeDiv) {
        existingTreeDiv.style.display = existingTreeDiv.style.display === 'none' ? 'block' : 'none';
        return;
    }

    // Fetch and display the file tree if it doesn't exist
    fetch(`https://api.github.com/repos/Maximilian-Nesslauer/${repoName}/git/trees/main?recursive=1`)
        .then(response => response.json())
        .then(data => {
            if (data && data.tree) {
                displayFileTree(data.tree, repoName);
            }
        })
        .catch(error => console.error('Error fetching file tree:', error));
}


function displayFileTree(tree, repoName) {
    const projectDiv = document.getElementById(`project-${repoName}`);
    const treeDiv = document.createElement('div');
    treeDiv.className = 'file-tree';
    tree.forEach(item => {
        const itemElement = createTreeElement(item, repoName);
        treeDiv.appendChild(itemElement);
    });
    projectDiv.appendChild(treeDiv);
}

function createTreeElement(item, repoName) {
    const element = document.createElement('div');
    element.textContent = item.path.split('/').pop(); // Display only the file/directory name

    if (item.type === 'tree') { // 'tree' type represents a folder
        element.className = 'folder-item';
        element.onclick = function() {
            this.classList.toggle('expanded');
        };
    } else if (item.type === 'blob') { // 'blob' type represents a file
        element.className = 'file-item';
        element.onclick = () => {
            viewFileContent(repoName, item.path);
        };
    }
    return element;
}


function viewFileContent(repoName, filePath) {
    fetch(`https://api.github.com/repos/Maximilian-Nesslauer/${repoName}/contents/${filePath}`)
        .then(response => response.json())
        .then(data => {
            if (data.content) {
                const fileContent = atob(data.content); // Decode base64
                displayModal(fileContent);
            }
        })
        .catch(error => console.error('Error fetching file content:', error));
}


function displayModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Use pre and code tags for formatted text display
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = content;
    pre.appendChild(code);
    modalContent.appendChild(pre);

    const closeModal = document.createElement('span');
    closeModal.className = 'close-modal';
    closeModal.textContent = '×';
    closeModal.onclick = function() {
        modal.style.display = 'none';
    };

    modalContent.appendChild(closeModal);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);
    modal.style.display = 'block';
}
