let canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d");ctx.imageSmoothingEnabled=!1;const backGround=new Image;backGround.src="./media/night-sky.png";const ship=new Image;ship.src="./media/airplaine.png";const alien=new Image;alien.src="./media/evil.png";const blood=new Image;blood.src="./media/blood.png";const explode=new Audio("./audio/explode.wav"),gameAudio=new Audio("./audio/game.wav"),collides=new Audio("./audio/collides.wav"),asteroid=new Image;asteroid.src="./media/asteroid.png";const asteroidCollides=new Audio("./audio/asteroid.wav"),redShip=new Image;redShip.src="./media/ship.png";const explosion=new Image;explosion.src="./media/explosion.png";let index=0,speed=6,step=0,scale=3,size=[32*scale,32*scale],xW=32*scale,yH=32*scale,MOVEMENT_SPEED=10,positionX=canvas.width/2-size[0]/2,positionY=canvas.height/2-size[1]/2,keyPresses={},bullets=[],aliens=[],bloods=[],h=0,c=0,gamePlaying=!1,bulletSounds=[],gameOver=!1,l=40,asteroids=[],humanIsWinner=!1,possibleObstacles=!0,possibleBullets=!0,redShips=[],explosions=[];class Ship{constructor(e,t,i,s){this.step=0,this.positionX=e,this.positionY=t,this.xW=i,this.yH=s}draw(e,t,i){this.step+=.1,this.step>=4&&(this.step-=4),this.positionX=t,this.positionY=i,e.drawImage(ship,32*Math.floor(this.step),0,32,32,this.positionX,this.positionY,this.xW,this.yH)}}class Alien{constructor(e,t){this.speed=8,this.positionX=Math.floor(Math.random()*canvas.width),this.positionY=0,this.xW=96,this.yH=96,this.step=0,this.shipX=e,this.shipY=t}draw(e){this.step+=.08,this.step>2&&(this.step-=2),this.positionX<0&&(this.positionX=this.xW),this.positionX>canvas.width-this.xW&&(this.positionX=canvas.width-this.xW),e.drawImage(alien,0,32*Math.floor(this.step),32,32,this.positionX,this.positionY,this.xW,this.yH)}update(e){this.draw(e),this.positionY+=this.speed,this.positionY>canvas.height&&deleteEnemy()}destroy(e){collision(this,e)&&(killEnemy(this,this.positionX+this.xW/4,this.positionY),deleteBullet())}shipVsAlien(e){collision(this,e)&&(l-=.1,collides.play())}}class RedShip{constructor(e,t){this.speed=15,this.positionX=Math.floor(Math.random()*canvas.width),this.positionY=0,this.xW=120,this.yH=120,this.step=0,this.shipX=e,this.shipY=t}draw(e){this.step+=.08,this.step>4&&(this.step-=4),this.positionX<0&&(this.positionX=this.xW),this.positionX>canvas.width-this.xW&&(this.positionX=canvas.width-this.xW),e.drawImage(redShip,0,32*Math.floor(this.step),32,32,this.positionX,this.positionY,this.xW,this.yH)}update(e){this.draw(e),this.positionY+=this.speed,this.positionY>canvas.height&&deleteRedShip()}destroy(e){collision(this,e)&&(killRedShip(this,this.positionX+this.xW/4,this.positionY),deleteBullet())}shipVsRedShip(e){collision(this,e)&&(l-=.05,collides.play())}}class Asteroid{constructor(){this.speed=5,this.positionX=Math.floor(Math.random()*canvas.width),this.positionY=0,this.xW=120,this.yH=120,this.step=0}draw(e){this.step+=.08,this.step>4&&(this.step-=4),this.positionX<0&&(this.positionX=this.xW),this.positionX>canvas.width-this.xW&&(this.positionX=canvas.width-this.xW),e.drawImage(asteroid,0,32*Math.floor(this.step),32,32,this.positionX,this.positionY,this.xW,this.yH)}update(e){this.draw(e),this.positionY+=this.speed,this.positionY>canvas.height&&deleteAsteroid()}collidesBulletAsteroid(e){collision(this,e)&&deleteBullet()}shipVsAsteroid(e){collision(this,e)&&(l-=.1,asteroidCollides.play())}}class Bullet{constructor(e,t){this.positionX=e+32,this.positionY=t,this.xW=4,this.yH=8,this.speed=20,this.step=.15}draw(e){e.fillRect(this.positionX,this.positionY,this.xW,this.yH),e.fillStyle="#fff"}update(e){this.draw(e),this.positionY-=this.speed,this.positionY<=0&&deleteBullet()}}class Blood{constructor(e,t){this.x=e,this.y=t,this.step=0}draw(e){this.step+=2,this.step>4&&(this.step-=4),e.drawImage(blood,0,32*Math.floor(step),32,32,this.x,this.y,64,64),setTimeout(function(){deleteBlood(this)},100)}}class Explosion{constructor(e,t){this.x=e,this.y=t,this.step=0}draw(e){this.step+=2,this.step>4&&(this.step-=4),e.drawImage(explosion,0,32*Math.floor(step),32,32,this.x,this.y,64,64),setTimeout(function(){deleteExplosion(this)},100)}}function stepX(){(step+=.1)>=4&&(step-=4)}let vaisseau=new Ship(positionX,positionY,xW,yH);function direction(){window.addEventListener("keydown",e=>{keyPresses[e.code]=!0},!0),window.addEventListener("keyup",e=>{keyPresses[e.code]=!1},!1),keyPresses.ArrowUp&&positionY>0?positionY-=MOVEMENT_SPEED:keyPresses.ArrowDown&&positionY<canvas.height-size[1]&&(positionY+=MOVEMENT_SPEED),keyPresses.ArrowLeft&&positionX>0?positionX-=MOVEMENT_SPEED:keyPresses.ArrowRight&&positionX<canvas.width-size[0]&&(positionX+=MOVEMENT_SPEED),keyPresses.Space&&shoot()}function shoot(){bullets.length>8&&(possibleBullets=!1),bullets.length<8&&(possibleBullets=!0),possibleBullets&&(bullets.push(new Bullet(positionX,positionY)),bulletSound())}function bulletSound(){bulletSounds.push(new Audio("./audio/laser.wav"));for(let e=0;e<bulletSounds.length;e++)e>0&&(bulletSounds[e].play(),bulletSounds.splice(e,1))}function newAlien(){aliens.push(new Alien(positionX,positionY))}function alienLoop(){aliens.splice(0,aliens.length),bullets.splice(0,bullets.length),setInterval(()=>{newAlien()},800)}function newRedShip(){redShips.push(new RedShip(positionX,positionY))}function redShipLoop(){redShips.splice(0,redShips.length),bullets.splice(0,bullets.length),setInterval(()=>{newRedShip()},2500)}function newAsteroid(){asteroids.push(new Asteroid)}function asteroidLoop(){asteroids.splice(0,asteroids.length),setInterval(()=>{newAsteroid()},3e3)}function deleteEnemy(){aliens.splice(0,1),c+=1}function deleteRedShip(){redShips.splice(0,1),c+=2}function deleteAsteroid(){asteroids.splice(0,1)}function deleteBullet(){bullets.splice(0,1)}function deleteBlood(e){bloods.splice(bloods.indexOf(e),1)}function deleteExplosion(e){explosions.splice(explosions.indexOf(e),1)}function killEnemy(e,t,i){explode.play(),aliens.splice(aliens.indexOf(e),1),bloods.push(new Blood(t,i)),h+=1}function killRedShip(e,t,i){explode.play(),redShips.splice(redShips.indexOf(e),1),explosions.push(new Explosion(t,i)),h+=2}function collision(e,t){return t.positionX<e.positionX+e.xW&&t.positionX+t.xW>e.positionX&&t.positionY<e.positionY+e.yH&&t.positionX<e.xW+e.positionX}function computerWin(){gameAudio.pause(),gameAudio.currentTime=0,gameOver=!0,gamePlaying=!1,ctx.fillStyle="#fff";ctx.font="bold 40px courier",ctx.fillText("GAME OVER",canvas.width/2-ctx.measureText("GAME OVER").width/2,220);const e=`Computer beats you with ${c-Math.floor(h)} points !`;ctx.font="bold 30px courier",ctx.fillText(e,canvas.width/2-ctx.measureText(e).width/2,300);const t="Appuyer sur Espace pour recommencer";ctx.font="bold 25px courier",ctx.fillText(t,canvas.width/2-ctx.measureText(t).width/2,550)}function dead(){gameAudio.pause(),gameAudio.currentTime=0,gameOver=!0,gamePlaying=!1,ctx.fillStyle="#fff";ctx.font="bold 40px courier",ctx.fillText("GAME OVER",canvas.width/2-ctx.measureText("GAME OVER").width/2,250);const e="Appuyer sur Espace pour recommencer";ctx.font="bold 25px courier",ctx.fillText(e,canvas.width/2-ctx.measureText(e).width/2,550)}function humanWin(){gameAudio.pause(),gameAudio.currentTime=0,humanIsWinner=!0,gamePlaying=!1,document.querySelector(".formulaire").classList.add("formulaire_visible"),document.getElementById("youwin").innerHTML=`YOU WIN ! With a score of ${Math.floor(h-c+l)} !`}function draw(){stepX(),direction(),ctx.drawImage(backGround,0,0,canvas.width,canvas.height,0,index*speed%canvas.height-canvas.height,canvas.width,canvas.height),ctx.drawImage(backGround,0,0,canvas.width,canvas.height,0,index*speed%canvas.height,canvas.width,canvas.height);for(let e=0;e<bullets.length;e++)bullets[e].update(ctx);aliens.forEach(e=>{e.update(ctx),e&&bullets[0]&&e.destroy(bullets[0]),e&&e.shipVsAlien(vaisseau)}),redShips.forEach(e=>{e.update(ctx),e&&bullets[0]&&e.destroy(bullets[0]),e&&e.shipVsRedShip(vaisseau)}),asteroids.forEach(e=>{e.update(ctx),e&&bullets[0]&&e.collidesBulletAsteroid(bullets[0]),e&&e.shipVsAsteroid(vaisseau)});for(let e=0;e<bloods.length;e++)bloods[e].draw(ctx);for(let e=0;e<explosions.length;e++)explosions[e].draw(ctx);vaisseau.draw(ctx,positionX,positionY),document.getElementById("computerScore").innerHTML=`Computer Score: ${c}`,document.getElementById("humanScore").innerHTML=`Human Score: ${Math.floor(h)}`,document.getElementById("lifePoint").innerHTML=`Life: ${Math.floor(l)}`}function update(){if(index++,ctx.drawImage(backGround,0,0,canvas.width,canvas.height,0,index*speed%canvas.height-canvas.height,canvas.width,canvas.height),ctx.drawImage(backGround,0,0,canvas.width,canvas.height,0,index*speed%canvas.height,canvas.width,canvas.height),gamePlaying&&!1===gameOver&&!1===humanIsWinner)gameAudio.play(),ctx.clearRect(0,0,canvas.width,canvas.height),draw();else if(!1===gamePlaying&&!1===gameOver){vaisseau.draw(ctx,positionX,positionY),ctx.fillStyle="#fff";const e="Appuyer sur Espace pour commencer";ctx.font="bold 30px courier",ctx.fillText(e,canvas.width/2-ctx.measureText(e).width/2,550),ctx.font="bold 18px courier";const t="Haut: up - Bas: down - Gauche: left - Droite: right | Tirer: spaceBar";ctx.fillText(t,canvas.width/2-ctx.measureText(t).width/2,630),ctx.font="bold 18px courier";const i="Game design, music and programmation: Anthony Charretier";ctx.fillText(i,canvas.width/2-ctx.measureText(i).width/2,730)}c>=100?computerWin():Math.floor(h)>=100?humanWin():Math.floor(l)<=0&&dead(),window.requestAnimationFrame(update)}document.getElementById("formulaire").addEventListener("submit",e=>{e.preventDefault();let t=document.getElementById("name"),i={};i.name=t.value;let s=Math.floor(h-c+l),o=document.getElementById("erreur");const n={name:i.name,score:s},a=JSON.stringify(n),d=new XMLHttpRequest;return d.onreadystatechange=function(){if(4==this.readyState&&200==this.status){let e=this.response;e.success?document.location.reload():o.innerHTML=`<p class="alert alert-danger">${e.msg}</p>`}else 4==this.readyState&&alert("Une erreur est survenue")},d.open("POST","record.php",!0),d.setRequestHeader("Content-type","application/json"),d.responseType="json",d.send(a),!1}),document.addEventListener("keydown",e=>{"Space"===e.code&&(gamePlaying=!0,gameOver&&document.location.reload(),possibleObstacles&&(alienLoop(),asteroidLoop(),redShipLoop()),possibleObstacles=!1)}),update();