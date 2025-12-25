export class UIManager {
    updateStats(level, coins, score){ document.getElementById('level').textContent = level; document.getElementById('coins').textContent = Math.floor(coins); document.getElementById('score').textContent = Math.floor(score); }
    showGesture(name){ const display = document.getElementById('gesture-display'); const map = { 'SWIPE_UP':'⬆️ Swipe Up','SWIPE_DOWN':'⬇️ Swipe Down','SWIPE_LEFT':'⬅️ Swipe Left','SWIPE_RIGHT':'➡️ Swipe Right','PINCH':'🤏 Pinch','OPEN_HAND':'✋ Open Hand','FIST':'✊ Fist','POINT':'☝️ Point' }; display.textContent = map[name] || 'Detecting...'; display.classList.add('active'); setTimeout(()=>display.classList.remove('active'),300); }
    showGameOver(score, coins){ const modal = document.createElement('div'); modal.className='game-over-modal'; modal.innerHTML = `<div class="game-over-content"><h1>🎮 Game Over</h1><p>Score: <strong>${score}</strong></p><p>Coins: <strong>${coins}</strong></p></div>`; document.body.appendChild(modal); }
    hideGameOver(){ const m = document.querySelector('.game-over-modal'); if(m) m.remove(); }
}
