import { Player } from './player.js';
import { GoldOre } from './gold.js';
import { randomRange } from './utils.js';

export class GameEngine {
    constructor(width=640,height=480){
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = width; this.height = height;
        this.player = new Player(this.width/2, this.height - 100);
        this.gold = []; this.level = 1; this.score = 0; this.coins = 0; this.isGameOver=false; this.spawnRate = 2;
        this.handTarget = null; // {x,y} in game canvas coordinates
        this.isPinching = false;
        this.initGame();
    }
    initGame(){ for(let i=0;i<5;i++) this.spawnGold(); }
    spawnGold(){ const x = randomRange(30,this.width-30); const y = randomRange(60,this.height-160); this.gold.push(new GoldOre(x,y,10 + this.level*5)); }
    handleGesture(g, handPos){
        if(this.isGameOver) return;
        switch(g){
            case 'SWIPE_LEFT': this.player.moveLeft(12); break;
            case 'SWIPE_RIGHT': this.player.moveRight(12); break;
            case 'SWIPE_UP': this.player.jump(); break;
            case 'SWIPE_DOWN': this.mineGold(); break;
            case 'PINCH':
                this.isPinching = true;
                if (handPos) this.collectNearbyAt(handPos.x, handPos.y);
                break;
            case 'OPEN_HAND': this.player.stop(); this.isPinching = false; break;
            case 'FIST': this.isPinching = true; break;
        }
    }

    setHandTarget(x,y){ this.handTarget = { x, y }; }

    clearHandTarget(){ this.handTarget = null; this.isPinching = false; }
    mineGold(){ const r=80; for(let i=this.gold.length-1;i>=0;i--){ const ore=this.gold[i]; const dx=ore.x - this.player.x; const dy=ore.y - (this.player.y + this.player.height); const d=Math.sqrt(dx*dx+dy*dy); if(d<r){ this.coins += ore.value; this.score += ore.value*10; this.gold.splice(i,1); } } if(this.gold.length<3) this.spawnGold(); }
    collectNearby(){
        // backward compatibility: collect near player center
        this.collectNearbyAt(this.player.x, this.player.y + this.player.height/2);
    }

    collectNearbyAt(x,y){
        const grabRadius = 90; // pixels
        for (let i = this.gold.length - 1; i >= 0; i--) {
            const ore = this.gold[i];
            const dx = ore.x - x;
            const dy = ore.y - y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < grabRadius) {
                this.coins += ore.value * 1.5;
                this.score += ore.value * 15;
                this.gold.splice(i,1);
            }
        }
        if (this.gold.length < 3) this.spawnGold();
    }
    update(dt=1/60){ if(this.isGameOver) return; this.player.update(); this.gold.forEach(g=>g.update()); if(Math.random() < this.spawnRate*dt && this.gold.length<10) this.spawnGold(); const newLevel = Math.floor(this.score/1000) + 1; if(newLevel>this.level){ this.level=newLevel; this.spawnRate += 0.5; } }
    draw(){
        this.ctx.clearRect(0,0,this.width,this.height);
        this.ctx.fillStyle='rgba(135,206,235,0.12)';
        this.ctx.fillRect(0,0,this.width,this.height);
        this.ctx.fillStyle='#8B7355';
        this.ctx.fillRect(0,this.height-60,this.width,60);
        this.ctx.fillStyle='#4CAF50';
        this.ctx.fillRect(0,this.height-65,this.width,5);

        this.player.draw(this.ctx);
        this.gold.forEach(g=>g.draw(this.ctx));

        // Draw rope/pulley from player to hand target (if available)
        if (this.handTarget) {
            const sx = this.player.x;
            const sy = this.player.y + this.player.height / 2;
            const tx = this.handTarget.x;
            const ty = this.handTarget.y;

            // rope shadow
            this.ctx.strokeStyle = 'rgba(0,0,0,0.12)';
            this.ctx.lineWidth = 6;
            this.ctx.beginPath();
            this.ctx.moveTo(sx, sy + 2);
            this.ctx.lineTo(tx, ty + 2);
            this.ctx.stroke();

            // rope
            this.ctx.strokeStyle = '#6B4F2A';
            this.ctx.lineWidth = 3;
            this.ctx.setLineDash([6,4]);
            this.ctx.beginPath();
            this.ctx.moveTo(sx, sy);
            this.ctx.lineTo(tx, ty);
            this.ctx.stroke();
            this.ctx.setLineDash([]);

            // pulley handle at target
            this.ctx.fillStyle = this.isPinching ? '#FF8C00' : '#333';
            this.ctx.beginPath();
            this.ctx.arc(tx, ty, 8, 0, Math.PI*2);
            this.ctx.fill();
            this.ctx.fillStyle = 'white';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(this.isPinching ? '🤏' : '•', tx - 6, ty + 4);
        }

        this.ctx.fillStyle='rgba(0,0,0,0.5)';
        this.ctx.fillRect(0,0,200,40);
        this.ctx.fillStyle='white';
        this.ctx.font='14px Arial';
        this.ctx.fillText(`Gold: ${this.gold.length}`,10,25);
    }
    reset(){ this.player = new Player(this.width/2,this.height-100); this.gold=[]; this.level=1; this.score=0; this.coins=0; this.isGameOver=false; this.initGame(); }
    getState(){ return { level:this.level, coins:this.coins, score:this.score }; }
}
