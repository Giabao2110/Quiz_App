import { clamp } from './utils.js';

export class Player {
    constructor(x,y){
        this.x = x; this.y = y; this.width=40; this.height=60;
        this.vx = 0; this.vy = 0; this.gravity=0.7; this.jumpPower=12; this.isJumping=false; this.groundY = y;
    }
    update(){
        if (this.isJumping){ this.vy += this.gravity; this.y += this.vy; if (this.y >= this.groundY){ this.y = this.groundY; this.vy=0; this.isJumping=false; } }
        this.x += this.vx; this.vx *= 0.85; this.x = clamp(this.x, this.width/2, 640 - this.width/2);
    }
    moveLeft(s=5){ this.vx -= s; }
    moveRight(s=5){ this.vx += s; }
    jump(){ if (!this.isJumping){ this.vy = -this.jumpPower; this.isJumping=true; } }
    stop(){ this.vx = 0; }
    draw(ctx){ ctx.fillStyle='#FF6B6B'; ctx.fillRect(this.x - this.width/2, this.y, this.width, this.height); ctx.fillStyle='white'; ctx.fillRect(this.x - this.width/2 +8, this.y+10,6,6); ctx.fillRect(this.x - this.width/2 +18, this.y+10,6,6); ctx.strokeStyle='white'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(this.x, this.y+28,5,0,Math.PI); ctx.stroke(); }
    getBounds(){ return { x: this.x - this.width/2, y:this.y, width:this.width, height:this.height }; }
}
