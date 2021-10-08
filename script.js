let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;
const backGround = new Image();
backGround.src = "./media/night-sky.png";
const ship = new Image();
ship.src = "./media/airplaine.png";
const alien = new Image();
alien.src = "./media/evil.png";
const blood = new Image();
blood.src = "./media/blood.png";
const explode = new Audio("./audio/explode.wav");
const gameAudio = new Audio("./audio/game.wav");
const collides = new Audio("./audio/collides.wav");
const asteroid = new Image();
asteroid.src = "./media/asteroid.png";
const asteroidCollides = new Audio("./audio/asteroid.wav");
const redShip = new Image();
redShip.src = "./media/ship.png";
const explosion = new Image();
explosion.src = "./media/explosion.png";

let index = 0;
let speed = 6;
let step = 0;
let scale = 3;
let size = [32 * scale, 32 * scale];
let xW = 32 * scale;
let yH = 32 * scale;
let MOVEMENT_SPEED = 10;
let positionX = canvas.width / 2 - size[0] / 2;
let positionY = canvas.height / 2 - size[1] / 2;
let keyPresses = {};
let bullets = [];
let aliens = [];
let bloods = [];
let h = 0;
let c = 0;
let gamePlaying = false;
let bulletSounds = [];
let gameOver = false;
let l = 40;
let asteroids = [];
let humanIsWinner = false;
let possibleObstacles = true;
let possibleBullets = true;
let redShips = [];
let explosions = [];

class Ship {
  constructor(positionX, positionY, xW, yH) {
    this.step = 0;
    this.positionX = positionX;
    this.positionY = positionY;
    this.xW = xW;
    this.yH = yH;
  }

  draw(ctx, x, y) {
    this.step += 0.1;
    if (this.step >= 4) {
      this.step -= 4;
    }
    this.positionX = x;
    this.positionY = y;
    ctx.drawImage(
      ship,
      32 * Math.floor(this.step),
      0,
      32,
      32,
      this.positionX,
      this.positionY,
      this.xW,
      this.yH
    );
  }
}

class Alien {
  constructor(shipX, shipY) {
    this.speed = 8;
    this.positionX = Math.floor(Math.random() * canvas.width);
    this.positionY = 0;
    this.xW = 96;
    this.yH = 96;
    this.step = 0;
    this.shipX = shipX;
    this.shipY = shipY;
  }

  draw(ctx) {
    this.step += 0.08;
    if (this.step > 2) {
      this.step -= 2;
    }
    if (this.positionX < 0) {
      this.positionX = this.xW;
    }
    if (this.positionX > canvas.width - this.xW) {
      this.positionX = canvas.width - this.xW;
    }
    ctx.drawImage(
      alien,
      0,
      32 * Math.floor(this.step),
      32,
      32,
      this.positionX,
      this.positionY,
      this.xW,
      this.yH
    );
  }

  update(ctx) {
    this.draw(ctx);
    this.positionY += this.speed;
    if (this.positionY > canvas.height) {
      deleteEnemy();
    }
  }

  destroy(bullet) {
    if (collision(this, bullet)) {
      killEnemy(this, this.positionX + this.xW / 4, this.positionY);
      deleteBullet();
    }
  }

  shipVsAlien(vaisseau) {
    if (collision(this, vaisseau)) {
      l -= 0.1;
      collides.play();
    }
  }
}

class RedShip {
  constructor(shipX, shipY) {
    this.speed = 15;
    this.positionX = Math.floor(Math.random() * canvas.width);
    this.positionY = 0;
    this.xW = 120;
    this.yH = 120;
    this.step = 0;
    this.shipX = shipX;
    this.shipY = shipY;
  }

  draw(ctx) {
    this.step += 0.08;
    if (this.step > 4) {
      this.step -= 4;
    }
    if (this.positionX < 0) {
      this.positionX = this.xW;
    }
    if (this.positionX > canvas.width - this.xW) {
      this.positionX = canvas.width - this.xW;
    }
    ctx.drawImage(
      redShip,
      0,
      32 * Math.floor(this.step),
      32,
      32,
      this.positionX,
      this.positionY,
      this.xW,
      this.yH
    );
  }

