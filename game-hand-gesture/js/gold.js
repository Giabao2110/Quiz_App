export class GoldOre {
    constructor(x,y,value=10){ this.x=x; this.baseY=y; this.y=y; this.value=value; this.collected=false; this.time=0; this.width=20; }
    update(){ this.time += 0.04; this.y = this.baseY + Math.sin(this.time) * 2; }
    draw(ctx){ ctx.fillStyle='#FFD700'; ctx.beginPath(); ctx.arc(this.x,this.y,this.width/2,0,Math.PI*2); ctx.fill(); ctx.fillStyle='rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.arc(this.x-5,this.y-5,3,0,Math.PI*2); ctx.fill(); }
    getBounds(){ return { x:this.x - this.width/2, y:this.y - this.width/2, width:this.width, height:this.width }; }
}
