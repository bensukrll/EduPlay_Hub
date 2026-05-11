// map.js

let gameData = {};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/static/game_data.json');
        gameData = await res.json();

        console.log('gameData yüklendi:', gameData);
        console.log('CURRENT_LEVEL:', CURRENT_LEVEL);
        console.log('CURRENT_UNIT:', CURRENT_UNIT);

    } catch (error) {
        console.error('game_data.json yüklenemedi:', error);
    }
});

function showGameInfo(btn) {
    const gameKey = btn.dataset.gameKey;

    console.log('Seçilen oyun:', gameKey);

    const unitData = gameData?.[CURRENT_LEVEL]?.[CURRENT_UNIT];

    if (!unitData) {
        console.warn('Ünite verisi bulunamadı:', CURRENT_LEVEL, CURRENT_UNIT);
        return;
    }

    const game = unitData.games?.[gameKey];

    if (!game) {
        console.warn('Oyun verisi bulunamadı:', gameKey);
        return;
    }

    // Seçili oyun butonu vurgusu
    document.querySelectorAll('.game-level-btn').forEach(button => {
        button.classList.remove('selected');
    });

    btn.classList.add('selected');

    // Panel elemanları
    const rightPanel = document.getElementById('right-panel');
    const gameInfoCard = document.getElementById('game-info-card');
    const placeholder = document.getElementById('panel-placeholder');

    // Sağ paneli göster
    rightPanel.classList.add('visible');
    gameInfoCard.classList.add('active');

    // Placeholder varsa gizle
    if (placeholder) {
        placeholder.style.display = 'none';
    }

    // Tüm bilgiler JSON'dan geliyor
    document.getElementById('game-grade-badge').textContent = unitData.grade || '';
    document.getElementById('game-week-badge').textContent = game.week || '';
    document.getElementById('game-unit-name').textContent = `${unitData.unitNumber || ''} · ${unitData.title || ''}`;
    document.getElementById('game-info-title').textContent = game.title || '';
    document.getElementById('game-info-desc').textContent = game.description || '';
    document.getElementById('game-outcome-text').textContent = game.outcome || '';

    // Başla butonu
    const gameUrl = `/play/${gameKey}?source=${CURRENT_LEVEL}`;

    document.getElementById('start-btn').onclick = () => {
        window.location.href = gameUrl;
    };
}