  update(ctx) {
    this.draw(ctx);
    this.positionY += this.speed;
    if (this.positionY > canvas.height) {
      deleteRedShip();
    }
  }

  destroy(bullet) {
    if (collision(this, bullet)) {
      killRedShip(this, this.positionX + this.xW / 4, this.positionY);
      deleteBullet();
    }
  }

  shipVsRedShip(vaisseau) {
    if (collision(this, vaisseau)) {
      l -= 0.05;
      collides.play();
    }
  }
}

class Asteroid {
  constructor() {
    this.speed = 5;
    this.positionX = Math.floor(Math.random() * canvas.width);
    this.positionY = 0;
    this.xW = 120;
    this.yH = 120;
    this.step = 0;
  }

  draw(ctx) {
    this.step += 0.08;
    if (this.step > 4) {
      this.step -= 4;
    }
    if (this.positionX < 0) {
      this.positionX = this.xW;
    }
    if (this.positionX > canvas.width - this.xW) {
      this.positionX = canvas.width - this.xW;
    }
    ctx.drawImage(
      asteroid,
      0,
      32 * Math.floor(this.step),
      32,
      32,
      this.positionX,
      this.positionY,
      this.xW,
      this.yH
    );
  }

  update(ctx) {
    this.draw(ctx);
    this.positionY += this.speed;
    if (this.positionY > canvas.height) {
      deleteAsteroid();
    }
  }

  collidesBulletAsteroid(bullet) {
    if (collision(this, bullet)) {
      deleteBullet();
    }
  }

  shipVsAsteroid(vaisseau) {
    if (collision(this, vaisseau)) {
      l -= 0.1;
      asteroidCollides.play();
    }
  }
}

class Bullet {
  constructor(positionX, positionY) {
    this.positionX = positionX + 32;
    this.positionY = positionY;
    this.xW = 4;
    this.yH = 8;
    this.speed = 20;
    this.step = 0.15;
  }

  draw(ctx) {
    ctx.fillRect(this.positionX, this.positionY, this.xW, this.yH);
    ctx.fillStyle = "#fff";
  }

  update(ctx) {
    this.draw(ctx);
    this.positionY -= this.speed;
    if (this.positionY <= 0) {
      deleteBullet();
    }
  }
}

class Blood {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.step = 0;
  }

  draw(ctx) {
    this.step += 2;
    if (this.step > 4) {
      this.step -= 4;
    }
    ctx.drawImage(
      blood,
      0,
      32 * Math.floor(step),
      32,
      32,
      this.x,
      this.y,
      64,
      64
    );
    setTimeout(function () {
      deleteBlood(this);
    }, 100);
  }
}

class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.step = 0;
  }

  draw(ctx) {
    this.step += 2;
    if (this.step > 4) {
      this.step -= 4;
    }
    ctx.drawImage(
      explosion,
      0,
      32 * Math.floor(step),
      32,
      32,
      this.x,
      this.y,
      64,
      64
    );
    setTimeout(function () {
      deleteExplosion(this);
    }, 100);
  }
}

function stepX() {
  step += 0.1;
  if (step >= 4) {
    step -= 4;
  }
}

let vaisseau = new Ship(positionX, positionY, xW, yH);

function direction() {
  window.addEventListener(
    "keydown",
    (event) => {
      keyPresses[event.code] = true;
    },
    true
  );

  window.addEventListener(
    "keyup",
    (event) => {
      keyPresses[event.code] = false;
    },
    false
  );

  if (keyPresses.ArrowUp && positionY > 0) {
    positionY -= MOVEMENT_SPEED;
  } else if (keyPresses.ArrowDown && positionY < canvas.height - size[1]) {
    positionY += MOVEMENT_SPEED;
  }

  if (keyPresses.ArrowLeft && positionX > 0) {
    positionX -= MOVEMENT_SPEED;
  } else if (keyPresses.ArrowRight && positionX < canvas.width - size[0]) {
    positionX += MOVEMENT_SPEED;
  }

  if (keyPresses.Space) {
    shoot();
  }
}

function shoot() {
  if (bullets.length > 8) {
    possibleBullets = false;
  }
  if (bullets.length < 8) {
    possibleBullets = true;
  }
  if (possibleBullets) {
    bullets.push(new Bullet(positionX, positionY));
    bulletSound();
  }
}

