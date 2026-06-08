import './style.css';

document.documentElement.setAttribute('data-webtui-theme', 'nord');

const projectsData = [
    {
        category: 'systems',
        name: 'Rio: Async I/O Framework',
        url: 'https://github.com/rrrinav/rio',
        tech: 'C++23 / io_uring / Metaprogramming',
        tech_title: 'C++23, C++20 Modules, io_uring, Metaprogramming',
        description: 'Zero-cost, asynchronous I/O and networking framework using Linux io_uring.',
    },
    {
        category: 'systems',
        name: 'Rivage: Distributed Map-Reduce',
        url: 'https://github.com/rrrinav/rivage',
        tech: 'Golang / gRPC / Distributed Systems',
        tech_title: 'Golang, gRPC, Distributed Systems',
        description: 'Zero-dependency distributed Map-Reduce computation engine with custom WAL.',
    },
    {
        category: 'systems',
        name: 'Phos Programming Language',
        url: 'https://github.com/rrrinav/Phos',
        tech: 'C++23 / Compilers',
        tech_title: 'C++23, Compilers, Language Design',
        description: 'Statically-typed language with custom lexer, parser, and arena allocator.',
    },
    {
        category: 'systems',
        name: 'In-Memory Caching DB',
        url: 'https://github.com/rrrinav/cache-db',
        tech: 'C++ / Coroutines / epoll',
        tech_title: 'C++ coroutines for async I/O, epoll for event loop',
        description: 'Redis-inspired KV-store with custom hash-table & single-threaded async I/O.',
    },
    {
        category: 'web',
        name: 'Drone Trash Surveillance',
        url: 'https://github.com/rrrinav/Dal-Monitoring',
        tech: 'Computer Vision / Edge Inference',
        tech_title: 'Computer Vision, Edge Inference',
        description: 'Autonomous UAV system for trash detection using semantic segmentation.',
    },
    {
        category: 'web',
        name: 'Real-Time Chat App',
        url: 'https://github.com/rrrinav/chat-app',
        tech: 'React / Zustand / WS',
        tech_title: 'React for UI, Zustand for state, WebSockets for realtime updates',
        description: 'Full-stack chat with authentication, media uploads & realtime messaging.',
    },
    {
        category: 'web',
        name: 'Tanks Fog-of-War Game',
        url: 'https://github.com/rrrinav/tank-game',
        tech: 'TS / Canvas / WS',
        tech_title: 'TypeScript for logic, Canvas for rendering, WS for multiplayer',
        description: 'Turn-based online tank battle with fog-of-war mechanics & multiplayer sync.',
    },
];

function activateTab(activeBtn, inactiveBtn, showEl, hideEl) {
    showEl.hidden = false;
    hideEl.hidden = true;
    activeBtn.setAttribute('variant-', 'accent');
    inactiveBtn.setAttribute('variant-', 'background3');
}

function renderProjects() {
    const systemsBody = document.getElementById('systems-tbody');
    const webBody = document.getElementById('web-tbody');

    if (!systemsBody || !webBody) {
        return;
    }

    systemsBody.textContent = '';
    webBody.textContent = '';

    projectsData.forEach((project) => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        const link = document.createElement('a');
        link.href = project.url;
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.textContent = project.name;
        nameCell.appendChild(link);

        const techCell = document.createElement('td');
        techCell.title = project.tech_title;
        techCell.textContent = project.tech;

        const descCell = document.createElement('td');
        descCell.textContent = project.description;

        row.appendChild(nameCell);
        row.appendChild(techCell);
        row.appendChild(descCell);

        if (project.category === 'systems') {
            systemsBody.appendChild(row);
        } else if (project.category === 'web') {
            webBody.appendChild(row);
        }
    });
}

async function fetchGitHubStats() {
    const overviewContainer = document.getElementById('github-overview');
    const langsContainer = document.getElementById('github-langs');

    if (!overviewContainer || !langsContainer) {
        return;
    }

    overviewContainer.innerHTML = '<span is-="spinner" variant-="dots"></span>';
    langsContainer.innerHTML = '<span is-="spinner" variant-="dots"></span>';

    try {
        const username = 'rrrinav';
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        if (!userRes.ok) {
            throw new Error('User not found');
        }

        const user = await userRes.json();
        overviewContainer.innerHTML = `
            <span><p><code>Repos: ${user.public_repos}</code></p></span>
            <span><p><code>Followers: ${user.followers}</code></p></span>
            <span><p><code>Following: ${user.following}</code></p></span>
        `;

        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!reposRes.ok) {
            throw new Error('Could not fetch repos');
        }

        const repos = await reposRes.json();
        if (!Array.isArray(repos)) {
            throw new Error('Invalid repos data');
        }

        const langMap = {};
        repos.forEach((repo) => {
            if (repo.language) {
                langMap[repo.language] = (langMap[repo.language] || 0) + 1;
            }
        });

        const total = Object.values(langMap).reduce((sum, value) => sum + value, 0);
        const sortedLangs = Object.entries(langMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        langsContainer.innerHTML = '';

        sortedLangs.forEach(([lang, count]) => {
            const percent = total === 0 ? 0 : Math.round((count / total) * 100);

            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';
            row.style.gap = '4px';
            row.style.marginBottom = '4px';

            const badge = document.createElement('span');
            badge.setAttribute('is-', 'badge');
            badge.setAttribute('variant-', 'nord9');
            badge.style.flex = '0 0 16ch';
            badge.textContent = lang;

            const progress = document.createElement('div');
            progress.setAttribute('is-', 'progress');
            progress.setAttribute('value', percent);
            progress.setAttribute('max', '100');
            progress.style.flex = '1';

            const percentBadge = document.createElement('span');
            percentBadge.setAttribute('is-', 'badge');
            percentBadge.setAttribute('variant-', 'nord8');
            percentBadge.style.flex = '0 0 6ch';
            percentBadge.textContent = `${percent}%`;

            row.appendChild(badge);
            row.appendChild(progress);
            row.appendChild(percentBadge);
            langsContainer.appendChild(row);
        });
    } catch (error) {
        console.warn(error);
        overviewContainer.innerHTML = '<span is-="spinner" variant-="dots"></span>';
        langsContainer.innerHTML = '<span is-="spinner" variant-="dots"></span>';
    }
}

function init() {
    const tabSystems = document.getElementById('tab-systems');
    const tabWeb = document.getElementById('tab-web');
    const systemsProjects = document.getElementById('systems-projects');
    const webProjects = document.getElementById('web-projects');

    if (tabSystems && tabWeb && systemsProjects && webProjects) {
        tabSystems.addEventListener('click', () => {
            activateTab(tabSystems, tabWeb, systemsProjects, webProjects);
        });

        tabWeb.addEventListener('click', () => {
            activateTab(tabWeb, tabSystems, webProjects, systemsProjects);
        });
    }

    renderProjects();
    fetchGitHubStats();
}

document.addEventListener('DOMContentLoaded', init);
