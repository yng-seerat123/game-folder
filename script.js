// ========== REGISTERED PLAYERS ==========
let players = [];

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
    if (activeBtn) activeBtn.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));

    if (step === 3) {
        document.getElementById('confirm-name').textContent = document.getElementById('player-name').value || '-';
        document.getElementById('confirm-id').textContent = document.getElementById('player-id').value || '-';
        document.getElementById('confirm-phone').textContent = document.getElementById('player-phone').value || '-';
        document.getElementById('confirm-email').textContent = document.getElementById('player-email').value || '-';
        const selectedGames = [];
        document.querySelectorAll('input[name="game"]:checked').forEach(cb => selectedGames.push(cb.value));
        document.getElementById('confirm-games').textContent = selectedGames.length > 0 ? selectedGames.join(', ') : '-';
        document.getElementById('confirm-platform').textContent = document.getElementById('player-platform').value || '-';
    }

    document.getElementById(`form-step-${step}`).classList.add('active');
    document.getElementById(`step-${step}-indicator`).classList.add('active');
    for (let i = 1; i < step; i++) {
        document.getElementById(`step-${i}-indicator`).classList.add('completed');
    }
}

function submitRegistration(event) {
    event.preventDefault();
    const name = document.getElementById('player-name').value;
    const gameId = document.getElementById('player-id').value;
    const phone = document.getElementById('player-phone').value;
    const email = document.getElementById('player-email').value;
    const platform = document.getElementById('player-platform').value;
    const discord = document.getElementById('player-discord').value;
    const selectedGames = [];
    document.querySelectorAll('input[name="game"]:checked').forEach(cb => selectedGames.push(cb.value));

    if (selectedGames.length === 0) { alert('⚠️ Please select at least one game!'); return; }
    if (!document.getElementById('agree-terms').checked) { alert('⚠️ Please agree to the tournament rules!'); return; }

    const player = {
        id: 'GX-' + Date.now().toString(36).toUpperCase(),
        name, gameId, phone, email,
        games: selectedGames.join(', '),
        platform, discord,
        registeredAt: new Date().toLocaleString()
    };
    players.unshift(player);

    document.getElementById('success-name').textContent = name;
    document.getElementById('success-id').textContent = player.id;
    document.getElementById('success-modal').classList.add('open');
    document.body.style.overflow = 'hidden';

    document.getElementById('registration-form').reset();
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById('form-step-1').classList.add('active');
    document.querySelectorAll('.step').forEach(s => { s.classList.remove('active', 'completed'); });
    document.getElementById('step-1-indicator').classList.add('active');
    updatePlayerCount();
}

function closeSuccess() {
    document.getElementById('success-modal').classList.remove('open');
    document.body.style.overflow = '';
}

function updatePlayerCount() {
    document.getElementById('registered-count').textContent = players.length;
    document.getElementById('total-players').textContent = players.length;
    const grid = document.getElementById('players-grid');
    if (players.length === 0) {
        grid.innerHTML = '<div class="no-players"><div class="no-players-icon">🎮</div><p>No players registered yet. Be the first!</p><button class="hero-btn primary" onclick="showSection(\'register\')">Register Now</button></div>';
    } else {
        grid.innerHTML = players.map(p => `
            <div class="player-card">
                <div class="player-avatar">${p.gameId.charAt(0).toUpperCase()}</div>
                <div class="player-info">
                    <h3>${p.name}</h3>
                    <span class="player-id-badge">${p.gameId}</span>
                    <div class="player-meta"><span>🎮 ${p.games}</span><span>🖥️ ${p.platform}</span></div>
                    <div class="player-registered">Registered: ${p.registeredAt}</div>
                </div>
            </div>`).join('');
    }
}

function filterPlayers() {
    const search = document.getElementById('player-search').value.toLowerCase();
    const filtered = players.filter(p => p.name.toLowerCase().includes(search) || p.gameId.toLowerCase().includes(search) || p.games.toLowerCase().includes(search));
    const grid = document.getElementById('players-grid');
    if (filtered.length === 0) {
        grid.innerHTML = `<div class="no-players"><div class="no-players-icon">🔍</div><p>No players match "${search}"</p></div>`;
    } else {
        grid.innerHTML = filtered.map(p => `
            <div class="player-card">
                <div class="player-avatar">${p.gameId.charAt(0).toUpperCase()}</div>
                <div class="player-info">
                    <h3>${p.name}</h3><span class="player-id-badge">${p.gameId}</span>
                    <div class="player-meta"><span>🎮 ${p.games}</span><span>🖥️ ${p.platform}</span></div>
                    <div class="player-registered">Registered: ${p.registeredAt}</div>
                </div>
            </div>`).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => { updatePlayerCount(); });