function bulletSound() {
  bulletSounds.push(new Audio("./audio/laser.wav"));
  for (let i = 0; i < bulletSounds.length; i++) {
    if (i > 0) {
      bulletSounds[i].play();
      bulletSounds.splice(i, 1);
    }
  }
}

function newAlien() {
  aliens.push(new Alien(positionX, positionY));
}

function alienLoop() {
  let interval = 800;

  aliens.splice(0, aliens.length);
  bullets.splice(0, bullets.length);

  setInterval(() => {
    newAlien();
  }, interval);
}

function newRedShip() {
  redShips.push(new RedShip(positionX, positionY));
}

function redShipLoop() {
  let interval = 2500;

  redShips.splice(0, redShips.length);
  bullets.splice(0, bullets.length);

  setInterval(() => {
    newRedShip();
  }, interval);
}

function newAsteroid() {
  asteroids.push(new Asteroid());
}

function asteroidLoop() {
  let interval = 3000;

  asteroids.splice(0, asteroids.length);

  setInterval(() => {
    newAsteroid();
  }, interval);
}

function deleteEnemy() {
  aliens.splice(0, 1);
  c += 1;
}

function deleteRedShip() {
  redShips.splice(0, 1);
  c += 2;
}

function deleteAsteroid() {
  asteroids.splice(0, 1);
}

function deleteBullet() {
  bullets.splice(0, 1);
}

function deleteBlood(blood) {
  bloods.splice(bloods.indexOf(blood), 1);
}

function deleteExplosion(explosion) {
  explosions.splice(explosions.indexOf(explosion), 1);
}

function killEnemy(alien, x, y) {
  explode.play();
  aliens.splice(aliens.indexOf(alien), 1);
  bloods.push(new Blood(x, y));
  h += 1;
}

function killRedShip(redship, x, y) {
  explode.play();
  redShips.splice(redShips.indexOf(redship), 1);
  explosions.push(new Explosion(x, y));
  h += 2;
}

function collision(alien, bullet) {
  return (
    bullet.positionX < alien.positionX + alien.xW &&
    bullet.positionX + bullet.xW > alien.positionX &&
    bullet.positionY < alien.positionY + alien.yH &&
    bullet.positionX < alien.xW + alien.positionX
  );
}

function computerWin() {
  gameAudio.pause();
  gameAudio.currentTime = 0;

  gameOver = true;
  gamePlaying = false;

  ctx.fillStyle = "#fff";

  const txt1 = `GAME OVER`;
  ctx.font = "bold 40px courier";
  ctx.fillText(txt1, canvas.width / 2 - ctx.measureText(txt1).width / 2, 220);

  const txt = `Computer beats you with ${c - Math.floor(h)} points !`;
  ctx.font = "bold 30px courier";
  ctx.fillText(txt, canvas.width / 2 - ctx.measureText(txt).width / 2, 300);

  const txt2 = "Appuyer sur Espace pour recommencer";
  ctx.font = "bold 25px courier";
  ctx.fillText(txt2, canvas.width / 2 - ctx.measureText(txt2).width / 2, 550);
}

function dead() {
  gameAudio.pause();
  gameAudio.currentTime = 0;

  gameOver = true;
  gamePlaying = false;

  ctx.fillStyle = "#fff";

  const txt1 = `GAME OVER`;
  ctx.font = "bold 40px courier";
  ctx.fillText(txt1, canvas.width / 2 - ctx.measureText(txt1).width / 2, 250);

  const txt2 = "Appuyer sur Espace pour recommencer";
  ctx.font = "bold 25px courier";
  ctx.fillText(txt2, canvas.width / 2 - ctx.measureText(txt2).width / 2, 550);
}

function humanWin() {
  gameAudio.pause();
  gameAudio.currentTime = 0;

  humanIsWinner = true;
  gamePlaying = false;

  document.querySelector(".formulaire").classList.add("formulaire_visible");
  document.getElementById(
    "youwin"
  ).innerHTML = `YOU WIN ! With a score of ${Math.floor(h - c + l)} !`;
}

