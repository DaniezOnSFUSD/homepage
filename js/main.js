// --- Testing Grounds Inventory ---
const testingGroundsData = [
    { 
        name: "2D Grid PvP Arena Beta", 
        url: "https://daniezonsfusd.github.io/Testing/1.html",
        status: "BETA TESTING NOW" 
    }
];

function renderTestingGrounds() {
    const testingGrid = document.getElementById('testing-grid');
    if (!testingGrid) return;

    if (testingGroundsData.length === 0) {
        testingGrid.style.gridTemplateColumns = "1fr";
        testingGrid.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; border: 1px dashed rgba(255, 255, 255, 0.1); border-radius: 16px; background: rgba(0,0,0,0.15);">
                <i class="fas fa-lock" style="font-size: 2em; color: rgba(255, 193, 7, 0.4); margin-bottom: 15px; display: block;"></i>
                <span style="font-weight: bold; opacity: 0.9; letter-spacing: 1px; color: var(--secondary-text);">NO UNSTABLE EXPERIMENTS RUNNING</span>
                <p style="margin: 8px 0 0; font-size: 0.85em; opacity: 0.5; max-width: 500px; margin-left: auto; margin-right: auto;">
                    All current assets have migrated over to the main production library. Check back later for developer canary builds.
                </p>
            </div>
        `;
    } else {
        testingGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(240px, 1fr))";
        testingGrid.innerHTML = testingGroundsData.map(game => `
            <a href="${game.url}" class="card game-card" style="border-bottom: 3px solid #FFC107;">
                <span style="font-weight: bold;">${game.name}</span>
                <span class="badge" style="background: #FFC107; color: #000; align-self: flex-start; margin-left: 0; margin-top: 10px;">${game.status || 'TEST'}</span>
            </a>
        `).join('');
    }
}

// --- Status Check System ---
const systemChecks = [
    { name: "GitHub API", url: "https://api.github.com/users/daniezonsfusd", icon: "fab fa-github" },
    { name: "Homepage", url: "https://daniezonsfusd.github.io/homepage/", icon: "fas fa-home" },
    { name: "Eaglercraft 1.20", url: "https://daniezonsfusd.github.io/1.20", icon: "fas fa-cube" }
];

function checkSystemStatus() {
    const grid = document.getElementById('status-checker-grid');
    if (!grid) return;
    
    grid.innerHTML = systemChecks.map(system => `
        <div class="card" style="opacity: 0.7;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <i class="${system.icon}" style="font-size: 1.5em; color: var(--primary);"></i>
                <span style="font-weight: bold;">${system.name}</span>
            </div>
            <div style="font-size: 0.85em; color: var(--secondary-text);">Checking...</div>
            <div class="dot online" style="margin-top: 10px;"></div>
        </div>
    `).join('');

    // Perform actual checks
    systemChecks.forEach((system, idx) => {
        fetch(system.url, { method: 'HEAD', mode: 'no-cors' })
            .then(() => {
                const cards = document.querySelectorAll('#status-checker-grid .card');
                if (cards[idx]) {
                    cards[idx].style.opacity = '1';
                    cards[idx].querySelector('.dot').className = 'dot online';
                    cards[idx].querySelector('div:nth-child(2)').textContent = '✓ Online';
                }
            })
            .catch(() => {
                const cards = document.querySelectorAll('#status-checker-grid .card');
                if (cards[idx]) {
                    cards[idx].querySelector('.dot').className = 'dot offline';
                    cards[idx].querySelector('div:nth-child(2)').textContent = '✗ Offline';
                }
            });
    });
}

// --- Global Theme Controls ---
const themeBtn = document.getElementById('theme-toggle');
function setTheme(themeName) { 
    document.body.setAttribute("data-theme", themeName); 
    localStorage.setItem("site-theme", themeName); 
    if (themeBtn) themeBtn.className = themeName === 'light' ? 'fas fa-sun' : 'fas fa-moon';
}
setTheme(localStorage.getItem("site-theme") || "dark");
if (themeBtn) {
    themeBtn.onclick = () => {
        document.body.getAttribute("data-theme") === "dark" ? setTheme("light") : setTheme("dark");
    };
}

// --- Search Utility ---
const searchInput = document.getElementById('nav-search');
const gameCards = document.querySelectorAll('.game-card');
if (searchInput) {
    searchInput.oninput = (e) => {
        const queryValue = e.target.value.toLowerCase();
        let matchedCount = 0;
        gameCards.forEach(card => {
            const isMatch = card.textContent.toLowerCase().includes(queryValue);
            card.style.display = isMatch ? 'flex' : 'none';
            if (isMatch) matchedCount++;
        });
        const resultsCounter = document.getElementById('search-results-count');
        if (resultsCounter) resultsCounter.innerText = `${matchedCount} assets loaded`;
    };
}

// --- Genre Filtering ---
function filterGenre(genre) {
    gameCards.forEach(card => {
        if (genre === 'all') {
            card.style.display = 'flex';
        } else {
            const hasGenre = card.getAttribute(`data-genre-${genre}`) === '1';
            card.style.display = hasGenre ? 'flex' : 'none';
        }
    });
    
    document.querySelectorAll('.genre-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// --- Favorites System ---
function toggleFav(event, name, url) {
    event.preventDefault();
    event.stopPropagation();
    
    let favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favObj = { name, url };
    
    const idx = favs.findIndex(f => f.url === url);
    if (idx > -1) {
        favs.splice(idx, 1);
    } else {
        favs.push(favObj);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favs));
    event.target.closest('.fav-btn').classList.toggle('active');
}

// --- Recent Games ---
function trackRecent(event, name, url) {
    let recent = JSON.parse(localStorage.getItem('recent') || '[]');
    recent = recent.filter(r => r.url !== url);
    recent.unshift({ name, url });
    recent = recent.slice(0, 5);
    localStorage.setItem('recent', JSON.stringify(recent));
}

// --- Stealth Mode Presets ---
const stealthPresets = {
    math: { 
        title: "Unit 3: Algebra & Functions", 
        content: `<h1>Unit 3: Algebra & Functions</h1><p><strong>Subject:</strong> Mathematics</p><hr><h3>Key Concepts:</h3><ul><li>Functions & Relations</li><li>Graphing Techniques</li><li>Algebraic Operations</li></ul>` 
    },
    science: { 
        title: "Unit 5: Cell Biology", 
        content: `<h1>Unit 5: Cell Biology</h1><p><strong>Subject:</strong> Biology</p><hr><h3>Structure:</h3><ul><li>Nucleus Operations</li><li>Mitochondrial Function</li><li>Cell Membrane Transport</li></ul>` 
    },
    socialstudies: { 
        title: "Unit 7: Industrial Revolution", 
        content: `<h1>Unit 7: Industrial Revolution</h1><p><strong>Subject:</strong> History</p><hr><p>Analysis of urbanization, manufacturing innovations, and social change during 1760-1840.</p>` 
    },
    languagearts: { 
        title: "Unit 4: Literary Analysis", 
        content: `<h1>Unit 4: Literary Analysis</h1><p><strong>Subject:</strong> Language Arts</p><hr><p>Detailed exploration of literary devices, symbolism, and thematic development in classic literature.</p>` 
    }
};

function loadStealthPreset(preset) {
    const contentArea = document.getElementById('stealth-content-area');
    if (stealthPresets[preset] && contentArea) {
        contentArea.innerHTML = stealthPresets[preset].content;
    }
}

function toggleStealthEditor() {
    const editor = document.getElementById('stealth-editor');
    if (editor) {
        editor.style.display = editor.style.display === 'none' ? 'block' : 'none';
    }
}

function closeStealthMode() {
    const overlay = document.getElementById('stealth-mode');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function saveCustomStealthPreset() {
    const titleInput = document.getElementById('stealth-title');
    const contentInput = document.getElementById('stealth-content');
    
    if (titleInput && contentInput && titleInput.value && contentInput.value) {
        const key = `custom_${Date.now()}`;
        stealthPresets[key] = {
            title: titleInput.value,
            content: contentInput.value
        };
        
        const customList = document.getElementById('custom-presets-list');
        if (customList) {
            const btn = document.createElement('button');
            btn.className = 'stealth-preset-btn';
            btn.textContent = titleInput.value;
            btn.onclick = () => loadStealthPreset(key);
            customList.appendChild(btn);
        }
        
        titleInput.value = '';
        contentInput.value = '';
        alert('Preset saved!');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    const stealthMode = document.getElementById('stealth-mode');
    
    if (e.key === '[') {
        if (stealthMode) stealthMode.style.display = 'block';
    }
    if (e.key === ']') {
        closeStealthMode();
    }
    if (e.key === '/') {
        e.preventDefault();
        const searchInput = document.getElementById('nav-search');
        if (searchInput) searchInput.focus();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    renderTestingGrounds();
    checkSystemStatus();
});