document.getElementById("formulaire").addEventListener("submit", (e) => {
  e.preventDefault();

  let n = document.getElementById("name");
  let i = {};
  i.name = n.value;
  let s = Math.floor(h - c + l);
  let erreur = document.getElementById("erreur");

  const toSend = {
    name: i.name,
    score: s,
  };

  const jsonString = JSON.stringify(toSend);
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let response = this.response;
      if (response.success) {
        document.location.reload();
      } else {
        erreur.innerHTML = `<p class="alert alert-danger">${response.msg}</p>`;
      }
    } else if (this.readyState == 4) {
      alert("Une erreur est survenue");
    }
  };

  xhr.open("POST", "record.php", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.responseType = "json";
  xhr.send(jsonString);

  return false;
});

function draw() {
  stepX();
  direction();

  ctx.drawImage(
    backGround,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    ((index * speed) % canvas.height) - canvas.height,
    canvas.width,
    canvas.height
  );
  ctx.drawImage(
    backGround,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    (index * speed) % canvas.height,
    canvas.width,
    canvas.height
  );

  for (let i = 0; i < bullets.length; i++) {
    bullets[i].update(ctx);
  }

  aliens.forEach((alien) => {
    alien.update(ctx);
    if (alien && bullets[0]) {
      alien.destroy(bullets[0]);
    }
    if (alien) {
      alien.shipVsAlien(vaisseau);
    }
  });

  redShips.forEach((red) => {
    red.update(ctx);
    if (red && bullets[0]) {
      red.destroy(bullets[0]);
    }
    if (red) {
      red.shipVsRedShip(vaisseau);
    }
  });

  asteroids.forEach((aster) => {
    aster.update(ctx);
    if (aster && bullets[0]) {
      aster.collidesBulletAsteroid(bullets[0]);
    }
    if (aster) {
      aster.shipVsAsteroid(vaisseau);
    }
  });

  for (let i = 0; i < bloods.length; i++) {
    bloods[i].draw(ctx);
  }

  for (let i = 0; i < explosions.length; i++) {
    explosions[i].draw(ctx);
  }

  vaisseau.draw(ctx, positionX, positionY);

  document.getElementById("computerScore").innerHTML = `Computer Score: ${c}`;
  document.getElementById("humanScore").innerHTML = `Human Score: ${Math.floor(
    h
  )}`;
  document.getElementById("lifePoint").innerHTML = `Life: ${Math.floor(l)}`;
}

function update() {
  index++;

  ctx.drawImage(
    backGround,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    ((index * speed) % canvas.height) - canvas.height,
    canvas.width,
    canvas.height
  );
  ctx.drawImage(
    backGround,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    (index * speed) % canvas.height,
    canvas.width,
    canvas.height
  );

  if (gamePlaying && gameOver === false && humanIsWinner === false) {
    gameAudio.play();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  } else if (gamePlaying === false && gameOver === false) {
    vaisseau.draw(ctx, positionX, positionY);

    ctx.fillStyle = "#fff";
    const txt = "Appuyer sur Espace pour commencer";
    ctx.font = "bold 30px courier";
    ctx.fillText(txt, canvas.width / 2 - ctx.measureText(txt).width / 2, 550);

    ctx.font = "bold 18px courier";
    const txtCommandes =
      "Haut: up - Bas: down - Gauche: left - Droite: right | Tirer: spaceBar";
    ctx.fillText(
      txtCommandes,
      canvas.width / 2 - ctx.measureText(txtCommandes).width / 2,
      630
    );

    ctx.font = "bold 18px courier";
    const txtCredit =
      "Game design, music and programmation: Anthony Charretier";
    ctx.fillText(
      txtCredit,
      canvas.width / 2 - ctx.measureText(txtCredit).width / 2,
      730
    );
  }

  if (c >= 100) {
    computerWin();
  } else if (Math.floor(h) >= 100) {
    humanWin();
  } else if (Math.floor(l) <= 0) {
    dead();
  }

  window.requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    gamePlaying = true;
    if (gameOver) {
      document.location.reload();
    }
    if (possibleObstacles) {
      alienLoop();
      asteroidLoop();
      redShipLoop();
    }
    possibleObstacles = false;
  }
});

update();
